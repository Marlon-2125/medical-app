import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.css']
})
export class EditUsersComponent implements OnInit {

  userId: any;
  user: any = {};

  loading: boolean = false;
  isMatch: boolean = false;
  isDisabled: boolean = true;

  regexValidationEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  regexValidationPass = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

  userEditForm = new FormGroup({
    typeIdUsr: new FormControl('', Validators.required),
    identificationUsr: new FormControl('', Validators.compose([Validators.min(10000000), Validators.max(9999999999), Validators.required])),
    namesUsr: new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])),
    surnamesUsr: new FormControl('', Validators.compose([Validators.minLength(3), Validators.maxLength(50), Validators.required])),
    phoneUsr: new FormControl(0, Validators.compose([Validators.min(1000000), Validators.max(9999999999), Validators.required])),
    emailUsr: new FormControl('', Validators.pattern(this.regexValidationEmail)),
    profileUsr: new FormControl('', Validators.required),
    passwordUsr: new FormControl('', Validators.pattern(this.regexValidationPass)),
    cPasswordUsr: new FormControl({value: '', disabled: true}),
    authIdUsr: new FormControl(),
    userIdUsr: new FormControl()
  });

  
  typeId = [
    { name: 'CC', value: 'CC' },
    { name: 'TI', value: 'TI' },
    { name: 'PA', value: 'PA' },
  ];
  
  profileId = [
    { name: 'Administrador', value: 1 },
    { name: 'Instalador / Reparador', value: 2 },
    { name: 'Tecnico de Mantenimiento', value: 3 },
  ];
  
  
  constructor(private _route: ActivatedRoute, private _router: Router, private _userSvc: UsersService, private _authSvc: AuthenticationService) {
    this.userId = this._route.snapshot.params.id;
  }



  ngOnInit(): void {
    this.getUser(this.userId);
  }

  getUser(userId: string) {
    this._userSvc.getUserById(userId).pipe(
      take(1)
    )
    .subscribe((data: any) => {
      this.user = data;
      this.fillUserForm(userId, data);
    });
  }

  fillUserForm(userId: string, data:any) {
    this.userEditForm.controls.typeIdUsr.setValue(data.type_ID);
    this.userEditForm.controls.identificationUsr.setValue(Number(data.identification));
    this.userEditForm.controls.namesUsr.setValue(data.names);
    this.userEditForm.controls.surnamesUsr.setValue(data.surnames);
    this.userEditForm.controls.phoneUsr.setValue(Number(data.phone));
    this.userEditForm.controls.emailUsr.setValue(data.email);
    this.userEditForm.controls.profileUsr.setValue(Number(data.profile_ID));
    this.userEditForm.controls.authIdUsr.setValue(data.auth_ID);
    this.userEditForm.controls.userIdUsr.setValue(userId);
  }

  onSubmit() {
    this.loading = true;
    if(this.userEditForm.invalid){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Revisa el formulario por favor' ,
        showConfirmButton: false,
        timer: 1500
      });
      this.loading = false 
    }else{
      if ((this.userEditForm.controls.passwordUsr.value == this.userEditForm.controls.cPasswordUsr.value) || (this.userEditForm.controls.passwordUsr.value == '')) {
        this._userSvc.updateUser(this.userEditForm.value).then(data => data.json())
        .then((response) => {
          if(response.status == 200){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: response.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
          else{
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
            position: 'center',
            icon: 'error',
            title: 'Error: ' + err,
            showConfirmButton: false,
            timer: 1500
          });
          this.loading = false
        });
      }
      else{
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

  validatePassword(event: any){
    let passwordValue = this.userEditForm.controls.passwordUsr.value;
    if(passwordValue == event.target.value){
      this.isMatch = true;
      this.userEditForm.controls.cPasswordUsr.setErrors(null);
    }
    else{
      this.isMatch = false;
      this.userEditForm.controls.cPasswordUsr.setErrors({'incorrect': true});
    }
    console.log(this.isMatch);
  }

  verifyPassword(event:any){
    console.log(event.target.value);
    if(event.target.value != ''){
      this.userEditForm.controls.cPasswordUsr.enable();
    }else{
      this.userEditForm.controls.cPasswordUsr.disable();
      this.userEditForm.controls.cPasswordUsr.reset();
    }
  }

}
