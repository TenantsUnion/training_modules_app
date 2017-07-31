declare namespace account {
    interface SignupData {
        username: string;
        password?: string;
        firstName?: string;
        lastName?: string;
    }
}

export = account;
