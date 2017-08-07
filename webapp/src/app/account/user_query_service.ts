import {IUserInfo} from "user";

export class UserQueryService {
    currentUser: IUserInfo;

    setCurrentUser (userInfo: IUserInfo) {
        this.currentUser = userInfo;
    }

    getUserId (): string {
        return this.currentUser.id;
    }

    getUsername (): string {
        return this.currentUser.username;
    }

    resetCurrentUser (): void {
        this.currentUser = null;
    }

    isUserLoggedIn (): boolean {
        return !!this.currentUser;
    }

}

export const userQueryService = new UserQueryService();