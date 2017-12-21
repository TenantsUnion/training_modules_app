import axios from "axios";
import {AdminCourseDescription, CreateCourseEntityPayload} from 'courses';

class UserCoursesService {

    async createCourse(createCourseData: CreateCourseEntityPayload): Promise<void> {
        await axios.post('courses/create', createCourseData);
    }

    async getUserEnrolledCourses(username: string): Promise<AdminCourseDescription[]> {
        let response = await axios.get(`courses/user/enrolled/${username}`);
        return response.data;
    }

    async getUserAdminCourses(username: string): Promise<AdminCourseDescription[]> {
        let response = await axios.get(`courses/user/admin/${username}`);
        return response.data;
    }
}

export const userCoursesHttpService = new UserCoursesService();
