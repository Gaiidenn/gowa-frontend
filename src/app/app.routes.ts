import { provideRouter, RouterConfig } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TodoComponent} from './todo/todo.component';

export const routes: RouterConfig = [
    {
        path: '',
        redirectTo: '/dashboard',
        terminal: true
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        terminal: true
    },
    {
        path: 'todo',
        component: TodoComponent,
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];