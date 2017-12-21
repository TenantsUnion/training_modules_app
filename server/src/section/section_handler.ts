import * as _ from "underscore";
import {SectionRepository} from './section_repository';
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload, ViewSectionTransferData
} from 'sections.ts';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {QuillHandler} from '../quill/quill_handler';
import {DeltaArrayOp, DeltaArrDiff} from '../../../shared/delta/diff_key_array';
import {applyDeltaDiff} from '../../../shared/delta/apply_delta';

export class SectionHandler {
    logger: LoggerInstance = getLogger('SectionHandler', 'info');

    constructor(private sectionRepo: SectionRepository,
                private quillHandler: QuillHandler) {
    }

    async createSection(createSectionData: CreateSectionEntityPayload): Promise<string> {
        let contentIds = await this.quillHandler.createTrainingEntityContent(createSectionData.orderedContentQuestions);
        let sectionId = await this.sectionRepo.createSection(createSectionData, contentIds);
        return sectionId;
    }

    async saveSection(data: SaveSectionEntityPayload): Promise<void> {
        let {changes: {changeQuillContent}} = data;

        await this.quillHandler.updateQuillContent(changeQuillContent);
        let insertQuillIds = await this.quillHandler.insertQuillContentFromUpdate(changeQuillContent);
        let quillIdMap = insertQuillIds.reduce((acc, quillIdObj) => {
            acc[quillIdObj.placeholderId] = quillIdObj.quillId;
            return acc;
        }, {});

        // substitute created quill ids into ordered content ids before saving section
        let orderedContentIds: DeltaArrDiff = data.changes.orderedContentIds.map((quillArrOp: DeltaArrayOp) => {
            let quillId = quillIdMap[quillArrOp.val];
            return quillId ? _.extend({}, quillArrOp, {val: quillId}) : quillArrOp;
        });

        let section = await this.sectionRepo.loadSection(data.id);
        let updatedSection = applyDeltaDiff(section, _.extend({}, data.changes, {
            orderedContentIds: orderedContentIds
        }));
        await this.sectionRepo.updateSection(updatedSection);
    }

    async removeSection(section: ViewSectionTransferData): Promise<void> {
        // let removeQuillContent = _.map(section.orderedContentIds, (quillId) => {
        //     return this.quillRepo.remove(quillId);
        // });
        //
        // await Promise.all(removeQuillContent);
        // await this.sectionRepo.remove(section.id);
    }
}