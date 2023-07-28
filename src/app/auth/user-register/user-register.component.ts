import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  loading: boolean = false;

  regexValidationEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  userRegisterForm = new FormGroup({
    namesUser: new FormControl(),
    surnamesUser: new FormControl(),
    identificationUser: new FormControl(),
    clickUser: new FormControl(),
    comments: new FormControl()
  });

  itemsComments = [
    {name: "Paciente", value: "Paciente"},
    {name: "Médico", value: "Medico"},
    {name: "Cuidador", value: "Cuidador"}
  ]

  constructor(private _authSvc: AuthenticationService, private _router: Router, private _loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    this.userRegisterForm.controls.namesUser.disable();
    this.userRegisterForm.controls.surnamesUser.disable();
    this.userRegisterForm.controls.clickUser.disable();
  }

  onSubmit() {
    this.startBarCharge();
    const userRegisterData = this.userRegisterForm.value;
    if(this.userRegisterForm.status == 'VALID'){
      this._authSvc.sendAccessRequest(userRegisterData)
        .then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Solicitud de acceso enviada',
            footer: 'Verifique el estado de su solicitud aquí',
            showConfirmButton: false,
            timer: 1500
          });
          this.completeBarCharge();
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
          this.completeBarCharge();
        });
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Verifique los campos del formulario',
        showConfirmButton: false,
        timer: 1500
      });
      this.completeBarCharge();
    }
    
  }

  onVerifyAccess() {
    Swal.fire({
      title: 'Verificación de Acceso',
      html: 'Mediante este formulario podrá verificar el estado de su solicitud y los accesos a su cuenta',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      inputPlaceholder: '# Identificación',
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: (identification) => {
        return this._authSvc.verifyAccessRequest(identification)
          .then(response => {
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Solicitud Fallida: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if(result.value.length > 0){          
          if(result.value[0].status == 0){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Su última solicitud aún no tiene respuesta',
              showConfirmButton: true,
            });
          }
          else{
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: result.value[0].answer,
              showConfirmButton: true,
            });
          }
        } else { 
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'No hay solicitudes pendientes para esta identificación.',
            showConfirmButton: true,
          });
        }

      }
    })
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
