import {SectionRepository} from './section_repository';
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload, ViewSectionTransferData
} from 'sections.ts';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {QuillHandler} from '../../training_entity/quill/quill_handler';
import {applyDeltaArrOps, updateArrOpsValues} from '../../../../shared/delta/diff_key_array';
import {applyDeltaDiff} from '../../../../shared/delta/apply_delta';
import {TrainingEntityHandler} from '../../training_entity/training_entity_handler';
import {ContentQuestionEntity, convertContentQuestionsDeltaToEntity} from '../../../../shared/training_entity';

export class SectionHandler {
    logger: LoggerInstance = getLogger('SectionHandler', 'info');

    constructor(private sectionRepo: SectionRepository,
                private trainingEntityHandler: TrainingEntityHandler) {
    }

    async createSection(createSectionData: CreateSectionEntityPayload): Promise<string> {
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = createSectionData.contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(createSectionData.contentQuestions);
        let contentQuestion: ContentQuestionEntity = {
            orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
            orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
            orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)),
        };
        return await this.sectionRepo.createSection(createSectionData, contentQuestion);
    }

    async saveSection(data: SaveSectionEntityPayload): Promise<void> {
        let {id, changes} = data;
        let section = await this.sectionRepo.loadSection(id);
        let contentQuestionOps = await this.trainingEntityHandler.handleContentQuestionDelta(changes);

        let updatedSection = applyDeltaDiff(section, {
            ...changes, ...contentQuestionOps
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