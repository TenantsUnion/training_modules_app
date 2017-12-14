import {CoursesQueryService} from '../courses/courses_query_service';
import {postgresDb} from './repository_config';

export const courseQueryService = new CoursesQueryService(postgresDb);