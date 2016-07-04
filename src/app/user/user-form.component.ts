import {Component, Input, OnInit} from '@angular/core';
import {NgForm, FormBuilder, Validators} from '@angular/common';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_PROGRESS_BAR_DIRECTIVES} from '@angular2-material/progress-bar';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MD_RADIO_DIRECTIVES, MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, MdUniqueSelectionDispatcher} from '@angular2-material/radio';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {User} from './user';
import {UserService, STATUS_ANONYMOUS, STATUS_REGISTERED} from './user.service';
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
        MdUniqueSelectionDispatcher,
        MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR
    ]
})
export class UserFormComponent{

    genders = [{key:'M', value:'Man'},{key:'F', value:'Lady'}];

    registrationStep = 0;

    constructor(
        private _rpc: jsonrpcService,
        private _cookieService: CookieService,
        private _userService: UserService
    ) {
        
    }

    diagnostic() {
        return JSON.stringify(this._userService.user);
    }
    goToNextStep() {
        let self = this;
        this._userService.save().then(() => {
            self.registrationStep = self._userService.registrationStatus;
        }).catch( error => {
            console.log(error);
        });
    }

    getDividerColor(field: FormControl): string {
        return field.valid || field.pristine ? "primary" : "accent";
    }

    registrationProgress(): number {
        let total = 5;
        let sum = 0;
        if (this._userService.user.Username.length > 3) sum++;
        if (this._userService.user.Password.length > 3) sum++;
        if (this._userService.user.Email.length > 3) sum++;
        if (this._userService.user.Profile.Gender != "") sum++;
        if (this._userService.user.Profile.Description != "") sum++;
        return (sum/total)*100;
    }

    registrationStepBackward() {
        if (this.registrationStep > 0) {
            this.registrationStep--;
        }
    }

    registrationStepForward() {
        this.registrationStep++;
    }
}