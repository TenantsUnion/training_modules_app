import {
    accountRepository, contentRepository, coursesRepository, moduleRepository, postgresDb, quillRepository,
    sectionRepository,
    userRepository
} from "./repository_config";
import {UserHandler} from "../user/user_handler";
import {AccountHandler} from "../account/account_handler";
import {CoursesHandler} from "../courses/courses_handler";
import {UserContentHandler} from "../content/user/user_content_handler";
import {SectionHandler} from '../courses/section/section_handler';
import {CoursesViewHandler} from '../courses/courses_view_handler';
import {courseQueryService} from './query_service_config';
import {quillHandler} from '../quill/quill_handler';
import {ModuleHandler} from '../courses/module/module_handler';

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
const sectionHandler = new SectionHandler(sectionRepository, quillHandler);
const moduleHandler = new ModuleHandler(moduleRepository, quillHandler);
export const coursesHandler = new CoursesHandler(coursesRepository, quillHandler, quillRepository, userHandler,
        moduleRepository, sectionHandler, moduleHandler);
export const coursesViewHandler = new CoursesViewHandler(coursesRepository, courseQueryService);
export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);

