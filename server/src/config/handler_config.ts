import {AdminCourseHandler} from "@h-course/course_handler";
import {AdminModuleHandler} from "@h-module/module_handler";
import {AdminSectionHandler} from "@h-section/section_handler";
import {QuestionHandler} from "@h-training/question/question_handler";
import {QuillHandler} from "@h-training/quill/quill_handler";
import {TrainingEntityHandler} from "@h-training/training_entity_handler";
import {AccountHandler} from "@handlers/account/account_handler";
import {UserHandler} from "@handlers/user/user_handler";
import {UserProgressHandler} from "@handlers/user_progress/user_progress_handler";
import {
    accountRepository, courseProgressRepository, coursesRepository, moduleProgressRepository, moduleRepository,
    questionOptionRepository,
    questionRepository, questionSubmissionRepository, quillRepository, sectionProgressRepository, sectionRepository,
    userRepository
} from "./repository_config";

export const quillHandler = new QuillHandler(quillRepository);
export const questionHandler = new QuestionHandler(questionRepository, questionOptionRepository);
export const trainingEntityHandler = new TrainingEntityHandler(quillHandler, questionHandler);

export const userHandler = new UserHandler(userRepository);
export const accountHandler = new AccountHandler(accountRepository, userHandler);
const sectionHandler = new AdminSectionHandler(sectionRepository, trainingEntityHandler);
const moduleHandler = new AdminModuleHandler(moduleRepository, trainingEntityHandler);
export const coursesHandler = new AdminCourseHandler(coursesRepository, quillHandler, trainingEntityHandler, userHandler,
    sectionHandler, moduleHandler);
export const userProgressHandler = new UserProgressHandler(userRepository, questionSubmissionRepository,
    courseProgressRepository, moduleProgressRepository,
    sectionProgressRepository);
