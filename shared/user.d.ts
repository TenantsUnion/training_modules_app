declare namespace  user {
    interface IUserInfo {
        username: string,
        role: USER_ROLE
    }

    const enum USER_ROLE {
        admin,
        trainee
    }
}

export = user;