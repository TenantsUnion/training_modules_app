import axios from "axios";
import {ICourseInfo} from "courses";

class CreateCourseHttpService {

    createCourse(courseInfo: ICourseInfo): Promise<void> {
        return axios.post('courses/create', courseInfo)
            .then((value => {
            })).catch((response => {
                throw response.response.data;
            }))
    }
}
export const createCourseHttpService = new CreateCourseHttpService();
