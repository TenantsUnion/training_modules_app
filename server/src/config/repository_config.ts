import {postgresDb} from "../datasource";
import {UserRepository} from "../user/users_repository";
import {AccountRepository} from "../account/account_repository";
import {ContentRepository} from "../content/content_repository";
import {QuillRepository} from "../training_entity/admin/quill/quill_repository";
import {ModuleRepository} from "../module/admin/module_repository";
import {SectionRepository} from '../section/admin/section_repository';

import {QuestionRepository} from '../training_entity/admin/question/question_repository';
import {QuestionOptionRepository} from '../training_entity/admin/question/question_option_repository';
import {CourseRepository} from "../course/admin/course_repository";

export const coursesRepository = new CourseRepository(postgresDb);
export const userRepository = new UserRepository(postgresDb);
export const accountRepository = new AccountRepository(postgresDb);
export const contentRepository = new ContentRepository(postgresDb);
export const quillRepository = new QuillRepository(postgresDb);
export const moduleRepository = new ModuleRepository(postgresDb);
export const sectionRepository = new SectionRepository(postgresDb);
export const questionRepository = new QuestionRepository(postgresDb);
export const questionOptionRepository = new QuestionOptionRepository(postgresDb);

