import {expect} from 'chai';
import {clearData} from '../../test_db_util';
import {addModule, addSection, createCourse, createUser, DEFAULT_MODULE, EMPTY_CHANGES_OBJ} from '../courses/test_course_util';
import {moduleRepository, quillRepository} from '@server/config/repository_config';
import {coursesHandler} from '@server/config/handler_config';
import {ModuleEntity, SaveModuleEntityPayload} from '@shared/modules';
import {deltaArrayDiff, DeltaArrOp} from '@shared/delta/diff_key_array';
import {DeltaStatic} from 'quill';
import {Delta} from '@shared/normalize_imports';
import {QuillEditorData} from '@shared/quill_editor';
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {createdQuillPlaceholderId} from "@shared/ids";

describe('Save module', function () {
    let courseId;
    let moduleId;

    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    before(function () {
        MockDate.set(now);
    });

    after(function () {
        MockDate.reset();
    });

    beforeEach(async function () {
        await clearData();
        await createUser();
        courseId = await createCourse();
        moduleId = await addModule();
    });

    describe('basic property changes', function () {
        beforeEach(async function () {
            // assert that the modules properties are set to the DEFAULT_MODULE property values
            let {active, title, timeEstimate, description, answerImmediately} = DEFAULT_MODULE;
            let defaultModule: ModuleEntity = {
                id: moduleId,
                headerDataId: null,
                version: 0,
                active, title, timeEstimate, description, answerImmediately,
                orderedContentQuestionIds: [],
                orderedContentIds: [],
                orderedQuestionIds: [],
                orderedSectionIds: [],
                lastModifiedAt: nowTimestamp,
                createdAt: nowTimestamp,
            };
            let currentModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(currentModule).to.deep.eq(defaultModule);
        });

        let basicModuleChange = (propChange): SaveModuleEntityPayload => {
            return {
                courseId,
                id: moduleId,
                changes: {
                    ...propChange,
                },
                contentQuestions: EMPTY_CHANGES_OBJ
            };

        };
        it('should update the module title field', async function () {
            let updatedTitle = 'The Best Title Update';
            let updatedModule = basicModuleChange({title: updatedTitle});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModuleEntity(moduleId);
            expect(module.title).to.equal(updatedTitle);
        });

        it('should update the module description field', async function () {
            let updatedDescription = 'The description has changed to this description of changing';
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({description: updatedDescription});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModuleEntity(moduleId);
            expect(module.description).to.equal(updatedDescription);
        });

        it('should update the module time estimate field', async function () {
            let updatedTimeEstimate = 100;
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({timeEstimate: updatedTimeEstimate});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModuleEntity(moduleId);

            expect(module.timeEstimate).to.equal(updatedTimeEstimate);
        });

        it('should update the module active field', async function () {
            let updatedActive = !DEFAULT_MODULE.active;
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({active: updatedActive});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModuleEntity(moduleId);

            expect(module.active).to.equal(updatedActive);
        });
    });

    describe('sections', function () {
        it('should add two sections and swap their order', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();

            const swappedArr = [section2Id, section1Id];
            let swapOrder: DeltaArrOp<string>[] = deltaArrayDiff([section1Id, section2Id], swappedArr);
            let currentModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    orderedSectionIds: swapOrder
                },
                contentQuestions: EMPTY_CHANGES_OBJ
            });

            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(swappedArr);
        });

        it('should add two sections and remove the first one', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();

            const updatedArr = [section2Id];
            let updateOps: DeltaArrOp<string>[] = deltaArrayDiff([section1Id, section2Id], updatedArr);
            let currentModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    orderedSectionIds: updateOps
                },
                contentQuestions: EMPTY_CHANGES_OBJ,
            });

            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(updatedArr);
        });


        it('should add three sections, make the third section first, and delete the section that was created second', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();
            let section3Id = await addSection();

            const updatedArr = [section3Id, section1Id];
            let updateOps: DeltaArrOp<string>[] = deltaArrayDiff([section1Id, section2Id, section3Id], updatedArr);
            // assert current module state
            let currentModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id, section3Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    orderedSectionIds: updateOps
                },
                contentQuestions: EMPTY_CHANGES_OBJ,
            });

            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(updatedArr);
        });
    });

    describe('content', function () {
        beforeEach(async function () {
            // assert current module does not have any content
            let currentModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(currentModule.orderedContentIds).deep.equal([]);
            expect(currentModule.orderedContentQuestionIds).deep.equal([]);
        });
        it('should add two content segments', async function () {
            const content1: DeltaStatic = new Delta().insert('some content');
            const content2: DeltaStatic = new Delta().insert('some other content');
            const placeholderId1 = createdQuillPlaceholderId();
            const placeholderId2 = createdQuillPlaceholderId();
            const orderedContentIds: DeltaArrOp<string>[] = [
                {
                    val: placeholderId1,
                    op: "ADD",
                    index: 0
                },
                {
                    val: placeholderId2,
                    op: "ADD",
                    index: 1
                }
            ];
            let saveModulePayload: SaveModuleEntityPayload = {
                courseId,
                id: moduleId,
                changes: {},
                contentQuestions: {
                    ...EMPTY_CHANGES_OBJ,
                    quillChanges: {
                        [placeholderId1]: content1,
                        [placeholderId2]: content2
                    },
                    orderedContentIds: orderedContentIds,
                    orderedContentQuestionIds: orderedContentIds
                },
            };


            await coursesHandler.saveModule(saveModulePayload);
            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);
            expect(updatedModule.orderedContentIds.length).to.eq(2);
            expect(updatedModule.orderedContentQuestionIds.length).to.eq(2);

            let quillContent = await quillRepository.loadMultipleQuillData(updatedModule.orderedContentIds);
            let populatedQuillContent = quillContent.map((data) => {
                return {
                    ...data,
                    editorJson: new Delta(data.editorJson.ops)
                }
            });
            let expectedQuillContent: QuillEditorData[] = [
                {
                    id: updatedModule.orderedContentIds[0],
                    version: 0,
                    lastModifiedAt: nowTimestamp,
                    createdAt: nowTimestamp,
                    editorJson: content1
                }, {
                    id: updatedModule.orderedContentIds[1],
                    version: 0,
                    lastModifiedAt: nowTimestamp,
                    createdAt: nowTimestamp,
                    editorJson: content2
                }

            ];
            expect(populatedQuillContent).to.have.deep.members(expectedQuillContent);
        });

        it('should add and update a content segment', async function () {
            const initialContent: DeltaStatic = new Delta().insert('some content');
            const contentPlaceholderId = createdQuillPlaceholderId();
            const orderedContentIds: DeltaArrOp<string>[] = [
                {
                    val: contentPlaceholderId,
                    op: "ADD",
                    index: 0
                }
            ];
            let saveAddedContentPayload: SaveModuleEntityPayload = {
                courseId, id: moduleId,
                changes: {},
                contentQuestions: {
                    ...EMPTY_CHANGES_OBJ,
                    quillChanges: {
                        [contentPlaceholderId]: initialContent
                    },
                    orderedContentIds: orderedContentIds,
                    orderedContentQuestionIds: orderedContentIds
                }
            };

            await coursesHandler.saveModule(saveAddedContentPayload);
            let moduleEntity: ModuleEntity = await moduleRepository.loadModuleEntity(moduleId);

            let updatedContent: DeltaStatic = new Delta().insert('some updated content');
            let updatedContentDiff: DeltaStatic = initialContent.diff(updatedContent);

            let saveUpdateContent: SaveModuleEntityPayload = {
                courseId, id: moduleId,
                changes: {},
                contentQuestions: {
                    ...EMPTY_CHANGES_OBJ,
                    quillChanges: {
                        [moduleEntity.orderedContentIds[0]]: updatedContentDiff

                    }
                }
            };

            await coursesHandler.saveModule(saveUpdateContent);

            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);

            let quillContent = await quillRepository.loadMultipleQuillData(updatedModule.orderedContentIds);
            expect(updatedModule.orderedContentIds.length).to.equal(1);
            // quill content matches updated content from applying updatedContentDiff
            expect(quillContent[0].editorJson.ops).to.deep.eq(updatedContent.ops);
        });

        it('should add two content segments, update the second one, and remove the first one', async function () {
            const content1: DeltaStatic = new Delta().insert('some content');
            const content2: DeltaStatic = new Delta().insert('some other content');
            const contentPlaceholderId1 = createdQuillPlaceholderId();
            const contentPlaceholderId2 = createdQuillPlaceholderId();
            const orderedContentIds: DeltaArrOp<string>[] = [
                {
                    val: contentPlaceholderId1,
                    op: "ADD",
                    index: 0
                },
                {
                    val: contentPlaceholderId2,
                    op: "ADD",
                    index: 1
                }
            ];
            let addContentSave: SaveModuleEntityPayload = {
                courseId, id: moduleId,
                changes: {},
                contentQuestions: {
                    ...EMPTY_CHANGES_OBJ,
                    quillChanges: {
                        [contentPlaceholderId1]: content1,
                        [contentPlaceholderId2]: content2
                    },
                    orderedContentIds: orderedContentIds,
                    orderedContentQuestionIds: orderedContentIds
                }
            };

            await coursesHandler.saveModule(addContentSave);
            let moduleEntity: ModuleEntity = await moduleRepository.loadModuleEntity(moduleId);

            let updatedContent: DeltaStatic = new Delta().insert('some updated content');
            let updatedContentDiff: DeltaStatic = content2.diff(updatedContent);

            let removeFirstContentOp = deltaArrayDiff(moduleEntity.orderedContentIds, [moduleEntity.orderedContentIds[1]]);
            let saveUpdateContent: SaveModuleEntityPayload = {
                courseId, id: moduleId,
                changes: {},
                contentQuestions: {
                    ...EMPTY_CHANGES_OBJ,
                    quillChanges: {
                        [moduleEntity.orderedContentIds[1]]: updatedContentDiff
                    },
                    orderedContentIds: removeFirstContentOp,
                    orderedContentQuestionIds: removeFirstContentOp
                }
            };

            await coursesHandler.saveModule(saveUpdateContent);
            let updatedModule = await moduleRepository.loadModuleEntity(moduleId);

            let quillContent = await quillRepository.loadMultipleQuillData(updatedModule.orderedContentIds);
            expect(updatedModule.orderedContentIds.length).to.equal(1);
            expect(quillContent[0].editorJson.ops).to.deep.eq(updatedContent.ops);
        });
    });
});