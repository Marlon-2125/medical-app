import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {

  loading: boolean = false;
  isMatch: boolean = false;

  regexValidationEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  regexValidationPass = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  userForm = new FormGroup({
    typeIdUsr: new FormControl(),
    identificationUsr: new FormControl(0, Validators.compose([Validators.min(10000000), Validators.max(9999999999), Validators.required])),
    namesUsr: new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])),
    surnamesUsr: new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])),
    phoneUsr: new FormControl(0, Validators.compose([Validators.min(1000000), Validators.max(9999999999), Validators.required])),
    emailUsr: new FormControl('', Validators.pattern(this.regexValidationEmail)),
    profileUsr: new FormControl(),
    passwordUsr: new FormControl('', Validators.pattern(this.regexValidationPass)),
    cPasswordUsr: new FormControl('', Validators.required)
  });

  typeId = [
    { name: 'CC', value: 'CC' },
    { name: 'TI', value: 'TI' },
    { name: 'PA', value: 'PA' },
  ];

  profileId = [
    { name: 'Administrador', value: 1 },
    { name: 'Instalador / Reparador', value: 2 },
    { name: 'Mantenimiento', value: 3 },
  ];


  constructor(private _userSvc: UsersService, private _router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    if (this.userForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Revisa el formulario por favor',
        showConfirmButton: false,
        timer: 1500
      });
      this.loading = false
    } else {
      if (this.userForm.controls.passwordUsr.value == this.userForm.controls.cPasswordUsr.value) {
        this._userSvc.createUser(this.userForm.value).then((data) => data.json())
          .then((response) => {
            if (response.status == 200) {
              this.userForm.reset();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
              });
              this._router.navigate(['/administration/users-list'])
            } else {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.message.code,
                showConfirmButton: false,
                timer: 1500
              });
            }
            this.loading = false;
          })
          .catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error: ' + err,
              showConfirmButton: false,
              timer: 1500
            });
            this.loading = false
          });

      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Las contraseñas no coinciden',
          showConfirmButton: false,
          timer: 1500
        });
        this.loading = false
      }
    }
  }

  validatePassword(event: any) {
    let passwordValue = this.userForm.controls.passwordUsr.value;
    if (passwordValue == event.target.value) {
      this.isMatch = true;
      this.userForm.controls.cPasswordUsr.setErrors(null);
    }
    else {
      this.isMatch = false;
      this.userForm.controls.cPasswordUsr.setErrors({ 'incorrect': true });
    }
  }
  
}
