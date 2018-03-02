import {postgresDb} from "../datasource";
import {UserRepository} from "../user/users_repository";
import {AccountRepository} from "../account/account_repository";
import {QuillRepository} from "../training_entity/quill/quill_repository";
import {ModuleRepository} from "@module/admin/module_repository";
import {SectionRepository} from '@section/admin/section_repository';

import {QuestionRepository} from '../training_entity/question/question_repository';
import {QuestionOptionRepository} from '../training_entity/question/question_option_repository';
import {CourseRepository} from "@course/admin/course_repository";
import {CourseProgressRepository} from "@course/../user_progress/course_progress_repository";
import {ModuleProgressRepository} from "@module/../user_progress/module_progress_repository";
import {SectionProgressRepository} from "@section/../user_progress/section_progress_repository";
import {QuestionSubmissionRepository} from "../training_entity/question/question_submission_repository";

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
