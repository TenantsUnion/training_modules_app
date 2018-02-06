import axios from 'axios';
import {CourseDescription} from "../../../../shared/courses";
export const getAvailableCourses = async (): Promise<CourseDescription[]> => {
    let response = await axios.get('/available-courses/list');
    return response.data;
};