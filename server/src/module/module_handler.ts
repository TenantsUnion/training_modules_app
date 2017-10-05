import {CreateModuleData, SaveModuleData} from 'modules';
import {ModuleRepository} from './module_repository';
import {CreateModuleDataHeaderId} from './modules';

export class ModuleHandler {
    constructor(private moduleRepo: ModuleRepository){

    }

    async addModule(createModuleData: CreateModuleData, quillHeaderId: string): Promise<string> {
        return this.moduleRepo.addModule(createModuleData, quillHeaderId);
    }

    async saveModule(moduleData: SaveModuleData): Promise<void> {
        return this.moduleRepo.saveModule(moduleData)
    }

    async updateLastModified(moduleId: string): Promise<string> {
        return this.moduleRepo.updateLastModified(moduleId);
    }

    addSection(moduleId: string, sectionId: string) {
        return this.moduleRepo.addSection(moduleId, sectionId);
    }
}