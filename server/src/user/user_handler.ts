import {
    CreateUserInfo, IUserRepository,
} from "./users_repository";
import {IUserInfo} from "../../../shared/user";

export interface AccountInfo {
    id: string;
}

export interface IUserHandler {
    createUser(createUserData: any): Promise<IUserInfo>;

    userCreatedCourse(userId: string, courseId: string): Promise<void>;

    loadUser(id: string): Promise<IUserInfo>;
}

export class UserHandler implements IUserHandler {
    constructor(private userRepository: IUserRepository) {
    }

    async createUser(createUserData: CreateUserInfo): Promise<IUserInfo> {
        try {
            let accountInfo: AccountInfo = await this.userRepository.createUser(createUserData);
            let userInfo: IUserInfo = await this.userRepository.loadUser(accountInfo.id);
            return userInfo;
        } catch (e) {
            console.log(e.stack);
            throw e;
        }
    }

    async userCreatedCourse(createdByUserId: string, courseId: string): Promise<void> {
        try {
            await this.userRepository.addToAdminOfCourseIds(createdByUserId, courseId);
        } catch (e) {
            console.log(e.stack);
            throw e;
        }
    }

    async loadUser(id: string): Promise<IUserInfo> {
        return this.userRepository.loadUser(id);
    }
}

