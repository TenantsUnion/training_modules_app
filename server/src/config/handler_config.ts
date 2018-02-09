import {
    accountRepository, contentRepository, coursesRepository, moduleRepository, questionOptionRepository,
    questionRepository,
    quillRepository,
    sectionRepository,
    userRepository
} from "./repository_config";
import {UserHandler} from "../user/user_handler";
import {AccountHandler} from "../account/account_handler";
import {UserContentHandler} from "../content/user/user_content_handler";
import {QuillHandler} from '../training_entity/admin/quill/quill_handler';
import {QuestionHandler} from '../training_entity/admin/question/question_handler';
import {TrainingEntityHandler} from '../training_entity/admin/training_entity_handler';
import {AdminModuleHandler} from "@module/admin/admin_module_handler";
import {AdminCourseHandler} from "@course/admin/course_admin_handler";
import {AdminSectionHandler} from "@section/admin/admin_section_handler";

export const quillHandler = new QuillHandler(quillRepository);
export const questionHandler = new QuestionHandler(questionRepository, questionOptionRepository);
export const trainingEntityHandler = new TrainingEntityHandler(quillHandler, questionHandler);

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
const sectionHandler = new AdminSectionHandler(sectionRepository, trainingEntityHandler);
const moduleHandler = new AdminModuleHandler(moduleRepository, trainingEntityHandler);
export const coursesHandler = new AdminCourseHandler(coursesRepository, quillHandler, trainingEntityHandler, userHandler,
        sectionHandler, moduleHandler);
export const userContentHandler = new UserContentHandler(contentRepository, quillRepository, userRepository);

