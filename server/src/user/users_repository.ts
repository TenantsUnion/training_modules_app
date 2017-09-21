import {Datasource} from "../datasource";
import {IUserInfo} from "user";
import {AccountInfo} from "./user_handler";
import {AbstractRepository} from "../repository";
import {getLogger} from '../log';

export interface CreateUserInfo {
    id: string,
    username: string,
    firstName?: string,
    lastName?: string
}

export interface IUserRepository {
    createUser(createUserInfo: CreateUserInfo): Promise<AccountInfo>;

    getIdFromUsername(username: string): Promise<AccountInfo>;

    addToAdminOfCourseIds(userId: string, courseId: string): Promise<void>;

    loadUser(id: string): Promise<IUserInfo>;
}

export class UserRepository extends AbstractRepository implements IUserRepository {
    logger = getLogger('UserRepository', 'info');

    constructor(private datasource: Datasource) {
        super('user_id_seq', datasource);
    }

    async createUser(createUserInfo: CreateUserInfo): Promise<AccountInfo> {
        let {id, username, firstName, lastName} = createUserInfo;
        return new Promise<AccountInfo>((resolve, reject) => {
            (async () => {
                try {
                    await this.datasource.query({
                        text: `INSERT INTO tu.user (id, username, first_name, last_name) VALUES ($1, $2, $3, $4)`,
                        values: [id, username, firstName, lastName]
                    });
                    resolve({
                        id: id
                    });
                } catch (e) {
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async getIdFromUsername(username: string): Promise<AccountInfo> {
        return new Promise<AccountInfo>((resolve, reject) => {
            (async () => {
                try {
                    let result = await this.datasource.query({
                        text: `SELECT id FROM tu.user WHERE username = $1`,
                        values: [username]
                    });
                    resolve({
                        id: result[0].id
                    });
                } catch (e) {
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async loadUser(id: string): Promise<IUserInfo> {
        return new Promise<IUserInfo>((resolve, reject) => {
            (async () => {
                try {
                    let results = await this.datasource.query({
                            text: `SELECT * FROM tu.user u WHERE u.id = $1`,
                            values: [id]
                        }
                    );

                    let userRow = results[0];
                    resolve(userRow);
                } catch (e) {
                    this.logger.error("Database findAccountByUsername error");
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }


    addToAdminOfCourseIds(username: string, courseId: string): Promise<void> {
            return (async () => {
                    await this.datasource.query({
                        // language=PostgreSQL
                        text: `UPDATE tu.user SET admin_of_course_ids =
                            admin_of_course_ids || $1::BIGINT WHERE username = $2`,
                        values: [courseId, username]
                    });
            })().catch((e) => {
                this.logger.error('Failed to add admin of course ids for username: %s, course: %s',
                    username, courseId);
                this.logger.error('Error:\n');
                this.logger.error(e);
                throw e;
            });
    }

    async addContentId(userId: string, contentId: string): Promise<void> {
        return (async () => {
            await this.datasource.query({
                text: `UPDATE tu.user SET created_content_ids =
                            created_content_ids || $1 :: BIGINT WHERE id = $2`,
                values: [contentId, userId]
            });
        })().catch((e) => {
            this.logger.error('Failed to add content id for userId: %s, contentId: %s', userId, contentId);
            this.logger.error('Error:\n');
            this.logger.error(e);
            throw e;
        });
    }
}


