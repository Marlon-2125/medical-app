import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ContingenciesService } from 'src/app/services/contingencies.service';
import { Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-contingency-request',
  templateUrl: './contingency-request.component.html',
  styleUrls: ['./contingency-request.component.css']
})

export class ContingencyRequestComponent implements OnInit {

  loading: boolean = false;

  selectable = true;
  removable = true;
  addOnBlur = true;
  barcodeValue1!: string;
  barcodeValue2!: string;
  barcodeField!: string;
  isBarcodeScanner1 = false;
  isBarcodeScanner2 = false;
  isValueScanned = false;

  allowedFormats = [BarcodeFormat.EAN_13, BarcodeFormat.CODE_128];

  regexValidationTask = /^[\-0-9]+$/;
  regexValidationMac = /^[a-zA-Z0-9_]*$/;

  requestForm = new FormGroup({
    taskCty: new FormControl('', Validators.pattern(this.regexValidationTask)),
    typeCty: new FormControl(),
    detailsCty: new FormControl(),
    macInCty: new FormControl(),
    macOutCty: new FormControl(),
    userIdCty: new FormControl(),
    productCty: new FormControl(),
    emailUsrCty: new FormControl(),
    userIdentificationCty: new FormControl()
  });
  // Esto viene desde la BD
  itemsTypeCty = [
    { name: 'Contingencia', value: 'Contingencia' },
    { name: 'Refresh', value: 'Refresh' },
    { name: 'Cambio de Equipo', value: 'Cambio de Equipo' }
  ];
  // Esto viene desde la BD
  itemsProductCty = [
    { name: 'TV', value: 'TV' },
    { name: 'Internet', value: 'Internet' },
    { name: 'ToIP', value: 'ToIP' },
    { name: 'Internet+ToIP', value: 'Internet+ToIP' }
  ];

  separatorKeysCodes = [ENTER, COMMA] as const;

  macOn: any[] = [];

  macOut: any[] = [];


  constructor(private _contingenciesSvc: ContingenciesService, private _router: Router, private _loadingBarService: LoadingBarService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('user_id') || '';
    const userEmail = sessionStorage.getItem('user_email') || '';
    const userIdentification = sessionStorage.getItem('user_identification') || '';
    this.fillRequestForm(userId, userEmail, userIdentification);
  }


