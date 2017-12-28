import {expect} from 'chai';
import {clearData} from '../../test_db_util';
import {addModule, addSection, createCourse, createUser, DEFAULT_MODULE, EMPTY_CHANGES_OBJ} from './test_course_util';
import {moduleRepository, sectionRepository} from '../../../../../server/src/config/repository_config';
import {coursesHandler} from '../../../../../server/src/config/handler_config';
import {ModuleEntityDiffDelta, SaveModuleEntityPayload} from '../../../../../shared/modules';
import {deltaArrayDiff, DeltaArrOps} from '../../../../../shared/delta/diff_key_array';

describe('Save module', function () {
    let courseId;
    let moduleId;

    beforeEach(async function () {
        await clearData();
        await createUser();
        courseId = await createCourse();
        moduleId = await addModule();
    });

    describe('basic property changes', function () {
        beforeEach(async function () {
            // assert that the modules properties are set to the DEFAULT_MODULE property values
            let currentModule = await moduleRepository.loadModule(moduleId);
            Object.keys(DEFAULT_MODULE).map((key) => {
                expect(currentModule[key]).to.deep.equal(DEFAULT_MODULE[key]);
            });
        });

        let basicModuleChange = (propChange): SaveModuleEntityPayload => {
            return {
                courseId,
                id: moduleId,
                changes: {
                    ...propChange,
                    ...EMPTY_CHANGES_OBJ
                }
            };

        };
        it('should update the module title field', async function () {
            let updatedTitle = 'The Best Title Update';
            let updatedModule = basicModuleChange({title: updatedTitle});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModule(moduleId);
            expect(module.title).to.equal(updatedTitle);
        });

        it('should update the module description field', async function () {
            let updatedDescription = 'The description has changed to this description of changing';
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({description: updatedDescription});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModule(moduleId);
            expect(module.description).to.equal(updatedDescription);
        });

        it('should update the module time estimate field', async function () {
            let updatedTimeEstimate = 100;
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({timeEstimate: updatedTimeEstimate});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModule(moduleId);

            expect(module.timeEstimate).to.equal(updatedTimeEstimate);
        });

        it('should update the module active field', async function () {
            let updatedActive = !DEFAULT_MODULE.active;
            let updatedModule: SaveModuleEntityPayload = basicModuleChange({active: updatedActive});

            await coursesHandler.saveModule(updatedModule);
            let module = await moduleRepository.loadModule(moduleId);

            expect(module.active).to.equal(updatedActive);
        });
    });

    describe('sections', function () {
        it('should add two sections and swap their order', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();

            const swappedArr = [section2Id, section1Id];
            let swapOrder: DeltaArrOps = deltaArrayDiff([section1Id, section2Id], swappedArr);
            let currentModule = await moduleRepository.loadModule(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    ...EMPTY_CHANGES_OBJ,
                    orderedSectionIds: swapOrder
                }
            });

            let updatedModule = await moduleRepository.loadModule(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(swappedArr);
        });

        it('should add two sections and remove the first one', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();

            const updatedArr = [section2Id];
            let updateOps: DeltaArrOps = deltaArrayDiff([section1Id, section2Id], updatedArr);
            let currentModule = await moduleRepository.loadModule(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    ...EMPTY_CHANGES_OBJ,
                    orderedSectionIds: updateOps
                }
            });

            let updatedModule = await moduleRepository.loadModule(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(updatedArr);
        });


        it('should add three sections, make the third section first, and delete the section that was created second', async function () {
            let section1Id = await addSection();
            let section2Id = await addSection();
            let section3Id = await addSection();

            const updatedArr = [section3Id, section1Id];
            let updateOps: DeltaArrOps = deltaArrayDiff([section1Id, section2Id, section3Id], updatedArr);
            // assert current module state
            let currentModule = await moduleRepository.loadModule(moduleId);
            expect(currentModule.orderedSectionIds).to.deep.eq([section1Id, section2Id, section3Id]);

            await coursesHandler.saveModule({
                id: moduleId,
                courseId: courseId,
                changes: {
                    ...EMPTY_CHANGES_OBJ,
                    orderedSectionIds: updateOps
                }
            });

            let updatedModule = await moduleRepository.loadModule(moduleId);
            expect(updatedModule.orderedSectionIds).to.deep.eq(updatedArr);
        });
    });

    xdescribe('content', function () {
        it('should add a content segment', function () {
            expect.fail("not implemented");
        });

        it('should add and update a content segment', function () {
            expect.fail("not implemented");
        });

        it('should add two content segments, update the second one, and remove the first one', function () {
            expect.fail("not implemented");
        });
    });
});