import {AccountController} from "./account_web_controller";
import {accountHandler, coursesHandler, userHandler} from "../config/handler_config";
import {accountRequestValidator} from "../config/validator_config";
import {CourseCommandController} from "./courses_web_controller";
import {courseViewQuery, moduleViewQuery, sectionViewQuery} from '../config/query_service_config';

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CourseCommandController(coursesHandler, courseViewQuery, moduleViewQuery, sectionViewQuery);