  onSubmit() {
    this.startBarCharge();
    this.fillChipsInputs(this.macOn, this.macOut);
    this.requestForm.controls.userIdentificationCty.enable();
    this.requestForm.controls.emailUsrCty.enable();
    if (this.requestForm.controls.typeCty.value == 'Cambio de Equipo' || (this.requestForm.controls.productCty.value == 'TV' && this.requestForm.controls.typeCty.value == 'Refresh')) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Esta solicitud debes tramitarla con tu despachador',
        showConfirmButton: false,
        timer: 1500
      });
      this.requestForm.controls.macInCty.reset();
      this.requestForm.controls.macOutCty.reset();
      this.completeBarCharge();
    } else {
      if (this.requestForm.invalid == false) {

        this._contingenciesSvc.createContingency(this.requestForm.value).then(data => data.json())
          .then((response) => {
            this.requestForm.controls.userIdentificationCty.disable();
            this.requestForm.controls.emailUsrCty.disable();
            if (response.status == 200) {
              console.log(response);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Contingencia Creada',
                showConfirmButton: false,
                timer: 1500
              });
              this._router.navigate(['/contingencies/dashboard']);
            }
            else {
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.message.code || response.message,
                showConfirmButton: false,
                timer: 1500
              });
              this.loading = false;
            }
            this.requestForm.controls.macInCty.reset();
            this.requestForm.controls.macOutCty.reset();
            this.completeBarCharge();
          })
          .catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err,
              showConfirmButton: false,
              timer: 1500
            });
            this.requestForm.controls.macInCty.reset();
            this.requestForm.controls.macOutCty.reset();
            this.completeBarCharge();
          });
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: "Verifique completamente el formulario",
          showConfirmButton: false,
          timer: 1500
        });
        this.completeBarCharge();
      }
    }


  }

  fillRequestForm(userId: string, userEmail: string, userIdentification: string) {
    this.requestForm.controls.userIdCty.setValue(userId);
    this.requestForm.controls.userIdentificationCty.setValue(userIdentification);
    this.requestForm.controls.emailUsrCty.setValue(userEmail);
    this.requestForm.controls.userIdentificationCty.disable();
    this.requestForm.controls.emailUsrCty.disable();
  }

  fillChipsInputs(chip1: any, chip2: any) {
    this.requestForm.controls.macInCty.setValue(chip1);
    this.requestForm.controls.macOutCty.setValue(chip2);
  }

  filterProducts(event: any) {
    const productCtyValue = this.requestForm.controls.productCty.value;
    if (productCtyValue == 'Internet') {
      this.itemsTypeCty = [
        { name: 'Contingencia', value: 'Contingencia' },
        { name: 'Cambio de Equipo', value: 'Cambio de Equipo' }
      ];
    }
    else if (productCtyValue == 'Internet+ToIP' || productCtyValue == 'ToIP') {
      this.itemsTypeCty = [
        { name: 'Contingencia', value: 'Contingencia' },
        { name: 'Registros ToIP', value: 'Registros ToIP' },
        { name: 'Cambio de Equipo', value: 'Cambio de Equipo' }
      ];
    }
    else {
      // Esto viene desde la BD
      this.itemsTypeCty = [
        { name: 'Contingencia', value: 'Contingencia' },
        { name: 'Refresh', value: 'Refresh' },
        { name: 'Cambio de Equipo', value: 'Cambio de Equipo' }
      ];
    }
  }

  onBarcodeScan(field: string) {
    if (field == 'macIn') {
      this.barcodeField = 'macIn';
      this.requestForm.controls.macInCty.disable();
      this.isBarcodeScanner1 = true;
    }
    else if (field == 'macOut') {
      this.barcodeField = 'macOut';
      this.requestForm.controls.macOutCty.disable();
      this.isBarcodeScanner2 = true;
    }

    this.isValueScanned == false;
  }

  onCloseScanner() {
    this.isBarcodeScanner1 = false;
    this.isBarcodeScanner2 = false;
    this.requestForm.controls.macInCty.enable();
    this.requestForm.controls.macOutCty.enable();
    this.isValueScanned == false;
  }

  onValueScannerChanges() {
    setTimeout(() => {
      this.requestForm.controls.macInCty.enable();
      this.requestForm.controls.macOutCty.enable();
    }, 1000);

    console.log("Valor obtenido" + this.barcodeValue1);

    if (this.isValueScanned == false) {
      if (this.barcodeField == 'macIn') {
        this.macOn.push({ name: this.barcodeValue1 });
      } else if (this.barcodeField == 'macOut') {
        this.macOut.push({ name: this.barcodeValue2 });
      }
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Por favor verifique el Mac escaneado',
        showConfirmButton: false,
        timer: 1500
      });
      this.isValueScanned = true;
      this.isBarcodeScanner1 = false;
      this.isBarcodeScanner2 = false;
    }

  }

  onScannerError() {
    console.error(this.barcodeValue1);
    console.error(this.barcodeValue2);
  }

  addMacOn(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();
    if (value) {
      if (this.regexValidationMac.test(value)) {
        this.macOn.push({ name: value });
      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Recuerda que los campos de mac entra y mac sale deben ser alfanuméricos y sin espacios.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
    event.chipInput!.clear();
  }

  addMacOut(event2: MatChipInputEvent): void {
    let value = (event2.value || '').trim();
    if (value) {
      if (this.regexValidationMac.test(value)) {
        this.macOut.push({ name: value });
      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Recuerda que los campos de mac entra y mac sale deben ser alfanuméricos y sin espacios.',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
    event2.chipInput!.clear();
  }

  removeMacOn(macOn: any): void {
    let index = this.macOn.indexOf(macOn);
    if (index >= 0) {
      this.macOn.splice(index, 1);
    }
  }

  removeMacOut(macOut: any): void {
    let index = this.macOut.indexOf(macOut);
    if (index >= 0) {
      this.macOut.splice(index, 1);
    }
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
