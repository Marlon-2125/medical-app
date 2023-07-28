import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TranslateHelper } from 'src/app/utils/translate/helper';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface UserInterface {
  user_ID?: string;
  auth_ID: string;
  names: string;
  surnames: string;
  email: string;
  phone: string;
  profile_ID: string;
  state: string;
  type_ID: string;
  location: string;
}

@Component({
  selector: 'app-access-request',
  templateUrl: './access-request.component.html',
  styleUrls: ['./access-request.component.css']
})
export class AccessRequestComponent implements OnInit, AfterViewInit, OnDestroy {

  loading: boolean = false;

  loadingData: boolean = true;

  displayedColumns = ['status', 'identification', 'comments', 'options'];
  
  dataSourceX = new MatTableDataSource();

  subscriptionRequests: Subscription = new Subscription();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private _usersSvc: UsersService, private _translate: TranslateHelper) { }



  ngOnInit(): void {
    this.getRequests();
  }

  ngOnDestroy(): void {
    this.subscriptionRequests.unsubscribe();
  }

  ngAfterViewInit() {     
    this.dataSourceX = this._translate.translateTableMaterial(this.paginator);
    this.dataSourceX.sort = this.sort;
  }

  getRequests() {
    this.subscriptionRequests = this._usersSvc.getAccessRequests().pipe(
      map(actions => {
        return actions.map(
          (data:any) => ({
            requestId: data.payload.doc.id,
            identification: data.payload.doc.data().identification,
            comments: data.payload.doc.data().comments,
            status: data.payload.doc.data().status
          }));
      }))
      .subscribe( (data) => {
        this.loadingData = false;
        this.dataSourceX.data = data;
      } 
    );    
  }

  onApproveRequest(requestId: any) {
    this._usersSvc.approveRequest(requestId).then((res) => {
      Swal.fire(
        '!Solicitud Aprobada!',
        'La solicitud pasará al estado de aprobada.',
        'success'
      )
    }).catch( (err) => {
      Swal.fire(
        '!Fallo!',
        'Ha ocurrido un error en el API.',
        'error'
      ) 
    });
  }

  async onResetCredentials(engineerIdentification: any, requestId: any){
    try {
      const engineerRequest = await this._usersSvc.getClickEngineerById(engineerIdentification);
      const engineerData = await engineerRequest.json();
      console.log(engineerData);
      if(engineerData.length > 0){
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: true
        })
    
        swalWithBootstrapButtons.fire({
          title: '¿Estás segur@?',
          text: "¡No podrás revertir este cambio!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, restablecer',
          cancelButtonText: 'No, cancelar acción',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this._usersSvc.resetCredentials(engineerData, requestId).then((res) => {              
              if(res.status == 200){
                return res.json();
              }
              else{
                console.log("error");
                throw new Error("Error");
              }
            })
            .then( (res) =>{
              Swal.fire(
                '!Restablecido!',
                'Las credenciales del usuario se han restablecido.',
                'success'
              )
            })
            .catch( (err) => {
              Swal.fire(
                '!Fallo!',
                'Hubo un fallo al conectar el servicio',
                'error'
              )
            });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire(
              'Cancelado',
              'El usuario esta a salvo :)',
              'error'
            )
          }
        });
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: '¡El usuario seleccionado no fue encontrado en click!'
        })
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Ocurrio un error compruebe si está conectad@ a la VPN!'
      })
    }
  }

  async onCreateUserByRequest(engineerIdentification: any, requestId: any){
    try {
      const engineerRequest = await this._usersSvc.getClickEngineerById(engineerIdentification);
      const engineerData = await engineerRequest.json();
      console.log(engineerData);

      if(engineerData.length > 0){
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: true
        })
    
        swalWithBootstrapButtons.fire({
          title: 'Aprobar Usuario',
          text: "¡Al aprobar el usuario la plataforma le generará unas credenciales genéricas con el usuario y datos de click!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, aprobar usuario',
          cancelButtonText: 'No, cancelar acción',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this._usersSvc.createUserByRequest(engineerData, requestId).then((res) => {              
              if(res.status == 201){
                Swal.fire(
                  '¡Usuario Creado!',
                  'Las credenciales del usuario serán genéricas y su login será el mismo de click.',
                  'success'
                )
              }else{
                if(res.status == 404){
                  Swal.fire(
                    '¡Error al crear!',
                    'El usuario que intenta crear ya existe.',
                    'warning'
                  )
                }
                else{
                  console.log("error");
                  throw new Error("Error");                
                }
              }
            })            
            .catch( (err) => {
              Swal.fire(
                '¡Fallo!',
                'Hubo un fallo al conectar el servicio',
                'error'
              )
            });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire(
              'Cancelado',
              'El usuario no ha sido aprobado aún',
              'error'
            )
          }
        });
      }
      else{
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: '¡El usuario seleccionado no fue encontrado en click!'
        })
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Ocurrio un error compruebe si está conectad@ a la VPN!'
      })
    }
  }

  async onCreateAllUsersByRequest(){
    try {
      // const engineerRequest = await this._usersSvc.getClickEngineerByIds();
      // const engineerData = await engineerRequest.json();
      console.log();

      if(true){
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: true
        })
    
        swalWithBootstrapButtons.fire({
          title: 'Aprobación masiva de usuarios',
          text: "¡Al aprobar masivamente los usuarios la plataforma les generará unas credenciales genéricas con los usuarios y datos de click!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, aprovar masivamente',
          cancelButtonText: 'No, cancelar acción',
          reverseButtons: true,
          footer: "Recuerde que solo las solicitudes con el motivo Debo Acceder por Primera Vez serán aptas para esta opción"
        }).then((result) => {
          if (result.isConfirmed) {
            this._usersSvc.resetCredentials("","").then((res) => {              
              if(res.status == 200){
                return res.json();
              }
              else{
                console.log("error");
                throw new Error("Error");
              }
            })
            .then( (res) =>{
              Swal.fire(
                '!Restablecido!',
                'Las credenciales del usuario se han restablecido.',
                'success'
              )
            })
            .catch( (err) => {
              Swal.fire(
                '!Fallo!',
                'Hubo un fallo al conectar el servicio',
                'error'
              )
            });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            Swal.fire(
              'Cancelado',
              'El usuario no ha sido aprobado aún',
              'error'
            )
          }
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '¡Ocurrio un error compruebe si está conectad@ a la VPN!'
      })
    }
  }

  onCheckUserExist(engineerIdentification: any){
    this.loading = true;
    this._usersSvc.checkUserExist(engineerIdentification).then((res) => {
      if(res.status == 200 || res.status == 404){
        return res.json();
      }
      else{
        throw new Error("Error");
      }
    })
    .then( (res) => {
      console.log(res);
      Swal.fire({
        icon: 'info',
        title: 'Revisión de Usuario',
        text: res.message
      });
      this.loading = false;
    })
    .catch( (err) => {
      console.log(err);
      Swal.fire({
        icon: 'info',
        title: 'Revisión de Usuario',
        text: 'Problemas con el API'
      });
      this.loading = false;
    });
   
  }

  applyFilter(filterValue: any) {
    this.dataSourceX.filter = filterValue.target.value.trim().toLowerCase();
  }

  exportCsv() {
    var data = this.dataSourceX.data;
    var array = typeof data != 'object' ? JSON.parse(data) : data;
    var str = '';
    var column = 'ID, Identificacion, Motivo \r\n';
    str += column;
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }

        str += line + '\r\n';
    }
    var dateCsv = new Date();
    var yearCsv = dateCsv.getFullYear();
    var monthCsv = (dateCsv.getMonth() + 1 <= 9) ? '0' + (dateCsv.getMonth() + 1) : (dateCsv.getMonth() + 1);
    var dayCsv = (dateCsv.getDate() <= 9) ? '0' + dateCsv.getDate() : dateCsv.getDate();
    var fullDateCsv = yearCsv + "-" + monthCsv + "-" + dayCsv;


    var blob = new Blob(["\ufeff" + str], {type: 'type: "text/csv;charset=UTF-8"'});
    var elementToClick = window.document.createElement("a");
    elementToClick.href = window.URL.createObjectURL(blob);
    elementToClick.download = "Solicitudes-Acceso-" + fullDateCsv + ".csv";
    elementToClick.click();  
  }

}
