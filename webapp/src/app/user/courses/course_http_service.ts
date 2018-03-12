import axios from "axios";
import {CourseDescription, CreateCourseEntityPayload} from '@shared/courses';

class UserCoursesService {

    async createCourse(createCourseData: CreateCourseEntityPayload): Promise<void> {
        await axios.post('courses/create', createCourseData);
    }

    async getUserEnrolledCourses(userId: string): Promise<CourseDescription[]> {
        let response = await axios.get(`courses/user/enrolled/${userId}`);
        return response.data;
    }

    async getUserAdminCourses(userId: string): Promise<CourseDescription[]> {
        let response = await axios.get(`courses/user/admin/${userId}`);
        return response.data;
    }
}

export const userCoursesHttpService = new UserCoursesService();
