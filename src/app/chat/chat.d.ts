import {User} from '../user/user';
export interface Chat {
    id: string;
    users: Array<User>;
    conversation: Array<Message>;
    createdAt: string;
    'private': boolean;
}

export interface Message {
    chatID: string;
    user: User;
    msg: string;
    createdAt: string;
}