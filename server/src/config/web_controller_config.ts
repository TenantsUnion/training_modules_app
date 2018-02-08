import {AccountController} from "../account/account_web_controller";
import {accountHandler, coursesHandler, userContentHandler, userHandler} from "./handler_config";
import {accountRequestValidator} from "./validator_config";
import {CourseCommandController} from "../course/courses_web_controller";
import {UserContentController} from "../content/user/user_content_routes_controller";
import {userContentValidator} from "../content/user/user_content_validator";
import {contentRepository} from "./repository_config";
import {courseViewQuery, moduleViewQuery, sectionViewQuery} from './query_service_config';

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CourseCommandController(coursesHandler, courseViewQuery, moduleViewQuery, sectionViewQuery);
export const userContentController = new UserContentController(userContentHandler, userContentValidator, contentRepository);

