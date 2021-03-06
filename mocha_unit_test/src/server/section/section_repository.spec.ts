import MockDate from 'mockdate';
import Moment from 'moment';
import {expect} from 'chai';
import {SectionEntity} from "@shared/sections";
import {toDbTimestampFormat} from "@server/repository";
import {quillRepository, sectionRepository} from "@server/config/repository_config";
import {SectionInsertDbData} from "@server/handlers/course/module/section/section_repository";
import Delta from "quill-delta";

describe('Section Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        MockDate.set(now);
    });

    let sectionData: SectionInsertDbData = {
        title: 'The best course',
        description: 'A descriptive description',
        active: true,
        submitIndividually: false,
        timeEstimate: 60,
        orderedContentIds: ['c1', 'c2', 'c3'],
        orderedQuestionIds: ['q1', 'cq', 'q3'],
        orderedContentQuestionIds: ['c1', 'c2', 'cq', 'q1', 'cq', 'c3']
    };

    let defaultSectionProps = {
        createdAt: nowTimestamp,
        lastModifiedAt: nowTimestamp,
        submitIndividually: false,
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

        // create quill data to satisfy FK constraint on header_data_id column
        let quillId = await quillRepository.insertEditorJson(new Delta().insert('something or other'));
        let sectionUpdate: SectionEntity = {
            id: sectionId,
            version: 0,
            headerDataId: 'QD4',
            active: false,
            submitIndividually: true,
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