import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { InfraestructureService } from 'src/app/services/infraestructure.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scale-infraestructure-request',
  templateUrl: './scale-infraestructure-request.component.html',
  styleUrls: ['./scale-infraestructure-request.component.css']
})
export class ScaleInfraestructureRequestComponent implements OnInit {
  loading: boolean = false;

  regexValidationTask = /^[\-0-9]+$/;

  isChbalance = false;
  isChx = false;
  isPpqx = false;
  isPpqy = false;
  isMerx = false;
  isPupx = false;
  isPdownx = false;
  isPdowny = false;
  isChy = false;
  isMery = false;
  isPupy = false;
  isRf89 = false;
  isMer89 = false;
  isRf73 = false;
  isMer73 = false;
  isChxtv = false;
  isMerxtv = false;
  isChytv = false;
  isMerytv = false;

  isValidForm = true;
  errorMessageForm = '';

  scaleInfraesctrureForm = new FormGroup({
    isPhotoSif: new FormControl(),
    isSmnetTestSif: new FormControl(),
    processSif: new FormControl(),
    productSif: new FormControl(),
    taskSif: new FormControl('', Validators.pattern(this.regexValidationTask)),
    subjectSif: new FormControl(),
    userIdSif: new FormControl(),
    emailUsrSif: new FormControl(),
    userIdentificationSif: new FormControl(),
    markTAPSif: new FormControl(),
    addressTAPSif: new FormControl(),
    vTAPSif: new FormControl(),
    macRealCPESif: new FormControl(),
    isMarkInstalledSif: new FormControl(),
    commentsSif: new FormControl(),
    netTypeSif: new FormControl(),
    rf14: new FormControl(),
    rf120: new FormControl(),
    rf135: new FormControl(),
    rf157: new FormControl(),
    chx: new FormControl(),
    rfx: new FormControl(),
    ppqx: new FormControl(),
    merx: new FormControl(),
    berx: new FormControl(),
    pupx: new FormControl(),
    pdownx: new FormControl(),
    pdowny: new FormControl(),
    chy: new FormControl(),
    rfy: new FormControl(),
    ppqy: new FormControl(),
    mery: new FormControl(),
    bery: new FormControl(),
    pupy: new FormControl(),
    rf89: new FormControl(),
    mer89: new FormControl(),
    ber89: new FormControl(),
    rf73: new FormControl(),
    mer73: new FormControl(),
    ber73: new FormControl(),
    chxtv: new FormControl(),
    rfxtv: new FormControl(),
    merxtv: new FormControl(),
    berxtv: new FormControl(),
    chytv: new FormControl(),
    rfytv: new FormControl(),
    merytv: new FormControl(),
    berytv: new FormControl(),
    concatData: new FormControl(),
  });
  
  itemsIsPhoto = [
    { name: 'SI', value: 'SI'},
    { name: 'NO', value: 'NO'}
  ];

  itemsIsSmnetTest = [
    { name: 'SI', value: 'SI'},
    { name: 'NO', value: 'NO'}
  ]

  itemsProductSif = [
    { name: 'TV', value: 'TV' },
    { name: 'Internet/TOIP', value: 'Internet/TOIP' },
    { name: 'Internet/TOIP/TV', value: 'Internet/TOIP/TV' },
  ]

  itemsProcessSif = [
    { name: 'Instalación', value: 'Instalacion' },
    { name: 'Reparación', value: 'Reparacion' }
  ];

  itemsSubject = [
    { name: 'Niveles Deficientes', value: 'Niveles Deficientes'},
    { name: 'Sin Señal', value: 'Sin Señal'},
    { name: 'Daño Físico', value: 'Daño Fisico'},
    { name: 'Robo de TAP', value: 'Robo de TAP'},
    { name: 'Sin Retorno', value: 'Sin Retorno'},
    { name: 'Red Caída', value: 'Red Caida'},
    { name: 'Pixelación', value: 'Pixelacion'},
    { name: 'Intermitencia', value: 'Intermitencia'},
    { name: 'Otros', value: 'Otros'},
  ];

