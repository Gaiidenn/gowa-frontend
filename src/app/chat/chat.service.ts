import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {Chat, Message} from './chat';
import {User, Meet} from '../user/user';
import {UserService} from '../user/user.service';

@Injectable()
export class ChatService {
    rpcSubscription: any;
    public chats: Array<{
        chat: Chat;
        message: Message;
    }> = [];

    constructor(
        private _cookieService: CookieService,
        private _rpc: jsonrpcService,
        private _userService: UserService
    ) {
        this.rpcSubscription = this._rpc.connectionStatusChange.subscribe((connectionStatusUp) => {
            if (connectionStatusUp == true) {
                this._rpc.Register("ChatService.msgReceived", this.msgReceived.bind(this));
            }
        });
        this._rpc.Register("ChatService.msgReceived", this.msgReceived.bind(this));
    }

    openChatWithUser(user: User) {

        this._rpc.PromiseCall("ChatRPCService.OpenPrivateChat", [this._userService.user, user])
            .then(chat => {
                this.registerChat(chat);
            })
            .catch(err => {
                console.log(err)
            });
    }

    openChat(chatID: string) {
        if (chatID != null) {
            this._rpc.PromiseCall("ChatRPCService.GetChat", chatID)
                .then(chat => {
                    this.registerChat(chat);
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    closeChat(chatID: string) {
        let tmp: Array<{
            chat: Chat;
            message: Message;
        }> = [];
        for (let i in this.chats) {
            if (this.chats[i].chat.id != chatID) {
                tmp.push({chat: this.chats[i].chat, message: this.chats[i].message});
            }
        }
        this.chats = tmp;
    }

    sendMessage(message: Message) {
        let sent = false;
        console.log("number of chats : " + this.chats.length);
        if (message.msg.length > 0 && !sent) {
            message.user = this._userService.user;
            sent = true;
            this._rpc.PromiseCall("ChatRPCService.NewMessage", message).then(() => {
                sent = false;
                message.msg = "";
            }).catch(err => {
                sent = false;
                console.log(err);
            });
        }
    }

    msgReceived(message: Message): boolean {
        let registered = false;
        for (let i in this.chats) {
            if (this.chats[i].chat.id == message.chatID) {
                this.chats[i].chat.conversation.push(message);
                registered = true;
            }
        }
        if (!registered) {
            this.openChat(message.chatID);
        }
        return true;
    }

    private registerChat(chat: Chat) {
        let exists = false;
        let message: Message = {
            chatID: chat.id,
            user: this._userService.user,
            msg: "",
            createdAt: ""
        };

        for (let i in this.chats) {
            if (this.chats[i].chat.id == chat.id) {
                exists = true;
                this.chats[i].chat = chat;
                this.chats[i].message = message;
                console.log(this.chats);
            }
        }
        if (!exists) {
            this.chats.push({chat: chat, message: message});
        }
        return true;
    }
}
