import axios from "axios";
import {CreateModuleEntityPayload, CreateModuleResponse} from '@shared/modules';

export const loadModule = async (courseId, moduleId) => {

};

export const saveModule = () => {

};

export const createModule = async (createModule: CreateModuleEntityPayload): Promise<CreateModuleResponse> => {
    let response = await axios.post(`course/${createModule.courseId}/module/create`, {
        payload: createModule
    });

    return response.data;
};

export const deleteModule = () => {

};
