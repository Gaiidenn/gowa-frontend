import {Component, Input, OnInit} from '@angular/core';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MdRadioGroup, MdRadioButton, MdRadioDispatcher} from '@angular2-material/radio';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {NgForm} from '@angular/common';
import {User} from './user';
import {UserService} from './user.service';

@Component({
    selector: 'user-form',
    templateUrl: 'app/user/user-form.component.html',
    styleUrls: ['app/user/user-form.component.css'],
    directives: [
        MD_LIST_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MdToolbar,
        MdButton,
        MdRadioGroup,
        MdRadioButton,
        MdIcon
    ],
    providers: [
        MdRadioDispatcher
    ]
})
export class UserFormComponent implements OnInit {

    genders = ['M', 'F'];

    tmpUser: User;
    private _editEnabled: boolean = false;

    constructor(
        private _rpc: jsonrpcService,
        private _cookieService: CookieService,
        private _userService: UserService
    ) {

    }

    ngOnInit() {
        this.tmpUser = this._userService.user;
    }

    save() {
        this._userService.save();
        this._editEnabled = false;
    }

    toggleEdit() {
        if (this._editEnabled == false) {
            for (let attr in this._userService.user) {
                this.tmpUser[attr] = this._userService.user[attr];
            }
        } else {
            for (let attr in this._userService.user) {
                this._userService.user[attr] = this.tmpUser[attr];
            }
        }
        this._editEnabled = !this._editEnabled;
    }
    isEditEnabled(): boolean{
        return this._editEnabled;
    }
}
