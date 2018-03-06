import axios from 'axios';
import {EnrollCourseRequestPayload, EnrollCourseResponse, UserCoursesListingPayload} from "@shared/user";

export class UserHttpService {
    async enrollUserInCourse (userCourse: EnrollCourseRequestPayload): Promise<EnrollCourseResponse> {
        return (await axios.post(`user/course/enroll`, userCourse)).data;
    };

    async loadUserCourses (userId: string): Promise<UserCoursesListingPayload> {
        let result = await axios.get(`/user/${userId}/course/listings`);
        return result.data;
    };
}

export const userHttpService = new UserHttpService();