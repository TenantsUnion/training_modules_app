import {
    accountRepository, contentRepository, coursesRepository, moduleRepository, quillRepository,
    userRepository
} from "./repository.config";
import {UserHandler} from "../user/user_handler";
import {AccountHandler} from "../account/account_handler";
import {CoursesHandler} from "../courses/courses_handler";
import {UserContentHandler} from "../content/user/user_content_handler";

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
export const coursesHandler = new CoursesHandler(coursesRepository, userHandler, moduleRepository);
export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);
