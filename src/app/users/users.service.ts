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
        this._rpc.Call("UserRPCService.GetAll", "", this.setUsers.bind(this));
    }

    setUsers(users: Array<User>) {
        if (users.length > 0) {
            this.list = users;
        }
    }

    updateList(list: Array<User>) {
        if (list.length == 0) {
            return "{error: 'no users received'}";
        }
        console.log(list);
        let inList = false;
        for (let i in this.list) {
            if (list[0]._key == this.list[i]._key) {
                this.list[i] = list[0];
                inList = true;
            }
        }
        if (inList == false) {
            this.list.push(list[0]);
        }
        return "ok";
    }
}
