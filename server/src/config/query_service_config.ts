import {CourseViewQuery} from '../courses/view/course_views_query';
import {ModuleViewQuery} from '../courses/module/module_view_query';
import {SectionViewQuery} from '../courses/section/section_view_query';
import {postgresDb} from '../datasource';
import {AvailableSourcesViewQuery} from "../available_courses/available_sources_view_query";

export const courseViewQuery = new CourseViewQuery(postgresDb);
export const moduleViewQuery = new ModuleViewQuery(postgresDb);
export const sectionViewQuery = new SectionViewQuery(postgresDb);
export const availableCoursesViewQuery = new AvailableSourcesViewQuery(postgresDb);
