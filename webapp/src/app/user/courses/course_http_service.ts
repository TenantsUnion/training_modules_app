import axios from "axios";
import {
    AdminCourseDescription, CourseData, CreateCourseData
} from "courses";
import {userQueryService} from "../../account/user_query_service";

class UserCoursesHttpService {

    createCourse (createCourseData: CreateCourseData): Promise<void> {
        return axios.post('courses/create', createCourseData)
            .then((value) => {

            })
            .catch((response) => {
                throw response.response.data;
            });
    }

    getUserEnrolledCourses (): Promise<AdminCourseDescription[]> {
        let username = userQueryService.getUsername();
        return axios.get(`courses/user/enrolled/${username}`)
            .then((value) => {
                return value.data;
            });
    }

    getUserAdminCourses(): Promise<AdminCourseDescription[]> {
        let username = userQueryService.getUsername();
        return axios.get(`courses/user/admin/${username}`)
            .then((value) => {
                return value.data;
            })
    }
}

export const userCoursesHttpService = new UserCoursesHttpService();
