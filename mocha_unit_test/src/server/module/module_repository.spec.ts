import {expect} from 'chai';
import {clearData} from "../../test_db_util";
import * as MockDate from 'mockdate';
import {ModuleEntity} from "@shared/modules";
import * as Moment from 'moment';
import {Delta} from '@shared/normalize_imports';
import {TIMESTAMP_FORMAT, toDbTimestampFormat} from "@server/repository";
import {ModuleInsertDbData} from "@server/module/admin/module_repository";
import {moduleRepository, quillRepository} from "@server/config/repository_config";

describe('Module Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        MockDate.set(now);
    });

    let moduleData: ModuleInsertDbData = {
        title: 'The best course',
        description: 'A descriptive description',
        active: true,
        answerImmediately: false,
        timeEstimate: 60,
        orderedContentIds: ['c1', 'c2', 'c3'],
        orderedQuestionIds: ['q1', 'cq', 'q3'],
        orderedContentQuestionIds: ['c1', 'c2', 'cq', 'q1', 'cq', 'c3']
    };

    let defaultModuleProps = {
        createdAt: nowTimestamp,
        lastModifiedAt: nowTimestamp,
        headerDataId: null,
        version: 0,
        orderedSectionIds: []
    };

    it('should create a module', async function () {
        let moduleId = await moduleRepository.createModule(moduleData);
        let createdModule = await moduleRepository.loadModuleEntity(moduleId);
        expect(createdModule).to.deep.eq(<ModuleEntity>{
            id: moduleId,
            ...defaultModuleProps,
            ...moduleData
        });
    });

    it('should save a module with updated values', async function () {
        let moduleId = await moduleRepository.createModule(moduleData);
        let updated = Moment(now).utc().add(1, 'hour');
        MockDate.set(updated);

        // create quill data to satisfy FK constraint on header_data_id column
        let quillId = await quillRepository.insertEditorJson(new Delta().insert('something or other'));
        let moduleUpdate: ModuleEntity = {
            id: moduleId,
            version: 0,
            headerDataId: 'QD4',
            active: false,
            answerImmediately: true,
            timeEstimate: 100000,
            description: 'A very different description',
            title: 'This is a better title than before',
            orderedSectionIds: ['SE2'],
            orderedContentIds: ['QD1', 'QD3', 'QD4'],
            orderedQuestionIds: ['QU1'],
            orderedContentQuestionIds: ['QU1', 'QD1', 'QD3', 'QD4']
        };

        await moduleRepository.saveModule(moduleUpdate);
        let updatedModuleEntity = await moduleRepository.loadModuleEntity(moduleId);
        expect(updatedModuleEntity).to.deep.eq({
            ...moduleUpdate,
            createdAt: nowTimestamp,
            lastModifiedAt: updated.format(TIMESTAMP_FORMAT)
        });

    });

    it('should update the last modified time of a module', async function () {
        let moduleId = await moduleRepository.createModule(moduleData);
        let updated = Moment(now).utc().add(1, 'hour').toDate();
        MockDate.set(updated);

        await moduleRepository.updateLastModified(moduleId);
        expect(await moduleRepository.loadModuleEntity(moduleId)).to.deep.eq({
            id: moduleId,
            ...moduleData, ...defaultModuleProps,
            lastModifiedAt: toDbTimestampFormat(updated)
        });
    });

    it('should add two a sections to a module', async function () {
        let sectionId1 = 'SE1';
        let sectionId2 = 'SE2';

        let moduleId = await moduleRepository.createModule(moduleData);

        await moduleRepository.addSection(moduleId, sectionId1);
        await moduleRepository.addSection(moduleId, sectionId2);
        expect(await moduleRepository.loadModuleEntity(moduleId)).to.deep.eq({
            id: moduleId,
            ...moduleData, ...defaultModuleProps,
            orderedSectionIds: [sectionId1, sectionId2]
        });
    });
});