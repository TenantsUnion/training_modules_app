import {Datasource, datasource} from "../datasource";
import {IUserInfo} from "user";
import {IUserId} from "./user_handler";
import {AbstractRepository} from "../repository";

export interface ICreateUser {
    username: string,
    firstName?: string,
    lastName?: string
}

export interface IUserRepository {
    createUser(createUserInfo: ICreateUser): Promise<IUserId>;

    getIdFromUsername(username: string): Promise<IUserId>;

    findUserByUsername(username: string): Promise<IUserInfo>;

    addToAdminOfCourseIds(userId: string, courseId: string): Promise<void>;
}

export class UserRepository extends AbstractRepository implements IUserRepository {
    constructor(private datasource: Datasource) {
        super('user_id_seq', datasource);
    }

    async createUser(createUserInfo: ICreateUser): Promise<IUserId> {
        let {username, firstName, lastName} = createUserInfo;
        return new Promise<IUserId>((resolve, reject) => {
            (async () => {
                try {
                    let userId = await this.getNextId();
                    await this.datasource.query({
                        text: `INSERT INTO tu.user (id, username, first_name, last_name) VALUES ($1, $2, $3, $4)`,
                        values: [userId, username, firstName, lastName]
                    });
                    resolve({
                        id: userId
                    });
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async getIdFromUsername(username: string): Promise<IUserId> {
        return new Promise<IUserId>((resolve, reject) => {
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