  itemsVTap = [
    { name: '2x4', value: '2x4'},
    { name: '2x8', value: '2x8'},
    { name: '2x11', value: '2x11'},
    { name: '2x14', value: '2x14'},
    { name: '2x17', value: '2x17'},
    { name: '2x20', value: '2x20'},
    { name: '2x23', value: '2x23'},
    { name: '2x26', value: '2x26'},
    { name: '2x29', value: '2x29'},
    { name: '2x32', value: '2x32'},
    { name: '4x8', value: '4x8'},
    { name: '4x11', value: '4x11'},
    { name: '4x14', value: '4x14'},
    { name: '4x17', value: '4x17'},
    { name: '4x20', value: '4x20'},
    { name: '4x23', value: '4x23'},
    { name: '4x26', value: '4x26'},
    { name: '4x29', value: '4x29'},
    { name: '4x32', value: '4x32'},
    { name: '8x11', value: '8x11'},
    { name: '8x14', value: '8x14'},
    { name: '8x17', value: '8x17'},
    { name: '8x20', value: '8x20'},
    { name: '8x23', value: '8x23'},
    { name: '8x26', value: '8x26'},
    { name: '8x29', value: '8x29'},
    { name: '8x32', value: '8x32'}
  ];

  itemsNetType = [
    { name: '750', value: '750'},
    { name: '870', value: '870'},
    { name: '1000', value: '1000'},
  ];

  itemsIsMarkInstalled = [
    { name: 'SI', value: 'SI'},
    { name: 'NO', value: 'NO'}
  ];

  constructor(private _infraestructureSvc: InfraestructureService, private _router: Router, private _loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id') || '';
    const userEmail = sessionStorage.getItem('user_email') || '';
    const userIdentification = sessionStorage.getItem('user_identification') || '';
    this.fillScaleInfraesctrureForm(userId, userEmail, userIdentification);
  }


