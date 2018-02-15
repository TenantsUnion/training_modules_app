import {expect} from 'chai';
import {clearData} from "../../test_db_util";
import * as MockDate from 'mockdate';
import * as Moment from 'moment';
import {Delta} from '../../../shared/normalize_imports';
import {SectionEntity} from "../../../shared/sections";
import {toDbTimestampFormat} from "../../../server/src/repository";
import {SectionInsertDbData} from "../../../server/src/section/admin/section_repository";
import {quillRepository, sectionRepository} from "../../../server/src/config/repository_config";

describe('Section Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        await clearData();
        MockDate.set(now);
    });

    let sectionData: SectionInsertDbData = {
        title: 'The best course',
        description: 'A descriptive description',
        active: true,
        answerImmediately: false,
        timeEstimate: 60,
        orderedContentIds: ['c1', 'c2', 'c3'],
        orderedQuestionIds: ['q1', 'cq', 'q3'],
        orderedContentQuestionIds: ['c1', 'c2', 'cq', 'q1', 'cq', 'c3']
    };

    let defaultSectionProps = {
        createdAt: nowTimestamp,
        lastModifiedAt: nowTimestamp,
        answerImmediately: false,
        headerDataId: null,
        version: 0,
    };

    it('should create a section', async function () {
        let sectionId = await sectionRepository.createSection(sectionData);
        let createdSection = await sectionRepository.loadSection(sectionId);
        expect(createdSection).to.deep.eq(<SectionEntity>{
            id: sectionId,
            ...defaultSectionProps,
            ...sectionData
        });
    });

    it('should save a section with updated values', async function () {
        let sectionId = await sectionRepository.createSection(sectionData);
        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);

        let quillId = 'QD4';
        // create quill data to satisfy FK constraint on header_data_id column
        await quillRepository.insertEditorJson(quillId, new Delta().insert('something or other'));
        let sectionUpdate: SectionEntity = {
            id: sectionId,
            version: 0,
            headerDataId: 'QD4',
            active: false,
            answerImmediately: true,
            timeEstimate: 100000,
            description: 'A very different description',
            title: 'This is a better title than before',
            orderedContentIds: ['QD1', 'QD3', 'QD4'],
            orderedQuestionIds: ['QU1'],
            orderedContentQuestionIds: ['QU1', 'QD1', 'QD3', 'QD4']
        };

        await sectionRepository.updateSection(sectionUpdate);
        let updatedModuleEntity = await sectionRepository.loadSection(sectionId);
        expect(updatedModuleEntity).to.deep.eq({
            ...sectionUpdate,
            createdAt: nowTimestamp,
            lastModifiedAt: toDbTimestampFormat(updated)
        });

    });

    it('should update the last modified time of a module', async function () {
        let sectionId = await sectionRepository.createSection(sectionData);
        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);

        await sectionRepository.updateLastModified(sectionId);
        expect(await sectionRepository.loadSection(sectionId)).to.deep.eq({
            id: sectionId,
            ...sectionData, ...defaultSectionProps,
            lastModifiedAt: toDbTimestampFormat(updated)
        });
    });
});