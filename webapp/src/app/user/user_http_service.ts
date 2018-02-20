import axios from 'axios';
import {EnrollCourseRequestPayload, UserCoursesListingPayload} from "@shared/user";

export const enrollUserInCourse = async (userCourse: EnrollCourseRequestPayload) => {
    return axios.post(`user/course/enroll`, userCourse);
};

export const loadUserCourses = async (userId: string): Promise<UserCoursesListingPayload> => {
    let result = await axios.get(`/user/${userId}/course/listings`);
    return result.data;
};