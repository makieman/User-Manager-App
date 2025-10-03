import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';


export const routes: Routes = [
    {
        path: 'users',
        loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent),
    },
    {
        path: 'users/new',
        loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent),
    },
    {
        path: 'users/:id',
        loadComponent: () => import('./users/user-detail/user-detail.component').then(m => m.UserDetailComponent),
    },
    {
        path: 'users/:id/edit',
        loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent),
    },
    { path: '', redirectTo: '/users', pathMatch: 'full' },
    { path: '**', redirectTo: '/users' },
];