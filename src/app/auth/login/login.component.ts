import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  loading: boolean = false;
  userId: any;
  passwordTextType: any;

  regexValidationEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  loginForm = new FormGroup({
    emailUser: new FormControl(''),
    passwordUser: new FormControl('')
  });

  constructor(private _loadingBarService: LoadingBarService, private _authSvc: AuthenticationService, private _router: Router) {
    if (sessionStorage.getItem('user_email')) {
      this.userId = sessionStorage.getItem('user_email')
      this.redirectLoggedByUser();
    }
  }

  ngOnInit(): void {}
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  togglePasswordTextType(){
    this.passwordTextType = !this.passwordTextType;
  }

  async onSubmit() {
    this.startBarCharge();
    console.log(this.loginForm.value.emailUser)
    if(this.loginForm.value.emailUser.indexOf('@') != -1){
      await this._authSvc.login(this.loginForm.value.emailUser, this.loginForm.value.passwordUser)
        .then(() => this.redirectLoggedByUser())
        .catch((err) => {
          this.completeBarCharge();
          console.log("Error de Inicio de Sesión: " + err);
          Swal.fire({
            icon: 'error',
            title: '¡Ups...!',
            text: '¡Parece que los datos son erróneos!'
          });
        });
    }
  }

  redirectLoggedByUser() {
    this._router.navigate(['/main-menu']);
    this.completeBarCharge();
  }


  startBarCharge() {
    this._loadingBarService.start();
    this.loading = true;
  }

  completeBarCharge() {
    this._loadingBarService.complete();
    this.loading = false;
  }

}
