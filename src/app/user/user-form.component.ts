import {Component, Input, OnInit} from '@angular/core';
import {NgForm, FormBuilder, Validators} from '@angular/common';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_PROGRESS_BAR_DIRECTIVES} from '@angular2-material/progress-bar';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MD_RADIO_DIRECTIVES} from '@angular2-material/radio';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from './user';
import {UserService} from './user.service';
import {FormGroup, FormControl} from "@angular/forms";

@Component({
    selector: 'user-form',
    templateUrl: 'app/user/user-form.component.html',
    styleUrls: ['app/user/user-form.component.css'],
    directives: [
        MD_LIST_DIRECTIVES,
        MD_PROGRESS_BAR_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_RADIO_DIRECTIVES,
        MdToolbar,
        MdButton,
        MdIcon
    ],
    providers: [
        //MdRadioDispatcher
    ]
})
export class UserFormComponent{

    genders = ['M', 'F'];

    registrationStep = 0;

    constructor(
        private _rpc: jsonrpcService,
        private _cookieService: CookieService,
        private _userService: UserService
    ) {
    }

    ngOnInit() {
    }

    save() {
        this._userService.save();
    }

    goToNextStep() {
        this.registrationStep = this._userService.stepUpStatus() ? this._userService.registrationStatus : this.registrationStep;
    }

    validForNextStep(): boolean {
        return true;
    }

    /*toggleEdit() {
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
    }*/

    getDividerColor(field: FormControl): string {
        console.log(field.errors);
        return field.valid || field.pristine ? "primary" : "accent";
    }

    registrationProgress(): number {
        return 50;
    }
}

export class tmpUser {

    constructor(
        public username: string
    ) {

    }
}