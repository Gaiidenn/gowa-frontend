import {Injectable, Input} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from './user';

@Injectable()
export class UserService {
    public user: User;
    public registrationStatus: number = STATUS_ANONYMOUS;
    private _token: string;

    constructor(
        private _cookieService: CookieService,
        private _rpc: jsonrpcService
    ) {
        if (!this.user){
            this.user = this.newUser();
        }
    }

    newConnection(token: string) {
        this._token = token;
        let username = this._cookieService.get("username");
        let password = this._cookieService.get("password");
        if (username && password) {
            let userLogin: UserLogin = {
                Username: username,
                Password: password
            };
            this.login(userLogin);
        }
    }

    save() {
        interface Params {
            Token: string;
            User: User;
        };
        let params: Params = {
            Token: this._token,
            User: this.user
        };
        console.log(this._token);
        console.log(params);
        this._rpc.Call("UserRPCService.Save", params, this.onSaveResponse.bind(this));
    }
    onSaveResponse(result: User, error: any) {
        if (error != null) {
            console.log(error);
            return;
        }
        this.user = result;
        if (this.user.Username) this._cookieService.put("username", this.user.Username);
        if (this.user.Password) this._cookieService.put("password", this.user.Password);
        this.checkStatus();
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
        this.user = this.newUser();
        this._cookieService.put("username", null);
        this._cookieService.put("password", null);
    }

    isUserRegistered(): boolean {
        if (!this.user) {
            return false;
        }
        return this.user._id ? true : false;
    }

    setUsername(username: string) {
        this.user.Username = username;
    }

    checkStatus(): boolean {
        switch (this.registrationStatus) {
            case STATUS_ANONYMOUS :
                if (this.user.Username.length > 3) {
                    this.registrationStatus = STATUS_NAMED;
                }
                break;
            case STATUS_NAMED :
                break;
            case STATUS_PROFILED :
                break;
        }
        return false;
    }

    newUser(): User {
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

export const STATUS_ANONYMOUS = 0;
export const STATUS_NAMED = 1;
export const STATUS_PROFILED = 2;
