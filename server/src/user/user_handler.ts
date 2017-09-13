import {
    CreateUserInfo, IUserRepository,
} from "./users_repository";
import {IUserInfo} from "../../../shared/user";

export interface AccountInfo {
    id: string;
}

export interface IUserHandler {
    createUser(createUserData: any): Promise<IUserInfo>;
    userCreatedCourse(userId:string, courseId: string): Promise<void>;
    loadUser(id: string): Promise<IUserInfo>;
}

export class UserHandler implements IUserHandler {
    constructor(private userRepository: IUserRepository) {
    }

    async createUser(createUserData: CreateUserInfo): Promise<IUserInfo> {
        return new Promise<IUserInfo>((resolve, reject) => {
            (async () => {
                try {
                    let accountInfo: AccountInfo = await this.userRepository.createUser(createUserData);
                    let userInfo: IUserInfo = await this.userRepository.loadUser(accountInfo.id);
                    resolve(userInfo);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async userCreatedCourse(createdByUsername:string, courseId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.userRepository.addToAdminOfCourseIds(createdByUsername, courseId);
                    resolve();
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async loadUser (id: string): Promise<IUserInfo> {
        return this.userRepository.loadUser(id);
    }
}

