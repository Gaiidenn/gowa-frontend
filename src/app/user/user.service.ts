import {Injectable, Input} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from './user';

export const STATUS_ANONYMOUS = 0;
export const STATUS_NAMED = 1;
export const STATUS_PROFILED = 2;
export const STATUS_REGISTERED = 3;

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
        this.checkStatus()
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

    save(): any {
        interface Params {
            Token: string;
            User: User;
        };
        let params: Params = {
            Token: this._token,
            User: this.user
        };
        return new Promise((resolve, reject) => {
            this._rpc.PromiseCall("UserRPCService.Save", params).then(user => {
                this.user = user;
                if (this.user.Username) this._cookieService.put("username", this.user.Username);
                if (this.user.Password) this._cookieService.put("password", this.user.Password);
                this.checkStatus();
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }

    login(userLogin: UserLogin) {
        this._rpc.PromiseCall("UserRPCService.Login", userLogin).then(result => {
            console.log(JSON.stringify(result));
            this.user = result;
            this._cookieService.put("username", this.user.Username);
            this._cookieService.put("password", this.user.Password);
            console.log(this.user);
            console.log(this.isUserRegistered());
        }).catch(error => {
            console.log(error);
        });
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
        return !!this.user._key;
    }

    setUsername(username: string) {
        this.user.Username = username;
    }

    checkStatus(): number {
        switch (this.registrationStatus) {
            case STATUS_ANONYMOUS :
                if (this.user.Username.length > 3) {
                    this.registrationStatus = STATUS_NAMED;
                }
            case STATUS_NAMED :
                if (this.user.Profile.Age != null && this.user.Profile.Gender != "") {
                    this.registrationStatus = STATUS_PROFILED;
                }
            case STATUS_PROFILED :
                if (this.user._key != null) {
                    this.registrationStatus = STATUS_REGISTERED;
                }
                break;
        }
        return this.registrationStatus;
    }

    newUser(): User {
        return {
            Username: "",
            Password: "",
            Email: "",
            Profile: {
                Age: null,
                Gender: "",
                Description: ""
            },
            Likes: [],
            Meets: [],
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
