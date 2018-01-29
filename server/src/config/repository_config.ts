import {Datasource} from "../datasource";
import {CoursesRepository} from "../courses/courses_repository";
import {UserRepository} from "../user/users_repository";
import {AccountRepository} from "../account/account_repository";
import {ContentRepository} from "../content/content_repository";
import {QuillRepository} from "../training_entity/quill/quill_repository";
import {ModuleRepository} from "../courses/module/module_repository";
import {SectionRepository} from '../courses/section/section_repository';

import {Pool} from 'pg';
import {DatabaseConfig} from './normalize_config';
import {QuestionRepository} from '../training_entity/question/question_repository';
import {QuestionOptionRepository} from '../training_entity/question/question_option_repository';
import {getLogger} from "../log";

const pool = new Pool(DatabaseConfig);

let logger = getLogger('PgPool', 'info');

pool.on('error', (err, client) => {
    logger.log('error', `Unexpected error on idle client: ${err}\n${err.stack}`);
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

// keep track of whether exit handler has been added so multiple exit handlers are not leaked
// if this module keeps being imported as part of different child processes (i.e. mocha watch)
if (!(<any>global).addedCloseDbHandler) {
    logger.info('Adding process exit close database handler');
    process.on('exit', async function () {
        logger.log('info', 'Closing database pool...');
        await pool.end();
        logger.log('info', 'Database pool closed');
        logger.log('info', 'Ending database process exit handler');
    });

    (<any>global).addedCloseDbHandler = true;
}
