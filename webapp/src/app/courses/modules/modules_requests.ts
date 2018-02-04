import axios from "axios";
import {
    CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload,
    SaveModuleResponse
} from '@shared/modules';

export const loadModule = async (moduleId) => {
    let response = await axios.get(`view/module/admin/${moduleId}`);
    return response.data;
};

export const saveModule = async (module: SaveModuleEntityPayload): Promise<SaveModuleResponse> => {
    let response = await axios.post(`course/${module.courseId}/module/${module.id}/save`, {
        payload: module
    });
    return response.data;

};

export const createModule = async (createModule: CreateModuleEntityPayload): Promise<CreateModuleResponse> => {
    let response = await axios.post(`course/${createModule.courseId}/module/create`, {
        payload: createModule
    });

    return response.data;
};

export const deleteModule = () => {

};
