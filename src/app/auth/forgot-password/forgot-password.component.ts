import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  loading: boolean = false;

  regexValidationEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  forgotPasswordForm = new FormGroup({
    emailUser: new FormControl('', Validators.pattern(this.regexValidationEmail)),
  });

  constructor(private _authSvc: AuthenticationService, private _router: Router, private _loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.startBarCharge();
    const emailToReset = this.forgotPasswordForm.controls.emailUser.value;
    this._authSvc.sendVerificationEmail(emailToReset)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Enlace de recuperación de contraseña enviado',
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(['/login']);
      })
      .catch((err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Problemas al enviar',
          showConfirmButton: false,
          timer: 1500
        });
      });
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
