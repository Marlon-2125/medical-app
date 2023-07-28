import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import municipalities from 'src/assets/json/colombia.min.json';
import { QueueService } from 'src/app/services/queue.service';
import Swal from 'sweetalert2';
import { TranslateHelper } from 'src/app/utils/translate/helper';

export interface StateGroup {
  departamento: string;
  ciudades: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-bb8-search',
  templateUrl: './bb8-search.component.html',
  styleUrls: ['./bb8-search.component.css']
})

export class Bb8SearchComponent implements OnInit {

  loading: boolean = false;

  loadingData: boolean = true;

  displayedColumns = ['CLIENTE', 'DIRECCION', 'GIS'];

  stateGroups: StateGroup[] = municipalities;

  subscriptionQueue: Subscription = new Subscription();

  dataResponse: any;

  userId: any;

  dataSource = [];
 
  dataSourceX: any;

  @ViewChild('paginator') paginator: MatPaginator | undefined;

  bb8SearchForm = new FormGroup ({
    citySf: new FormControl(),
    addressSf: new FormControl()
  });

  stateGroupOptions!: Observable<any[]>;

  constructor(private _router:Router, private _queueService: QueueService, private _translate: TranslateHelper) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem("user_id");
    this.stateGroupOptions = this.bb8SearchForm.get('citySf')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );

    this.dataResponse = {
      request_id: '',
      code: 0,
      message: '',
      data: '',
      response: '',
      status: '',
      title: ''
    };
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.stateGroups
        .map(group => ({departmento: group.departamento, ciudades: _filter(group.ciudades, value)}))
        .filter(group => group.ciudades.length > 0);
    }

    return this.stateGroups;
  }
  
  ngAfterViewInit(){
    if(this.paginator){
      this.dataSourceX = this._translate.translateTableMaterial(this.paginator);
    }
  }

  viewDetails(){
    this._router.navigate(['/bb8/bb8-details']);
  }

  onSubmit(){
    this.clearData();
    this.loadingData = true;
    this.loading = true;
    if(this.bb8SearchForm.controls.citySf.value.length > 0 && this.bb8SearchForm.controls.addressSf.value.length > 0){
      let dataToQueue = {
        ciudad: this.clearAccent(this.bb8SearchForm.controls.citySf.value),
        direccion:  this.clearAccent(this.bb8SearchForm.controls.addressSf.value)
      }
      this._queueService.createQueueItem([dataToQueue], "BB8", this.userId)
        .then((res) => {
          return res.json()
        })
        .then((response) => {
          if(response.code == 200){
            this.subscriptionQueue = this._queueService.getLastQueueItem("BB8", this.userId).pipe(
              map(actions => {
                return actions.map(
                  (data:any) => ({
                    request_id: data.payload.doc.id,
                    status: data.payload.doc.data().status
                  }));
              }))
            .subscribe((res:any) => {
              console.log("Estoy cambiando..");
              if(res[0].status == 'Finalizado'){
                this._queueService.getResponseQueueByItem(res[0].request_id)
                  .then((res) => {
                    return res.json()
                  })
                  .then((response) => {                    
                    this.dataResponse.code = response.data[0].code;
                    this.dataResponse.request_id = response.data[0].request_id;
                    this.dataResponse.message = response.data[0].message;
                    this.dataResponse.data = response.data[0].data;                    
                    
                    if(response.data[0].code == 200){
                      this.dataResponse.status = 'check';
                      this.dataResponse.title = 'Solicitud Finalizada';
                      this.dataResponse.response = 'Registros en base de datos obtenidos...';
                      this.dataSourceX = this.dataResponse.data;
                    } else if(response.data[0].code == 500){
                      this.dataResponse.status = 'warning';
                      this.dataResponse.title = 'El servidor está experimentando alto flujo de datos reintenta en unos minutos';
                      this.dataResponse.response = this.dataResponse.message;
                    } else {
                      this.dataResponse.status = 'warning';
                      this.dataResponse.title = 'La solicitud tuvo respuesta vacía';
                      this.dataResponse.response = this.dataResponse.message;
                    }
                    console.log("RESPUESTA");
                    console.log(response);
                    console.log("RESPUESTA MAPEADA");
                    console.log(this.dataResponse);
                    this.subscriptionQueue.unsubscribe();
                    this.loadingData = false;
                    this.loading = false;
                  })
                  .catch((err) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: '¡Ha ocurrido un error en la respuesta, porfavor recargue la aplicación!' + err.toString()
                    })
                  });
                
              }
            });          
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Oops...',
              text: response.message
            })
            this.loadingData = false;
            this.loading = false;
          }        
        })
        .catch((err) => {
          Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: err
          })
          this.loadingData = false;
          this.loading = false;
        });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: '¡Por favor ingresa el campo tarea!'
      })
      this.loadingData = false;
      this.loading = false;
    }
  }

  clearData() {
    this.dataResponse.code = 0;
    this.dataResponse.request_id = '';
    this.dataResponse.message = '';
    this.dataResponse.data = '';
    this.dataResponse.status = '';
    this.dataResponse.title = '';
    this.dataResponse.response = '';
    this.subscriptionQueue.unsubscribe();
  }

  clearAccent(string:string){
    const accent:any = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
    return string.split('').map( letra => accent[letra] || letra).join('').toString();	
  }

}

