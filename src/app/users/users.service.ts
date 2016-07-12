import {Injectable} from '@angular/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from '../user/user';

@Injectable()
export class UsersService  {
    public list: Array<User>;

    constructor(
        private _rpc: jsonrpcService
    ) {
        this._rpc.Register("UsersService.updateList", this.updateList.bind(this));
        this._rpc.Register("UsersService.removeFromList", this.removeFromList.bind(this));
        this._rpc.PromiseCall("UserRPCService.GetAll", "")
            .then(users => this.list = users)
            .catch(error => console.log(error));
    }

    updateList(user: User, oldUsername: String = null): boolean {
        console.log(user);
        let inList = false;
        let username = oldUsername ? oldUsername : user.username;
        for (let i in this.list) {
            if (username == this.list[i].username) {
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
}
