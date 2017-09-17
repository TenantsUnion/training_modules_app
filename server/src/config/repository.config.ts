import {Datasource} from "../datasource";
import {CoursesRepository} from "../courses/courses_repository";
import {UserRepository} from "../user/users_repository";
import {AccountRepository} from "../account/account_repository";
import {ContentRepository} from "../content/content_repository";
import {QuillRepository} from "../quill/quill_repository";
import {ModuleRepository} from "../module/module_repository";

const config = require('config');
const {Pool} = require('pg');

const pool = new Pool({
    user: config.get("database.db_user"),
    password: config.get("database.db_password"),
    host: config.get("database.db_host"),
    port: config.get("database.db_port"),
    database: config.get("database.db")
});

pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client: ', err);
});

export const datasource = new Datasource(pool);
export const coursesRepository = new CoursesRepository(datasource);
export const userRepository = new UserRepository(datasource);
export const accountRepository = new AccountRepository(datasource);
export const contentRepository = new ContentRepository(datasource);
export const quillRepository = new QuillRepository(datasource);
export const moduleRepository = new ModuleRepository(datasource);

process.on('exit', function () {
    (async () => {
        console.log('Closing database pool...');
        await pool.end();
        console.log('Database pool closed');
    })();
    console.log('Ending database process exit handler');
});
