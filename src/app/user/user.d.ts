export interface User {
    Token: string;
    Username: string;
    Password: string;
    Email: string;
    Profile: UserProfile;
    Connected: boolean;
    Likes: Array<string>;
    Meets: Array<string>;
    _id: string;
    _rev: string;
    _key: string;
}

export interface UserProfile {
    Age: number;
    Gender: string;
    Description: string;
}