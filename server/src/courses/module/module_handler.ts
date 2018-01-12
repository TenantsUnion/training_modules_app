import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {ModuleRepository} from './module_repository';
import {QuillHandler} from '../../training_entity/quill/quill_handler';
import {
    CreateModuleEntityPayload, ModuleEntity, ModuleEntityDiffDelta, SaveModuleEntityPayload,
    ViewModuleTransferData
} from '../../../../shared/modules';
import {applyDeltaDiff} from '../../../../shared/delta/apply_delta';
import {applyDeltaArrOps, updateArrOpsValues} from '../../../../shared/delta/diff_key_array';
import {CreateSectionEntityPayload, SaveSectionEntityPayload} from '../../../../shared/sections';
import {TrainingEntityHandler} from '../../training_entity/training_entity_handler';
import {ContentQuestionEntity, convertContentQuestionsDeltaToEntity} from '../../../../shared/training_entity';

export class ModuleHandler {
    logger: LoggerInstance = getLogger('ModuleHandler', 'info');

    constructor(private moduleRepo: ModuleRepository,
                private trainingEntityHandler: TrainingEntityHandler) {
    }

    async createModule(createModuleData: CreateModuleEntityPayload): Promise<string> {
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = createModuleData.contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(createModuleData.contentQuestions);
        let contentQuestions: ContentQuestionEntity = {
            orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)),
            orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
            orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
        };
        return await this.moduleRepo.addModule(createModuleData, contentQuestions);
    }

    async saveModule(data: SaveModuleEntityPayload): Promise<void> {
        let {id, changes} = data;
        let module = await this.moduleRepo.loadModule(id);

        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = changes;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(changes);
        let updatedModule: ModuleEntity = applyDeltaDiff(module, <ModuleEntityDiffDelta>{
            ...changes,
            // replace placeholder ids with ones return by quill handler
            orderedContentIds: updateArrOpsValues(orderedContentIds, placeholderIdMap),
            orderedContentQuestionIds: updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap),
            orderedQuestionIds: updateArrOpsValues(orderedQuestionIds, placeholderIdMap),

        });
        await this.moduleRepo.saveModule(updatedModule);
    }

    async removeModule(module: ViewModuleTransferData): Promise<void> {
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
