import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_PROGRESS_BAR_DIRECTIVES} from '@angular2-material/progress-bar';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_RADIO_DIRECTIVES, MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, MdUniqueSelectionDispatcher} from '@angular2-material/radio';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';
import {CookieService} from 'angular2-cookie/core';
import {jsonrpcService} from '../jsonrpc/jsonrpc.service';
import {Gender, User} from './user';
import {GENDERS} from './mock-genders';
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
        MD_CARD_DIRECTIVES,
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

    genders: Array<Gender> = GENDERS;
    tmpUser: User;

    subscription: any;

    registrationStep = 0;

    constructor(
        private _rpc: jsonrpcService,
        private _cookieService: CookieService,
        private _userService: UserService
    ) {
        this.tmpUser = UserService.newUser();
        this.subscription = this._userService.registrationStatusChange.subscribe((status) => {
            this.registrationStep = status;
            if (this.tmpUser != this._userService.user) {
                this.tmpUser = this._userService.user;
            }
        });
    }

    goToNextStep() {
        let self = this;
        this._userService.save(this.tmpUser).then(() => {
            self.registrationStep = self._userService.registrationStatus;
        }).catch( error => {
            console.log(error);
        });
    }

    editUser(i: number) {
        if (i > 3 || i < 0) return;
        this.tmpUser = this._userService.user;
        this.registrationStep = i;
    }

    /*getDividerColor(field: FormControl): string {
        return field.valid || field.pristine ? "primary" : "accent";
    }*/

    registrationProgress(): number {
        let total = 5;
        let sum = 0;
        if (this._userService.user.username.length > 3) sum++;
        if (this._userService.user.password.length > 3) sum++;
        if (this._userService.user.email.length > 3) sum++;
        if (this._userService.user.gender != "") sum++;
        if (this._userService.user.description != "") sum++;
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