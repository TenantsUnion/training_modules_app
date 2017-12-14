import axios from "axios";
import {AdminCourseDescription, CreateCourseEntityPayload} from 'courses';
import {userQueryService} from "../../account/user_query_service";

class UserCoursesService {

    async createCourse(createCourseData: CreateCourseEntityPayload): Promise<void> {
        // todo get command meta data
        try {
            await axios.post('courses/create', createCourseData);
        } catch (response) {
            throw response.response.data;
        }
    }

    getUserEnrolledCourses(): Promise<AdminCourseDescription[]> {
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

export const userCoursesHttpService = new UserCoursesService();
