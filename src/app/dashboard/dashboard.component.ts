import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MdUniqueSelectionDispatcher} from '@angular2-material/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {UserService} from '../user/user.service';
import {UsersService} from '../users/users.service';
import {GENDERS} from '../user/mock-genders';
import {ChatService} from '../chat/chat.service';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styleUrls: ['app/dashboard/dashboard.component.css'],
    directives: [
        MdToolbar,
        MD_GRID_LIST_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MD_TABS_DIRECTIVES,
        MD_INPUT_DIRECTIVES
    ],
    providers: [
        UsersService,
        ChatService,
        MdUniqueSelectionDispatcher
    ]
})
export class DashboardComponent {
    usersLoading: boolean = true;

    constructor(
        private _userService: UserService,
        private _usersService: UsersService,
        private _chatService: ChatService
    ) {

    }

    getGenderValue(g: string): string {
        let v: string = "";
        for (let i in GENDERS) {
            if (GENDERS[i].key == g) {
                v = GENDERS[i].value;
            }
        }
        return v;
    }

    getDate(date: string): string {
        let d = new Date(parseInt(date));
        return d.toDateString() + " " + d.toTimeString();
    }

    getMsgDate(date: string): string {
        var result = "";
        let d = new Date(parseInt(date));
        let today = new Date();
        if (d.getDate() != today.getDate()) {
            result += d.toDateString() + " ";
        }
        result += d.toTimeString().substr(0, 8);
        return result;
    }
}
