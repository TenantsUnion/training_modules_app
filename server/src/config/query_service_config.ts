import {postgresDb} from './repository_config';
import {CourseViewQuery} from '../courses/view/course_view_query';

export const courseViewQuery = new CourseViewQuery(postgresDb);
