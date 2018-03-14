import axios from 'axios';
import {EnrollCourseRequestPayload, EnrollCourseResponse, UserCoursesListingPayload} from "@shared/user";

export const userHttpService = {
    async enrollUserInCourse (payload: EnrollCourseRequestPayload): Promise<EnrollCourseResponse> {
        return (await axios.post(`user/${payload.userId}/course/${payload.userId}/enroll`, payload)).data;
    },

    async loadUserCourses (userId: string): Promise<UserCoursesListingPayload> {
        let result = await axios.get(`/user/${userId}/course/listings`);
        return result.data;
    }
};