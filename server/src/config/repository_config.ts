import {CourseRepository} from "@server/handlers/course/course_repository";
import {postgresDb} from "@server/datasource";
import {UserRepository} from "@server/handlers/user/users_repository";
import {AccountRepository} from "@server/handlers/account/account_repository";
import {QuillRepository} from "@server/handlers/training/quill/quill_repository";
import {ModuleRepository} from "@server/handlers/course/module/module_repository";
import {SectionRepository} from "@server/handlers/course/module/section/section_repository";
import {QuestionRepository} from "@server/handlers/training/question/question_repository";
import {QuestionOptionRepository} from "@server/handlers/training/question/question_option_repository";
import {CourseProgressRepository} from "@server/handlers/user_progress/course_progress_repository";
import {ModuleProgressRepository} from "@server/handlers/user_progress/module_progress_repository";
import {SectionProgressRepository} from "@server/handlers/user_progress/section_progress_repository";
import {QuestionSubmissionRepository} from "@server/handlers/training/question/question_submission_repository";

export const coursesRepository = new CourseRepository(postgresDb);
export const userRepository = new UserRepository(postgresDb);
export const accountRepository = new AccountRepository(postgresDb);
export const quillRepository = new QuillRepository(postgresDb);
export const moduleRepository = new ModuleRepository(postgresDb);
export const sectionRepository = new SectionRepository(postgresDb);
export const questionRepository = new QuestionRepository(postgresDb);
export const questionOptionRepository = new QuestionOptionRepository(postgresDb);
export const courseProgressRepository = new CourseProgressRepository(postgresDb);
export const moduleProgressRepository = new ModuleProgressRepository(postgresDb);
export const sectionProgressRepository = new SectionProgressRepository(postgresDb);
export const questionSubmissionRepository = new QuestionSubmissionRepository(postgresDb);
