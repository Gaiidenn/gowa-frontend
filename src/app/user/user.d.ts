export interface User {
    Username: string;
    Password: string;
    Email: string;
    Gender: string;
    Likes: Array<string>;
    Meets: Array<string>;
    Age: number;
    _id: string;
    _rev: string;
    _key: string;
}
