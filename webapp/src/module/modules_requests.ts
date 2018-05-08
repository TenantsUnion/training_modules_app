import axios from "axios";
import {
    CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload
} from '@shared/modules';
import {SaveTrainingResponse} from '@shared/training';

export const moduleHttpService = {
    loadModule: async (moduleId) => {
        let response = await axios.get(`view/module/admin/${moduleId}`);
        return response.data;
    },
    saveModule: async (module: SaveModuleEntityPayload): Promise<SaveTrainingResponse> => {
        let response = await axios.post(`course/${module.courseId}/module/${module.id}/save`, {
            payload: module
        });
        return response.data;

    },
    createModule: async (createModule: CreateModuleEntityPayload): Promise<CreateModuleResponse> => {
        let response = await axios.post(`course/${createModule.courseId}/module/create`, {
            payload: createModule
        });

        return response.data;
    },
    deleteModule: () => {

    }
};
