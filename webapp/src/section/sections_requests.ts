import {CreateSectionEntityPayload, CreateSectionResponse, ViewSectionData} from '@shared/sections';
import axios from "axios";

export const sectionHttpService = {
    saveSection: async () => {

    },
    createSection: async (createSectionData: CreateSectionEntityPayload): Promise<CreateSectionResponse> => {
        let {courseId, moduleId} = createSectionData;
        try {
            let response = await axios.post(`course/${courseId}/module/${moduleId}/section/create`,
                createSectionData);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    deleteSection: async () => {

    }
};