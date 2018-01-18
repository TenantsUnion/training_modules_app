import axios from "axios";
import {AdminCourseDescription, CreateCourseEntityPayload} from '@shared/courses';

class UserCoursesService {

    async createCourse(createCourseData: CreateCourseEntityPayload): Promise<void> {
        await axios.post('courses/create', createCourseData);
    }

    async getUserEnrolledCourses(userId: string): Promise<AdminCourseDescription[]> {
        let response = await axios.get(`courses/user/enrolled/${userId}`);
        return response.data;
    }

    async getUserAdminCourses(userId: string): Promise<AdminCourseDescription[]> {
        let response = await axios.get(`courses/user/admin/${userId}`);
        return response.data;
    }
}

export const userCoursesHttpService = new UserCoursesService();
