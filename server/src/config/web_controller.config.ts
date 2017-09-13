import {AccountController} from "../account/account_web_controller";
import {accountHandler, coursesHandler, userContentHandler, userHandler} from "./handler.config";
import {accountRequestValidator} from "./validator.config";
import {CoursesController} from "../courses/courses_web_controller";
import {UserContentController} from "../content/user/user_content_routes_controller";
import {userContentValidator} from "../content/user/user_content_validator";

export const accountController = new AccountController(accountHandler, userHandler, accountRequestValidator);
export const coursesController = new CoursesController(coursesHandler);
export const userContentController = new UserContentController(userContentHandler, userContentValidator);

