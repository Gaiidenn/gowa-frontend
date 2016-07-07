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

    updateList(user: User): boolean {
        console.log(user);
        let inList = false;
        for (let i in this.list) {
            if (user.Token && user.Token == this.list[i].Token) {
                this.list[i] = user;
                inList = true;
            }
        }
        if (inList == false) {
            this.list.push(user);
        }
        return true;
    }

    removeFromList(token: string): boolean {
        for (let i in this.list) {
            if (this.list[i].Token == token) {
                delete this.list[i]
            }
        }
        return true
    }
}
