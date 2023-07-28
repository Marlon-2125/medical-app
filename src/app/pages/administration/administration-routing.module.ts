import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { AccessRequestComponent } from './access-request/access-request.component';

const routes: Routes = [
  { path: '', redirectTo: 'users-list' },
  { path: 'users-list', component: UsersListComponent, canActivate: [AuthenticationGuard] },   
  { path: 'create-users', component: CreateUsersComponent, canActivate: [AuthenticationGuard]},
  { path: 'edit-users/:id', component: EditUsersComponent, canActivate: [AuthenticationGuard]},
  { path: 'users-details/:id', component: UsersDetailsComponent, canActivate: [AuthenticationGuard]},
  { path: 'access-request', component: AccessRequestComponent, canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
