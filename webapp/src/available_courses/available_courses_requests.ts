import {CourseDescription} from "@shared/courses";
import axios from 'axios';
export const getAvailableCourses = async (): Promise<CourseDescription[]> => {
    let response = await axios.get('/available-courses/list');
    return response.data;
};