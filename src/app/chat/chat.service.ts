import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {Chat, Message} from './chat';
import {User, Meet} from '../user/user';
import {UserService} from '../user/user.service';

@Injectable()
export class ChatService {
    public chats: Array<{
        chat: Chat;
        message: Message;
    }> = [];

    constructor(
        private _cookieService: CookieService,
        private _rpc: jsonrpcService,
        private _userService: UserService
    ) {
        this._rpc.Register("ChatService.msgReceived", this.msgReceived.bind(this));
        this._rpc.Register("ChatService.registerChat", this.registerChat.bind(this));
    }

    openChatWithUser(user: User) {
        let chatID: string;
        if (user._key != null) {
            for (let i in this._userService.user.Meets) {
                if (user._key == this._userService.user.Meets[i].UserID) {
                    chatID = this._userService.user.Meets[i].ChatID;
                }
            }
        }
        if (chatID != null) {
            this.openChat(chatID);
        } else {
            this._rpc.PromiseCall("ChatRPCService.NewChat", [this._userService.user, user])
                .then(chat => {
                    this.registerChat(chat);
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    openChat(chatID: string) {
        if (chatID != null) {
            this._rpc.PromiseCall("ChatRPCService.OpenChat", chatID)
                .then(chat => {
                    this.registerChat(chat);
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    sendMessage(message: Message) {
        if (message.Msg.length > 0) {
            message.User = this._userService.user;
            this._rpc.PromiseCall("ChatRPCService.NewMessage", message).then(() => {
                message.Msg = "";
            }).catch(err => {
                console.log(err);
            });
        }
    }

    msgReceived(message: Message): boolean {
        let registered = false;
        for (let i in this.chats) {
            if (this.chats[i].chat._key == message.ChatKey) {
                this.chats[i].chat.Conversation.push(message);
            }
        }
        if (!registered) {
            this.openChat(message.ChatKey);
        }
        return true
    }

    private registerChat(chat: Chat) {
        let exists = false;
        let message: Message = {
            ChatKey: chat._key,
            User: this._userService.user,
            Msg: ""
        };

        for (let i in this.chats) {
            if (this.chats[i].chat._id == chat._id) {
                exists = true;
                this.chats[i].chat = chat;
                this.chats[i].message = message;
                console.log(this.chats)
                continue;
            }
        }
        if (!exists) {
            this.chats.push({chat: chat, message: message});
        }
        this.checkMeets(chat);
        return true
    }

    private checkMeets(chat: Chat) {
        //  Protection to prevent including chat rooms (more than 2 users) into user's meets array
        if (chat.Users.length > 2) {
            return;
        }
        //  Protection to prevent stats on non-registered users
        if (this._userService.user._key == null) {
            return;
        }
        var user: User;
        for (let i in chat.Users) {
            if (chat.Users[i]._key != this._userService.user._key) {
                user = chat.Users[i];
            }
        }
        let exists = false;
        for (let i in this._userService.user.Meets) {
            if (user._key == this._userService.user.Meets[i].UserID) {
                exists = true
            }
        }
        if (!exists) {
            let meet: Meet = {
                UserID: user._key,
                ChatID: chat._key
            };
            console.log("pushing meet into meets array");
            this._userService.user.Meets.push(meet);
            console.log("trying to save user");
            this._userService.save();
        }
    }
}
