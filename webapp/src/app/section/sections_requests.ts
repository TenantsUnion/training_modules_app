import {CreateSectionEntityPayload, ViewSectionData} from '../../../../shared/sections';
import axios from "axios";

export const loadSection = async (sectionId: string): Promise<ViewSectionData> => {
    return (await axios.get(`/view/section/admin/${sectionId}`)).data;
};

export const saveSection = async () => {

};

export const createSection = async (createSectionData: CreateSectionEntityPayload) => {
    let {courseId, moduleId} = createSectionData;
    try {
        let response = await axios.post(`course/${courseId}/module/${moduleId}/section/create`,
            createSectionData);
        return response.data;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const deleteSection = async () => {

};