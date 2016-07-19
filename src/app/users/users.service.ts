import {Injectable} from '@angular/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from '../user/user';

@Injectable()
export class UsersService {
    public list: Array<User>;
    public peopleMet: Array<{
        userID: string;
        users: Array<User>;
    }> = [];
    public connectedCount: ConnectedUsersCount = {
        anonymous: 0,
        notRegistered: 0,
        registered: 0
    };

    rpcSubscription: any;

    constructor(
        private _rpc: jsonrpcService
    ) {
        this.rpcSubscription = this._rpc.connectionStatusChange.subscribe((connectionStatusUp) => {
            if (connectionStatusUp == true) {
                this.init();
            }
        });
        this.init();
    }

    init() {
        console.log("usersService.init");
        this._rpc.Register("UsersService.updateList", this.updateList.bind(this));
        this._rpc.Register("UsersService.removeFromList", this.removeFromList.bind(this));
        this._rpc.Register("UsersService.setConnectedCount", this.setConnectedCount.bind(this));
        this._rpc.Register("UsersService.updatePeopleMet", this.updatePeopleMet.bind(this));

        this._rpc.PromiseCall("UserRPCService.GetAll", "")
            .then(users => {
                this.list = users;
                this.peopleMet = [];
                for (let i in this.list) {
                    let user = this.list[i];
                    this._rpc.PromiseCall("UserRPCService.GetPeopleMet", this.list[i])
                        .then(users => {
                            this.peopleMet.push({
                                userID: user.id,
                                users: users
                            })
                        })
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
        this._rpc.PromiseCall("UserRPCService.GetConnectedCount", "")
            .then(result => this.setConnectedCount(result))
            .catch(err => console.log(err))
    }

    updateList(user: User): boolean {
        if (!this.list) {
            return false;
        }
        let inList = false;
        for (let i in this.list) {
            if (user.id == this.list[i].id) {
                this.list[i] = user;
                inList = true;
            }
        }
        if (inList == false) {
            this.list.push(user);
        }
        return true;
    }

    removeFromList(id: string): boolean {
        let tmp: Array<User> = [];
        for (let i in this.list) {
            if (this.list[i].id != id) {
                tmp.push(this.list[i]);
            }
        }
        this.list = tmp;
        return true
    }

    updatePeopleMet(args: Array<any>): boolean {
        if (args.length != 2) {
            return false;
        }
        if (!this.peopleMet) {
            return false;
        }
        console.log(args);
        let userID = args[0];
        let users = args[1];
        let exists = false;
        for (let i in this.peopleMet) {
            if (this.peopleMet[i].userID == userID) {
                this.peopleMet[i].users = users;
                console.log("updating peopleMet for : ", userID);
                exists = true;
            }
        }
        if (!exists) {
            this.peopleMet.push({
                userID: userID,
                users: users
            });
        }
        return true;
    }

    setConnectedCount(data: ConnectedUsersCount): boolean {
        this.connectedCount = data;
        return true;
    }

    sumConnected(): number {
        let i = this.connectedCount.anonymous + this.connectedCount.notRegistered + this.connectedCount.registered;
        return i;
    }

    getPeopleMet(userID: string): Array<User> {
        let resp: Array<User> = [];
        for (let i in this.peopleMet) {
            if (this.peopleMet[i].userID == userID) {
                resp = this.peopleMet[i].users;
                continue;
            }
        }
        return resp;
    }
}

export interface ConnectedUsersCount {
    anonymous: number;
    notRegistered: number;
    registered: number;
}