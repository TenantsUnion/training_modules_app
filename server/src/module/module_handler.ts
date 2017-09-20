import {CreateModuleData, ModuleData} from 'modules';
import {ModuleRepository} from './module_repository';
import {moduleRepository} from '../config/repository.config';
import {SectionData} from '../../../shared/sections';

export class ModuleHandler {
    constructor(private moduleRepo: ModuleRepository){

    }

    async addModule(createModuleData: CreateModuleData): Promise<string> {
        return this.moduleRepo.addModule(createModuleData);
    }

    async saveModule(moduleData: ModuleData): Promise<void> {
        return this.moduleRepo.saveModule(moduleData)
    }

    async updateLastModified(moduleId: string): Promise<string> {
        return this.moduleRepo.updateLastModified(moduleId);
    }

    addSection(moduleId: string, sectionId: string) {
        return this.moduleRepo.addSection(moduleId, sectionId);
    }
}