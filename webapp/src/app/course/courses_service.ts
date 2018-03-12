import axios, {AxiosResponse} from "axios";
import {CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload, SaveModuleResponse} from "@shared/modules";
import {
    CreateCourseEntityCommand, SaveCourseEntityPayload, SaveCourseResponse, CreateCourseResponse, ViewCourseData
} from '@shared/courses';
import {
    CreateSectionEntityPayload, CreateSectionResponse,
    SaveSectionEntityPayload, SaveSectionResponse
} from '@shared/sections';

export const isAxiosResponse = (obj: any): obj is AxiosResponse => {
    let {data, status, statusText, headers, config} = <AxiosResponse> obj;
    return !!(data && status && statusText && headers && config);
};
export class CoursesService {
    async loadCourseTraining(courseId: string): Promise<ViewCourseData> {
        try {
            let response = await axios.get(`view/course/admin/${courseId}`);
            let course:ViewCourseData = response.data;
            return course;
        } catch (e) {
            console.error(`Error loading course data for course: ${courseId}${e}`);
            throw e.data;
        }
    }

    loadEnrolledCourse(courseInfo: {userId: string, courseId: string}): Promise<ViewCourseData> {
        return null;
    }

    async getAdminCourseFromSlug(slug: string, userId: string): Promise<ViewCourseData> {
        try {
            let response = await axios.get(`user/${userId}/admin/course/${slug}`);
            return response.data;
        } catch (e) {
            console.error(`Error loading course data. userId: ${userId}, slug: ${slug},\nError: ${e}`);
            throw e.data;
        }
    }

    async createModule(createModule: CreateModuleEntityPayload): Promise<CreateModuleResponse> {
        let response = await axios.post(`course/${createModule.courseId}/module/create`, {
            payload: createModule
        });

        return response.data;
    }

    /**
     * Returns promise that resolves to the just created section id
     * @param {CreateSectionEntityPayload} createSectionData
     * @returns {Promise<string>}
     */
    async createSection(createSectionData: CreateSectionEntityPayload): Promise<CreateSectionResponse> {
        let {courseId, moduleId} = createSectionData;
        try {
            let response = await axios.post(`course/${courseId}/module/${moduleId}/section/create`,
                createSectionData);
            return response.data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async saveCourse(course: SaveCourseEntityPayload): Promise<SaveCourseResponse> {
        let response = await axios.post(`course/save/${course.id}`, {
            payload: course
        });
        return response.data;
    }

    async saveModule(module: SaveModuleEntityPayload): Promise<SaveModuleResponse> {
        let response = await axios.post(`course/${module.courseId}/module/${module.id}/save`, {
            payload: module
        });
        return response.data;
    }

    async saveSection(section: SaveSectionEntityPayload): Promise<SaveSectionResponse> {
        let response = await axios.post(`course/${section.courseId}/module/${section.moduleId}/section/${section.id}/save`, {
            payload: section
        });
        return response.data;
    }

    /**
     *
     * @param {CreateCourseEntityCommand} createCourseCommand
     * @returns {Promise<string>}
     */
    async createCourse(createCourseCommand: CreateCourseEntityCommand): Promise<ViewCourseData> {
        let createdCourse: CreateCourseResponse = (await axios.post('courses/create', createCourseCommand)).data;
        return <ViewCourseData> createdCourse;
    }
}


export const coursesService = new CoursesService();