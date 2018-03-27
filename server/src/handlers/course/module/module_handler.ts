import {LoggerInstance} from 'winston';
import {ModuleRepository} from './module_repository';
import {getLogger} from "@server/log";
import {TrainingEntityHandler} from "@server/handlers/training/training_entity_handler";
import {
    CreateModuleEntityPayload, CreateModuleIdMap, ModuleEntity, ModuleEntityDiffDelta,
    SaveModuleEntityPayload, ViewModuleDescription
} from "@shared/modules";
import {ContentQuestionEntity} from "@shared/training_entity";
import {applyDeltaArrOps, updateArrOpsValues} from "@shared/delta/diff_key_array";
import {applyDeltaDiff} from "@shared/delta/apply_delta";
import {CreateSectionEntityPayload, SaveSectionEntityPayload} from "@shared/sections";

export class AdminModuleHandler {
    logger: LoggerInstance = getLogger('ModuleHandler', 'info');

    constructor(private moduleRepo: ModuleRepository,
                private trainingEntityHandler: TrainingEntityHandler) {
    }

    async createModule(createModuleData: CreateModuleEntityPayload): Promise<CreateModuleIdMap> {
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = createModuleData.contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(createModuleData.contentQuestions);
        let contentQuestions: ContentQuestionEntity = {
            orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)),
            orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
            orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
        };
        let moduleId = await this.moduleRepo.createModule({...createModuleData, ...contentQuestions});
        return {
            moduleId,
            ...placeholderIdMap
        }
    }

    async saveModule(data: SaveModuleEntityPayload): Promise<void> {
        let {id, changes, contentQuestions} = data;
        let module = await this.moduleRepo.loadModuleEntity(id);

        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(contentQuestions);
        let updatedModule: ModuleEntity = applyDeltaDiff(module, <ModuleEntityDiffDelta>{
            ...changes,
            // replace placeholder ids with ones return by quill handler
            orderedContentIds: updateArrOpsValues(orderedContentIds, placeholderIdMap),
            orderedContentQuestionIds: updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap),
            orderedQuestionIds: updateArrOpsValues(orderedQuestionIds, placeholderIdMap),

        });
        await this.moduleRepo.saveModule(updatedModule);
    }

    async removeModule(module: ViewModuleDescription): Promise<void> {
        // todo;
        // let removeQuillContent = _.map(module.orderedContentIds, (quillId) => {
        //     return this.quillRepo.remove(quillId);
        // });
        //
        // await Promise.all(removeQuillContent);
        // await this.moduleRepo.remove(module.id);
    }


    async addSection(createdSection: { sectionId: string } & CreateSectionEntityPayload): Promise<void> {
        let {moduleId, sectionId} = createdSection;
        await this.moduleRepo.addSection(moduleId, sectionId);
        this.logger.log('trace', `Added section: ${sectionId} to module: ${moduleId}`);
    }

    async saveSection(section: SaveSectionEntityPayload): Promise<void> {
        let {moduleId} = section;
        await this.moduleRepo.updateLastModified(moduleId);
    }
}
