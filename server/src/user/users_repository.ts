import {Datasource, datasource} from "../datasource";
import {IUserInfo} from "user";
import {AccountInfo} from "./user_handler";
import {AbstractRepository} from "../repository";

export interface CreateUserInfo {
    id: string,
    username: string,
    firstName?: string,
    lastName?: string
}

export interface IUserRepository {
    createUser(createUserInfo: CreateUserInfo): Promise<AccountInfo>;

    getIdFromUsername(username: string): Promise<AccountInfo>;

    findUserByUsername(username: string): Promise<IUserInfo>;

    addToAdminOfCourseIds(userId: string, courseId: string): Promise<void>;

    loadUser(id: string): Promise<IUserInfo>;
}

export class UserRepository extends AbstractRepository implements IUserRepository {
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
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async getIdFromUsername(username: string): Promise<AccountInfo> {
        return new Promise<AccountInfo>((resolve, reject) => {
            (async () => {
                try {
                    let result = await datasource.query({
                        text: `SELECT id FROM tu.user WHERE username = $1`,
                        values: [username]
                    });
                    resolve({
                        id: result.rows[0].id
                    });
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async loadUser (id: string): Promise<IUserInfo> {
            return new Promise<IUserInfo>((resolve, reject) => {
                (async () => {
                    try {
                        let results = await datasource.query({
                                text: `SELECT * FROM tu.user u WHERE u.id = $1`,
                                values: [id]
                            }
                        );

                        let userRow = results.rows[0];
                        resolve({
                            id: userRow.id,
                            username: userRow.username,
                            firstName: userRow.first_name,
                            lastName: userRow.last_name,
                            adminOfCourseIds: userRow.admin_of_course_ids,
                            enrolledInCourseIds: userRow.enrolled_in_course_ids,
                            completedCourseIds: userRow.completed_course_ids
                        });
                    } catch (e) {
                        console.log("Database findAccountByUsername error");
                        console.log(e);
                        console.log(e.stack);
                        reject(e);
                    }
                })();
            });
    }
    
    
    addToAdminOfCourseIds(userId: string, courseId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.datasource.query({
                        text: `UPDATE tu.user SET admin_of_course_ids =
                            admin_of_course_ids || $1::BIGINT WHERE id = $2`,
                        values: [courseId, userId]
                    });
                    resolve();
                } catch (e) {
                    console.log(e);
                    reject(e);
                }
            })();
        });
    }

    findUserByUsername(username: string): Promise<IUserInfo> {
        throw new Error("Method not implemented.");
    }
}


export const userRepository = new UserRepository(datasource);
