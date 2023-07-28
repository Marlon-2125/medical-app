import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserRegisterComponent } from './user-register/user-register.component';

import { MaterialModule } from '../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthenticationService } from '../services/authentication.service';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    UserRegisterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule,
    AuthRoutingModule
  ],
  providers: [AuthenticationService]
})
export class AuthModule { }