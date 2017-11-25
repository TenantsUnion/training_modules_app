import {AccountController} from "../account/account_web_controller";
import {accountHandler, coursesHandler, coursesViewHandler, userContentHandler, userHandler} from "./handler_config";
import {accountRequestValidator} from "./validator_config";
import {CourseCommandController} from "../courses/courses_web_controller";
import {UserContentController} from "../content/user/user_content_routes_controller";
import {userContentValidator} from "../content/user/user_content_validator";
import {contentRepository, coursesRepository} from "./repository_config";

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CourseCommandController(coursesHandler, coursesRepository, coursesViewHandler);
export const userContentController = new UserContentController(userContentHandler, userContentValidator, contentRepository);

