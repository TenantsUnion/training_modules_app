import {Datasource, datasource} from "../datasource";
import {IUserInfo} from "../../../shared/user";
import {IUserId} from "./user_handler";

export interface ICreateUser {
    username: string,
    firstName?: string,
    lastName?: string
}

export interface IUserRepository {
    createUser(createUserInfo: ICreateUser): Promise<IUserId>;

    getIdFromUsername(username: string): Promise<IUserId>;

    findUserByUsername(username: string): Promise<IUserInfo>;
}

export class UserRepository implements IUserRepository {

    constructor(private datasource: Datasource) {
    }

    async createUser(createUserInfo: ICreateUser): Promise<IUserId> {
        let {username, firstName, lastName} = createUserInfo;
        return new Promise<IUserId>((resolve, reject) => {
            (async () => {
                try {
                    await this.datasource.query({
                        text: `INSERT INTO tu.user (username, first_name, last_name) VALUES ($1, $2, $3)`,
                        values: [username, firstName, lastName]
                    });
                    let result = await this.datasource.query({
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

    findUserByUsername(username: string): Promise<IUserInfo> {
        throw new Error("Method not implemented.");
    }
}


export const userRepository = new UserRepository(datasource);
