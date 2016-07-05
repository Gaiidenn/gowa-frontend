import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {MD_SIDENAV_DIRECTIVES,} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MD_BUTTON_DIRECTIVES} from '@angular2-material/button';
import {MD_TOOLBAR_DIRECTIVES} from '@angular2-material/toolbar';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from './jsonrpc/jsonrpc.service';
import {WS_BASE_URL} from './websocket-config';
import {UserService} from './user/user.service';
import {UserFormComponent} from './user/user-form.component';
import {UserLoginComponent} from './user/user-login.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [
        ROUTER_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MD_GRID_LIST_DIRECTIVES,
        MdIcon,
        MD_BUTTON_DIRECTIVES,
        MD_TOOLBAR_DIRECTIVES,
        UserFormComponent,
        UserLoginComponent
    ],
    providers: [
        MdIconRegistry,
        CookieService,
        jsonrpcService,
        UserService
    ]
})
export class AppComponent {
    title = 'My GoWA2 APP !!';

    constructor(private _cookieService:CookieService,
                private _rpc:jsonrpcService,
                private _userService:UserService) {
        if (this._userService.user.Token && this._userService.user.Token != "") {
            this._rpc.newServer("ws://" + WS_BASE_URL + "/push", this._userService.user.Token);
        } else {
            this._rpc.newServer("ws://" + WS_BASE_URL + "/push");
        }
        this._rpc.Register("App.setToken", this.setToken.bind(this));
    }

    setToken(token: string): boolean {
        this._rpc.newClient("ws://" + WS_BASE_URL + "/jsonrpc", token);
        this._userService.newConnection(token);
        return true;
    }

    logout():void {
        this._userService.logout();
    }

    isUserRegistered():boolean {
        return this._userService.isUserRegistered();
    }

    private  getBaseUrl():string {
        let baseUrl = window.location.href;
        let prefix = "https://";
        if (baseUrl.indexOf(prefix) == 0) {
            baseUrl = baseUrl.substr(prefix.length);
        } else {
            prefix = "http://";
            baseUrl = baseUrl.substr(prefix.length);
        }
        return baseUrl.split("/")[0];
    }
}
