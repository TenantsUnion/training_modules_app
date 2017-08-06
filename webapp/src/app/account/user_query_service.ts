import {IUserInfo} from "user";

export class UserQueryService {
    currentUser: IUserInfo;

    setCurrentUser (userInfo: IUserInfo) {
        this.currentUser = userInfo;
    }

    getUserId (): string {
        return this.currentUser.id;
    }

    resetCurrentUser (): void {
        this.currentUser = null;
    }

}

export const userQueryService = new UserQueryService();