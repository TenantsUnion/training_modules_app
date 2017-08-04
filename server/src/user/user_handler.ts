import {IUserRepository, userRepository} from "./users_repository";
import {IUserInfo} from "user";
import {CourseEntity} from "../courses/courses";

export interface ICreateUserData {
    username: string;
}

export interface IUserId {
    id: string;
}

export interface IUserHandler {
    createUser(createUserData: any): Promise<IUserId>;

    getIdFromUsername(username: string): Promise<IUserId>

    userCreatedCourse(userId:string, courseEntity: CourseEntity): Promise<void>;
}

export class UserHandler implements IUserHandler {
    constructor(private userRepository: IUserRepository) {
    }

    async createUser(createUserData: ICreateUserData): Promise<IUserId> {
        return new Promise<IUserId>((resolve, reject) => {
            (async () => {
                try {
                    let userId: IUserId = await this.userRepository.createUser(createUserData);
                    resolve(userId);
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
                    let userId: IUserId = await this.userRepository.getIdFromUsername(username);
                    resolve(userId);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async userCreatedCourse(createByUserId:string, courseEntity: CourseEntity): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                try {
                    await this.userRepository.addToAdminOfCourseIds(createByUserId, courseEntity.id);
                    resolve();
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

export const userHandler = new UserHandler(userRepository);