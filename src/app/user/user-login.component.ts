import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {UserLogin} from './user';
import {UserService} from './user.service';

@Component({
    selector: 'user-login',
    templateUrl: 'app/user/user-login.component.html',
    styleUrls: ['app/user/user-login.component.css'],
    directives: [
        MD_INPUT_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MdToolbar,
        MdButton
    ]
})
export class UserLoginComponent implements OnInit {

    userLogin: UserLogin;

    constructor(
        private _rpc: jsonrpcService,
        private _cookieService: CookieService,
        private _userService: UserService
    ) {
        this.userLogin = {
            token: this._userService.user.token,
            username: "",
            password: ""
        };
    }

    ngOnInit() {

    }

    submit() {
        console.log("submit login!");
        this._userService.login(this.userLogin);
    }

    valid(): boolean {
        return this.userLogin.username.length >= 3 && this.userLogin.password.length >= 3;
    }
}
