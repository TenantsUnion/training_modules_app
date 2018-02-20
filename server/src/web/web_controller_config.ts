import {AccountController} from "./account_web_controller";
import {accountHandler, coursesHandler, userHandler, userProgressHandler} from "../config/handler_config";
import {accountRequestValidator} from "../config/validator_config";
import {CourseCommandController} from "./courses_web_controller";
import {
    courseViewQuery, moduleViewQuery, sectionViewQuery,
    userProgressViewQuery
} from '../config/query_service_config';
import {UserProgressWebController} from "./user_progress_web_controller";

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CourseCommandController(coursesHandler, courseViewQuery, moduleViewQuery, sectionViewQuery);
export const userProgressWebController = new UserProgressWebController(userProgressHandler, userProgressViewQuery);

// todo add error handlers to express

