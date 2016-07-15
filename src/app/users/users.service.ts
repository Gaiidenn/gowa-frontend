import {Injectable} from '@angular/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from '../user/user';

@Injectable()
export class UsersService {
    public list: Array<User>;
    public connectedCount: ConnectedUsersCount = {
        anonymous: 0,
        notRegistered: 0,
        registered: 0
    };

    constructor(
        private _rpc: jsonrpcService
    ) {
        this._rpc.Register("UsersService.updateList", this.updateList.bind(this));
        this._rpc.Register("UsersService.removeFromList", this.removeFromList.bind(this));
        this._rpc.Register("UsersService.setConnectedCount", this.setConnectedCount.bind(this));
        this._rpc.PromiseCall("UserRPCService.GetAll", "")
            .then(users => this.list = users)
            .catch(error => console.log(error));
        this._rpc.PromiseCall("UserRPCService.GetConnectedCount", "")
            .then(result => this.setConnectedCount(result))
            .catch(err => console.log(err))
    }

    updateList(user: User, oldUsername: String = null): boolean {
        console.log(user);
        let inList = false;
        let username = oldUsername ? oldUsername : user.username;
        for (let i in this.list) {
            if (username == this.list[i].username || (this.list[i].token && user.token == this.list[i].token)) {
                this.list[i] = user;
                inList = true;
            }
        }
        if (inList == false) {
            this.list.push(user);
        }
        return true;
    }

    removeFromList(username: string): boolean {
        let tmp: Array<User> = [];
        for (let i in this.list) {
            if (this.list[i].username != username) {
                tmp.push(this.list[i]);
            }
        }
        this.list = tmp;
        return true
    }

    setConnectedCount(data: ConnectedUsersCount): boolean {
        this.connectedCount = data;
        return true;
    }

    sumConnected(): number {
        let i = this.connectedCount.anonymous + this.connectedCount.notRegistered + this.connectedCount.registered;
        return i;
    }
}

export interface ConnectedUsersCount {
    anonymous: number;
    notRegistered: number;
    registered: number;
}