  onSubmit() {
    this.startBarCharge();
    this.scaleInfraesctrureForm.controls.userIdentificationSif.enable();
    this.scaleInfraesctrureForm.controls.emailUsrSif.enable();
    this.concatData();
    this.checkRanges();
    if(this.scaleInfraesctrureForm.invalid == false){
      if(this.isValidForm){
        this._infraestructureSvc.createInfraestructureRequest(this.scaleInfraesctrureForm.value).then(data => data.json())
          .then((response) => {
            this.scaleInfraesctrureForm.controls.userIdentificationSif.disable();
            this.scaleInfraesctrureForm.controls.emailUsrSif.disable();
            if (response.status == 200) {
              console.log(response);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Solicitud de Escalamiento Creada',
                showConfirmButton: false,
                timer: 4500
              });
              this._router.navigate(['/scale-infraestructure/dashboard']);
            }
            else {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.message.code || response.message,
                showConfirmButton: false,
                timer: 4500
              });
              this.loading = false;
            }
            this.completeBarCharge();
          })
          .catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err,
              showConfirmButton: false,
              timer: 4500
            });
            this.loading = false;
            this.completeBarCharge();
          });      
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Errores al Escalar',
          text: this.errorMessageForm,
          showConfirmButton: true,
          timer: 4500
        });       
        this.loading = false;
        this.completeBarCharge();
      }     
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "Verifique si el formulario esta completo y válido",
        showConfirmButton: true,
      });
      this.loading = false;
      this.completeBarCharge();
    }

  }

  fillScaleInfraesctrureForm(userId: string, userEmail: string, userIdentification: string) {
    this.scaleInfraesctrureForm.controls.userIdSif.setValue(userId);
    this.scaleInfraesctrureForm.controls.userIdentificationSif.setValue(userIdentification);
    this.scaleInfraesctrureForm.controls.emailUsrSif.setValue(userEmail);
    this.scaleInfraesctrureForm.controls.userIdentificationSif.disable();
    this.scaleInfraesctrureForm.controls.emailUsrSif.disable();
  }

  filterFields(){
    const processSifValue = this.scaleInfraesctrureForm.controls.processSif.value;
    const productSifValue = this.scaleInfraesctrureForm.controls.productSif.value;
    const subjectSifValue = this.scaleInfraesctrureForm.controls.subjectSif.value;
    
    if(processSifValue == null || productSifValue == null || subjectSifValue == null){
      this.resetDinamicFields();
    }
    else{
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isChbalance = true;        
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isRf89 = true;
        this.isRf73 = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isRf73 = true;
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isChbalance = true;        
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isRf89 = true;
        this.isRf73 = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Sin Señal"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isRf73 = true;
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para TV",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para TV",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para TV",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Sin Retorno"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para TV",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Robo de TAP"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Red Caida"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Daño Fisico"){
        this.resetDinamicFields();
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: "Obligatorio llenas campos activos, adjuntar foto y documentar en Observaciones",
          showConfirmButton: false,
          timer: 4500
        });
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para Internet/ToIP",
          showConfirmButton: false,
          timer: 4500
        });        
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para Internet/ToIP",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para Internet/ToIP",
          showConfirmButton: false,
          timer: 4500
        });
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.scaleInfraesctrureForm.controls.processSif.setValue('--');
        this.scaleInfraesctrureForm.controls.productSif.setValue('--');
        this.scaleInfraesctrureForm.controls.subjectSif.setValue('--');
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: "No Aplica para Internet/ToIP",
          showConfirmButton: false,
          timer: 4500
        });        
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Pixelacion"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Niveles Deficientes"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Intermitencia"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isPpqx = true;
        this.isMerx = true;
        this.isPupx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isPpqy = true;
        this.isMery = true;
        this.isPupy = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Reparacion" && productSifValue == "TV" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "Internet/TOIP/TV" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isChbalance = true;
        this.isChx = true;
        this.isMerx = true;
        this.isPdownx = true;
        this.isChy = true;
        this.isMery = true;
        this.isPdowny = true;
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }
      if(processSifValue == "Instalacion" && productSifValue == "TV" && subjectSifValue == "Otros"){
        this.resetDinamicFields();
        this.isRf89 = true;
        this.isMer89 = true;
        this.isRf73 = true;
        this.isMer73 = true;
        this.isChxtv = true;
        this.isMerxtv = true;
        this.isChytv = true;
        this.isMerytv = true;
      }

    }
    
  }

  resetDinamicFields(){
    this.isChbalance = false;
    this.isChx = false;
    this.isPpqx = false;
    this.isPpqy = false;
    this.isMerx = false;
    this.isPupx = false;
    this.isPdownx = false;
    this.isPdowny = false;
    this.isChy = false;
    this.isMery = false;
    this.isPupy = false;
    this.isRf89 = false;
    this.isMer89 = false;
    this.isRf73 = false;
    this.isMer73 = false;
    this.isChxtv = false;
    this.isMerxtv = false;
    this.isChytv = false;
    this.isMerytv = false;
  }

  checkRanges(){
    const processSifValue = this.scaleInfraesctrureForm.controls.processSif.value;
    const productSifValue = this.scaleInfraesctrureForm.controls.productSif.value;
    const subjectSifValue = this.scaleInfraesctrureForm.controls.subjectSif.value;
    const netTypeSif = this.scaleInfraesctrureForm.controls.netTypeSif.value;
    this.isValidForm = true;    

    if((productSifValue == "Internet/TOIP/TV" || productSifValue == "Internet/TOIP")  && (subjectSifValue == "Intermitencia" || subjectSifValue == "Sin Retorno" || subjectSifValue == "Niveles Deficientes")){
      if(netTypeSif == '750'){
        if((this.scaleInfraesctrureForm.controls.rf14.value >= 6 && this.scaleInfraesctrureForm.controls.rf14.value <= 19) ||
            (this.scaleInfraesctrureForm.controls.rf120.value >= 12 && this.scaleInfraesctrureForm.controls.rf120.value <= 25) ){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF120 fuera de los rangos 6-19 y 12-25 respectivamente.';              
              this.isValidForm = false;
            }
      }
      if(netTypeSif == '870'){
        if((this.scaleInfraesctrureForm.controls.rf14.value >= 6 && this.scaleInfraesctrureForm.controls.rf14.value <= 19) ||
            (this.scaleInfraesctrureForm.controls.rf135.value >= 14 && this.scaleInfraesctrureForm.controls.rf135.value <= 26) ){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF135 fuera de los rangos 6-19 y 14-26 respectivamente.';    
              this.isValidForm = false;
            }
      }
      if(netTypeSif == '1000'){
        if((this.scaleInfraesctrureForm.controls.rf14.value >= 6 && this.scaleInfraesctrureForm.controls.rf14.value <= 19) ||
            (this.scaleInfraesctrureForm.controls.rf157.value >= 17 && this.scaleInfraesctrureForm.controls.rf157.value <= 26) ){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF157 fuera de los rangos 6-19 y 17-26 respectivamente.';    
              this.isValidForm = false;
            }
      }
      if((this.scaleInfraesctrureForm.controls.merx.value >= 35 && this.scaleInfraesctrureForm.controls.merx.value <= 60) || 
      (this.scaleInfraesctrureForm.controls.merx.value >= 35 && this.scaleInfraesctrureForm.controls.merx.value <= 60) ){
        this.errorMessageForm = 'Se escala con valores de Merx, Berx, Mery y Bery fuera del rango 35-60.';    
        this.isValidForm = false;
      }
      if(this.scaleInfraesctrureForm.controls.pdownx.value >= 6 && this.scaleInfraesctrureForm.controls.pdowny.value >= 6){
        this.errorMessageForm = 'Se escala con valores de Potencia DownX y Potencia DownY menores a 6.';    
        this.isValidForm = false;
      }
    }

    if(productSifValue == "TV" && (subjectSifValue == "Pixelacion" || subjectSifValue == "Niveles Deficientes")) {
      if((this.scaleInfraesctrureForm.controls.rf73.value >= 6 && this.scaleInfraesctrureForm.controls.rf73.value <= 24) ||
        (this.scaleInfraesctrureForm.controls.rf89.value >= 6 && this.scaleInfraesctrureForm.controls.rf89.value <= 24) ||
        (this.scaleInfraesctrureForm.controls.chx.value >= 6 && this.scaleInfraesctrureForm.controls.chx.value <= 24) ||
        (this.scaleInfraesctrureForm.controls.chy.value >= 6 && this.scaleInfraesctrureForm.controls.chy.value <= 24) ){
          this.errorMessageForm = 'Se escala con valores de RF73, RF89, Chx y Chy fuera del rango 6-24.';    
          this.isValidForm = false;
      }
      if((this.scaleInfraesctrureForm.controls.merx.value >= 35 && this.scaleInfraesctrureForm.controls.merx.value <= 60) || 
        (this.scaleInfraesctrureForm.controls.merx.value >= 35 && this.scaleInfraesctrureForm.controls.merx.value <= 60) ){
        this.errorMessageForm = 'Se escala con valores de Merx, Berx, Mery y Bery fuera del rango 35-60.';    
        this.isValidForm = false;
      }      
    }

    if((productSifValue == "Internet/TOIP/TV" || productSifValue == "Internet/TOIP")  && (subjectSifValue == "Intermitencia" || subjectSifValue == "Niveles Deficientes")){
      if((this.scaleInfraesctrureForm.controls.pupx.value >= 35 && this.scaleInfraesctrureForm.controls.pupx.value <= 42) ||
         (this.scaleInfraesctrureForm.controls.pupy.value >= 35 && this.scaleInfraesctrureForm.controls.pupy.value <= 42) ){
        this.errorMessageForm = 'Se escala con valores de Potencia UpX y Potencia UpY fuera del rango 35-42.';    
        this.isValidForm = false;
      }
    }

    if((productSifValue == "Internet/TOIP/TV" || productSifValue == "Internet/TOIP") && subjectSifValue == "Sin Señal"){
      if(netTypeSif == '750'){
        if(this.scaleInfraesctrureForm.controls.rf14.value >= 0 || this.scaleInfraesctrureForm.controls.rf120.value >= 0){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF120 negativos.';              
              this.isValidForm = false;
            }
      }
      if(netTypeSif == '870'){
        if(this.scaleInfraesctrureForm.controls.rf14.value >= 0 || this.scaleInfraesctrureForm.controls.rf135.value >= 0){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF135 negativos.';    
              this.isValidForm = false;
            }
      }
      if(netTypeSif == '1000'){
        if(this.scaleInfraesctrureForm.controls.rf14.value >= 0 || this.scaleInfraesctrureForm.controls.rf157.value >= 0){
              this.errorMessageForm = 'Se escala con valores de RF14 y RF157 negativos.';    
              this.isValidForm = false;
            }
      }
    }

    if(productSifValue == "TV" && subjectSifValue == "Sin Señal"){
      if(this.scaleInfraesctrureForm.controls.rf73.value >= 0  || this.scaleInfraesctrureForm.controls.rf89.value >= 0 ){
          this.errorMessageForm = 'Se escala con valores de RF73 y RF89 negativos.';    
          this.isValidForm = false;
      }
    }
    
  }

  concatData() {
    let EI = "EI";
    let text = "";
    let intermitencia = false;
    
    Object.entries(this.scaleInfraesctrureForm.controls).forEach((element, key) => {
      if(element[1].value != null && element[1].value != undefined){
                
        switch (element[0]) {
          case "isPhotoSif":
            text += `||Foto Adjunta?:${element[1].value}`;
            break;
          case "isSmnetTestSif":
            text += `||Prueba SMNet?:${element[1].value}`;
            break;
          case "processSif":
            text += `||Proceso:${element[1].value}`;
            break;
          case "productSif":
            text += `||Producto:${element[1].value}`;
            break;
          case "subjectSif":
            if(element[1].value == "Intermitencia") {
              text += `||Motivo del Escalamiento:Niveles deficientes`;
              intermitencia = true;
            }else{
              text += `||Motivo del Escalamiento:${element[1].value}`;
            }
            break;
          case "taskSif":
            text += `||Pedido:${element[1].value}`;
            break;
          case "userIdentificationSif":
            text += `||Identificacion:${element[1].value}`;
            break;
          case "markTAPSif":
            text += `||Marcacion TAP:${element[1].value}`;
            break;
          case "addressTAPSif":
            text += `||Direccion TAP:${element[1].value}`;
            break;
          case "vTAPSif":
            text += `||Valor TAP:${element[1].value}`;
            break;
          case "macRealCPESif":
            text += `||Mac Real CPE:${element[1].value}`;
            break;
          case "isMarkInstalledSif":
            text += `||Marquilla?:${element[1].value}`;
            break;
          case "commentsSif":
            text += `||Observacion:${element[1].value}`;
            break;
          case "emailUsrSif":
            break;
          case "userIdSif":
            break;
          default:
            text += `||${element[0]}:${element[1].value}`;
            break;
        }
      }

    });
    if (intermitencia) {
      this.scaleInfraesctrureForm.controls.concatData.setValue(EI + text + "MTE:Intermitencia");
    } else {
      this.scaleInfraesctrureForm.controls.concatData.setValue(EI + text);
    }
    return false;
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
