import axios from 'axios';
import {EnrollCourseRequestPayload, EnrollCourseResponse, UserCoursesListingPayload} from "@shared/user";

export const enrollUserInCourse = async (userCourse: EnrollCourseRequestPayload): Promise<EnrollCourseResponse> => {
    return (await axios.post(`user/course/enroll`, userCourse)).data;
};

export const loadUserCourses = async (userId: string): Promise<UserCoursesListingPayload> => {
    let result = await axios.get(`/user/${userId}/course/listings`);
    return result.data;
};