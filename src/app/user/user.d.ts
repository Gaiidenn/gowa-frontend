export interface User {
    Token: string;
    Username: string;
    Password: string;
    Email: string;
    Profile: UserProfile;
    Connected: boolean;
    Likes: Array<Like>;
    Meets: Array<Meet>;
    _id: string;
    _rev: string;
    _key: string;
}

export interface UserProfile {
    Age: number;
    Gender: string;
    Description: string;
}

export interface Meet {
    UserID: string;
    ChatID: string;
}

export interface Like {
    UserID: string;
    Positive: boolean;
}

export interface UserLogin {
    Token: string;
    Username: string;
    Password: string;
}

export interface Gender {
    key: string;
    value: string;
}