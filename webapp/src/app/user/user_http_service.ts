import axios from 'axios';
import {EnrollCourseRequestPayload} from "@shared/user";
export const enrollUserInCourse = (userCourse: EnrollCourseRequestPayload) => {
    axios.post(`user/course/enroll`, userCourse);
};