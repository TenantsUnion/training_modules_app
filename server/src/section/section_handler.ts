import {SectionRepository} from './section_repository';
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload, ViewSectionTransferData
} from 'sections.ts';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {QuillHandler} from '../quill/quill_handler';
import {updateArrOpsValues} from '../../../shared/delta/diff_key_array';
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
        let {id, changes, changes: {changeQuillContent, orderedContentIds}} = data;
        let quillIdMap = await this.quillHandler.handleQuillChanges(changeQuillContent);

        let section = await this.sectionRepo.loadSection(id);
        let updatedSection = applyDeltaDiff(section, {
            ...changes, orderedContentIds: updateArrOpsValues(orderedContentIds, quillIdMap)
        });
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