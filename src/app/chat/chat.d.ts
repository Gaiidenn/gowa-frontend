import {User} from '../user/user';
export interface Chat {
    Users: Array<User>;
    Conversation: Array<Message>;
    _id: string;
    _rev: string;
    _key: string;
}

export interface Message {
    ChatKey: string;
    User: User;
    Msg: string;
}