import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { EditUsersComponent } from './edit-users/edit-users.component';

import { MaterialModule } from '../../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UsersService } from 'src/app/services/users.service';
import { AccessRequestComponent } from './access-request/access-request.component';


@NgModule({
  declarations: [
    UsersListComponent,
    UsersDetailsComponent,
    CreateUsersComponent,
    EditUsersComponent,
    AccessRequestComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule
  ],
  providers: [UsersService]
})
export class AdministrationModule { }
