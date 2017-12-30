import {Datasource} from "../datasource";
import {CoursesRepository} from "../courses/courses_repository";
import {UserRepository} from "../user/users_repository";
import {AccountRepository} from "../account/account_repository";
import {ContentRepository} from "../content/content_repository";
import {QuillRepository} from "../quill/quill_repository";
import {ModuleRepository} from "../courses/module/module_repository";
import {SectionRepository} from '../courses/section/section_repository';

import {Pool} from 'pg';
import {DatabaseConfig} from './normalize_config';
import {QuestionRepository} from '../question/question_repository';
import {QuestionOptionRepository} from '../question/question_option_repository';

const pool = new Pool(DatabaseConfig);

pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client: ', err);
});

export const postgresDb = new Datasource(pool);
export const coursesRepository = new CoursesRepository(postgresDb);
export const userRepository = new UserRepository(postgresDb);
export const accountRepository = new AccountRepository(postgresDb);
export const contentRepository = new ContentRepository(postgresDb);
export const quillRepository = new QuillRepository(postgresDb);
export const moduleRepository = new ModuleRepository(postgresDb);
export const sectionRepository = new SectionRepository(postgresDb);
export const questionRepository = new QuestionRepository(postgresDb);
export const questionOptionRepository = new QuestionOptionRepository(postgresDb);

process.on('exit', function () {
    (async () => {
        console.log('Closing database pool...');
        await pool.end();
        console.log('Database pool closed');
    })();
    console.log('Ending database process exit handler');
});
