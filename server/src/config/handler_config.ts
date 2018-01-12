import {
    accountRepository, contentRepository, coursesRepository, moduleRepository, questionOptionRepository,
    questionRepository,
    quillRepository,
    sectionRepository,
    userRepository
} from "./repository_config";
import {UserHandler} from "../user/user_handler";
import {AccountHandler} from "../account/account_handler";
import {CoursesHandler} from "../courses/courses_handler";
import {UserContentHandler} from "../content/user/user_content_handler";
import {SectionHandler} from '../courses/section/section_handler';
import {CoursesViewHandler} from '../courses/courses_view_handler';
import {QuillHandler} from '../training_entity/quill/quill_handler';
import {ModuleHandler} from '../courses/module/module_handler';
import {QuestionHandler} from '../training_entity/question/question_handler';
import {courseViewQuery} from './query_service_config';
import {TrainingEntityHandler} from '../training_entity/training_entity_handler';

export const quillHandler = new QuillHandler(quillRepository);
export const questionHandler = new QuestionHandler(questionRepository, questionOptionRepository);
export const trainingEntityHandler = new TrainingEntityHandler(quillHandler, questionHandler);

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
const sectionHandler = new SectionHandler(sectionRepository, trainingEntityHandler);
const moduleHandler = new ModuleHandler(moduleRepository, trainingEntityHandler);
export const coursesHandler = new CoursesHandler(coursesRepository, quillHandler, trainingEntityHandler, userHandler,
        sectionHandler, moduleHandler);
export const coursesViewHandler = new CoursesViewHandler(courseViewQuery);
export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);

