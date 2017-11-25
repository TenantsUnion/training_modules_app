import {
    accountRepository, contentRepository, coursesRepository, moduleRepository, postgresDb, quillRepository,
    sectionRepository,
    userRepository
} from "./repository_config";
import {UserHandler} from "../user/user_handler";
import {AccountHandler} from "../account/account_handler";
import {CoursesHandler} from "../courses/courses_handler";
import {UserContentHandler} from "../content/user/user_content_handler";
import {SectionHandler} from '../section/section_handler';
import {CoursesViewHandler} from '../courses/courses_view_handler';

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
const sectionHandler = new SectionHandler(sectionRepository, quillRepository);
export const coursesHandler =
    new CoursesHandler(coursesRepository, quillRepository, userHandler, moduleRepository, sectionHandler);
export const coursesViewHandler = new CoursesViewHandler(coursesRepository);
export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);

