import {User} from '../user/user';
export interface Chat {
    users: Array<User>;
    conversation: Array<Message>;
    id: string;
}

export interface Message {
    chatKey: string;
    User: User;
    msg: string;
}