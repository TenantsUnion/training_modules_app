import {CourseViewQuery} from '@course/view/course_views_query';
import {ModuleViewQuery} from '@module/module_view_query';
import {SectionViewQuery} from '@section/admin/section_view_query';
import {postgresDb} from '../datasource';
import {AvailableSourcesViewQuery} from "../available_courses/available_sources_view_query";
import {UserProgressViewQuery} from "../user_progress/user_progress_view_query";
import {UserCoursesListingViewQuery} from "../user/user_courses_listing_view_query";

export const courseViewQuery = new CourseViewQuery(postgresDb);
export const moduleViewQuery = new ModuleViewQuery(postgresDb);
export const sectionViewQuery = new SectionViewQuery(postgresDb);
export const availableCoursesViewQuery = new AvailableSourcesViewQuery(postgresDb);
export const userProgressViewQuery = new UserProgressViewQuery(postgresDb);
export const userCoursesListingViewQuery = new UserCoursesListingViewQuery(postgresDb);
