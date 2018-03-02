import axios from 'axios';
import {UserCoursesListingPayload} from "@shared/user";

export const loadUserCourses = async (userId: string): Promise<UserCoursesListingPayload> => {
    let result = await axios.get(`/user/${userId}/course/listings`);
    return result.data;
};