import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {ModuleRepository} from './module_repository';
import {QuillHandler} from '../../quill/quill_handler';
import {
    CreateModuleEntityPayload, ModuleEntity, ModuleEntityDiffDelta, SaveModuleEntityPayload,
    ViewModuleTransferData
} from '../../../../shared/modules';
import {applyDeltaDiff} from '../../../../shared/delta/apply_delta';
import {updateArrOpsValues} from '../../../../shared/delta/diff_key_array';

export class ModuleHandler {
    logger: LoggerInstance = getLogger('ModuleHandler', 'info');

    constructor(private moduleRepo: ModuleRepository,
                private quillHandler: QuillHandler) {
    }

    async createModule(createModuleData: CreateModuleEntityPayload): Promise<string> {
        let contentIds = await this.quillHandler.createTrainingEntityContent(createModuleData.orderedContentQuestions);
        let moduleId = await this.moduleRepo.addModule(createModuleData, contentIds);
        return moduleId;
    }

    async saveModule(data: SaveModuleEntityPayload): Promise<void> {
        let {id, changes, changes: {changeQuillContent, orderedContentIds}} = data;
        let quillIdMap = await this.quillHandler.handleQuillChanges(changeQuillContent);

        let module = await this.moduleRepo.loadModule(id);
        let updatedArr = updateArrOpsValues(orderedContentIds, quillIdMap);
        let updatedModule: ModuleEntity = applyDeltaDiff(module, <ModuleEntityDiffDelta>{
            ...changes,
            // replace placeholder ids with ones return by quill handler
            orderedContentIds: updatedArr
        });
        await this.moduleRepo.saveModule(updatedModule);
    }
    async removeModule(module: ViewModuleTransferData): Promise<void> {
        // let removeQuillContent = _.map(module.orderedContentIds, (quillId) => {
        //     return this.quillRepo.remove(quillId);
        // });
        //
        // await Promise.all(removeQuillContent);
        // await this.moduleRepo.remove(module.id);
    }
}
