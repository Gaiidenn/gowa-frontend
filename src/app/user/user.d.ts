export interface User {
    id: string;
    token: string;
    username: string;
    password: string;
    email: string;
    age: number;
    gender: string;
    description: string;
    connected: boolean;
}

export interface Meet {
    userID: string;
    chatID: string;
}

export interface Like {
    UserID: string;
    Positive: boolean;
}

export interface UserLogin {
    token: string;
    username: string;
    password: string;
}

export interface Gender {
    key: string;
    value: string;
}