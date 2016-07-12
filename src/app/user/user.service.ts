import {Injectable} from '@angular/core';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User, UserLogin} from './user';

export const STATUS_ANONYMOUS = 0;
export const STATUS_NAMED = 1;
export const STATUS_PROFILED = 2;
export const STATUS_REGISTERED = 3;

@Injectable()
export class UserService {
    public user: User;
    public registrationStatus: number = STATUS_ANONYMOUS;

    constructor(
        private _cookieService: CookieService,
        private _rpc: jsonrpcService
    ) {
        if (!this.user){
            this.user = UserService.newUser();
        }
        this.checkStatus()
    }

    newConnection(token: string) {
        this.user.token = token;
        let username = this._cookieService.get("username");
        let password = this._cookieService.get("password");
        if (username && password) {
            let userLogin: UserLogin = {
                token: this.user.token,
                username: username,
                password: password
            };
            this.login(userLogin);
        }
    }

    save(): any {
        return new Promise((resolve, reject) => {
            this._rpc.PromiseCall("UserRPCService.Save", this.user).then(user => {
                this.user = user;
                if (this.user.username) this._cookieService.put("username", this.user.username);
                if (this.user.password) this._cookieService.put("password", this.user.password);
                this.checkStatus();
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }

    login(userLogin: UserLogin) {
        userLogin.token = this.user.token;
        this._rpc.PromiseCall("UserRPCService.Login", userLogin).then(result => {
            console.log(JSON.stringify(result));
            this.user = result;
            this._cookieService.put("username", this.user.username);
            this._cookieService.put("password", this.user.password);
            this.registrationStatus = STATUS_REGISTERED;
        }).catch(error => {
            console.log(error);
        });
    }

    logout(): void {
        this.user.connected = false;
        this._rpc.PromiseCall("UserRPCService.Logout", this.user).then(() => {
            this.resetUser();
            this._cookieService.put("username", null);
            this._cookieService.put("password", null);
            this.registrationStatus = STATUS_ANONYMOUS;
        }).catch(error => {
            console.log(error)
        })

    }

    isUserRegistered(): boolean {
        if (!this.user) {
            return false;
        }
        return !!this.user.id;
    }

    setUsername(username: string) {
        this.user.username = username;
    }

    checkStatus(): number {
        switch (this.registrationStatus) {
            case STATUS_ANONYMOUS :
                if (this.user.username.length > 3) {
                    this.registrationStatus = STATUS_NAMED;
                }
                break;
            case STATUS_NAMED :
                if (this.user.age != 0 && this.user.gender != "") {
                    this.registrationStatus = STATUS_PROFILED;
                }
                break;
            case STATUS_PROFILED :
                if (this.user.id != null) {
                    this.registrationStatus = STATUS_REGISTERED;
                }
                break;
        }
        return this.registrationStatus;
    }

    protected static newUser(): User {
        return {
            id: null,
            token: "",
            username: "",
            password: "",
            email: "",
            age: null,
            gender: "",
            description: "",
            connected: true,
        };
    }

    resetUser() {
        this.user.id = "";
        this.user.username = "";
        this.user.password = "";
        this.user.email = "";
        this.user.age = null;
        this.user.description = "";
        this.user.gender = "";
        this.user.connected = true;
    }
}
