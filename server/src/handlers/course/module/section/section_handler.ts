import {TrainingEntityHandler} from "@h-training/training_entity_handler";
import {SectionRepository} from './section_repository';
import {LoggerInstance} from "winston";
import {getLogger} from "@server/log";
import {CreateSectionEntityPayload, SaveSectionEntityPayload, SectionIdMap, ViewSectionData} from "@shared/sections";
import {ContentQuestionEntity} from "@shared/training";
import {applyDeltaArrOps, updateArrOpsValues} from "@shared/delta/diff_key_array";
import {applyDeltaDiff} from "@shared/delta/apply_delta";

export class AdminSectionHandler {
    logger: LoggerInstance = getLogger('SectionHandler', 'info');

    constructor (private sectionRepo: SectionRepository,
                 private trainingEntityHandler: TrainingEntityHandler) {
    }

    async createSection (createSectionData: CreateSectionEntityPayload): Promise<SectionIdMap> {
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = createSectionData.contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(createSectionData.contentQuestions);
        let contentQuestion: ContentQuestionEntity = {
            orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
            orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
            orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)),
        };
        let sectionId = await this.sectionRepo.createSection({...createSectionData, ...contentQuestion});
        return {sectionId, ...placeholderIdMap};
    }

    async saveSection (data: SaveSectionEntityPayload): Promise<void> {
        let {id, changes, changes: {contentQuestions}} = data;
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(contentQuestions);
        let section = await this.sectionRepo.loadSection(id);

        let updatedSection = applyDeltaDiff(section, {
            ...changes,
            orderedContentIds: updateArrOpsValues(orderedContentIds, placeholderIdMap),
            orderedQuestionIds: updateArrOpsValues(orderedQuestionIds, placeholderIdMap),
            orderedContentQuestionIds: updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap),
        });
        await this.sectionRepo.updateSection(updatedSection);
    }

    async removeSection (section: ViewSectionData): Promise<void> {
        // let removeQuillContent = _.map(section.orderedContentIds, (quillId) => {
        //     return this.quillRepo.remove(quillId);
        // });
        //
        // await Promise.all(removeQuillContent);
        // await this.sectionRepo.remove(section.id);
    }
}