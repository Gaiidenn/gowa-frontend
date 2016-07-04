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
        this._rpc.PromiseCall("UserRPCService.GetAll", "").then(users => this.list = users).catch(error => console.log(error));
    }

    updateList(user: User) {
        console.log(user);
        let inList = false;
        for (let i in this.list) {
            if (user._key && user._key == this.list[i]._key) {
                this.list[i] = user;
                inList = true;
            }
        }
        if (inList == false) {
            this.list.push(user);
        }
        return "ok";
    }
}
