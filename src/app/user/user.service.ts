import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from './user';

@Injectable()
export class UserService {
    public user: User;

    constructor(
        private _cookieService: CookieService,
        private _rpc: jsonrpcService
    ) {
        if (!this.user){
            this.user = this.initUser();
        }
    }

    save() {
        this._rpc.Call("UserRPCService.Save", this.user, this.onSaveResponse.bind(this));
    }
    onSaveResponse(result: any, error: any) {
        if (error != null) {
            console.log(error);
            return;
        }
        this.user = result;
        this._cookieService.put("username", this.user.Username);
        this._cookieService.put("password", this.user.Password);
    }

    login(userLogin: UserLogin) {
        this._rpc.Call("UserRPCService.Login", userLogin, this.loginResponse.bind(this));
    }
    loginResponse(result: any, error: any) {
        if (error != null) {
            console.log(error);
            return;
        }
        console.log(JSON.stringify(result));
        this.user = result;
        this._cookieService.put("username", this.user.Username);
        this._cookieService.put("password", this.user.Password);
        console.log(this.user);
        console.log(this.isUserRegistered());
    }

    logout(): void {
        this.user = this.initUser();
        this._cookieService.put("username", null);
        this._cookieService.put("password", null);
    }

    isUserRegistered(): boolean {
        if (!this.user) {
            return false;
        }
        return this.user._id ? true : false;
    }

    private initUser(): User {
        return {
            Username: "",
            Password: "",
            Email: "",
            Gender: "",
            Likes: [],
            Meets: [],
            Age: null,
            _id: null,
            _rev: null,
            _key: null
        };
    }
}

export interface UserLogin {
    Username: string;
    Password: string;
}
