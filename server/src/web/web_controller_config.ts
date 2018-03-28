import {AccountController} from "./account_web_controller";
import {accountHandler, coursesHandler, userHandler, userProgressHandler} from "../config/handler_config";
import {accountRequestValidator} from "../config/validator_config";
import {CourseCommandController} from "./courses_web_controller";
import {
    courseEnrolledSummaryViewQuery, courseEnrolledUserViewQuery,
    courseStructureViewQuery,
    courseViewQuery, moduleViewQuery, sectionViewQuery, userAdminCoursesViewQuery, userCoursesListingViewQuery,
    userProgressViewQuery
} from '@views/view_query_config';
import {UserProgressWebController} from "./user_progress_web_controller";
import {UserWebController} from "./user_web_controller";
import {ViewsRequestWebController} from "./views_request_controller";

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CourseCommandController(
    coursesHandler, courseViewQuery, moduleViewQuery, sectionViewQuery,
    courseStructureViewQuery, userAdminCoursesViewQuery
);
export const userProgressWebController = new UserProgressWebController(
    userProgressHandler, userProgressViewQuery, userCoursesListingViewQuery
);
export const userWebController = new UserWebController(userCoursesListingViewQuery);
export const viewsRequestWebController = new ViewsRequestWebController(
    courseStructureViewQuery, courseViewQuery, moduleViewQuery, sectionViewQuery, userCoursesListingViewQuery,
    userProgressViewQuery, courseEnrolledSummaryViewQuery, courseEnrolledUserViewQuery
);

// todo add error handlers to express

