import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslateHelper } from 'src/app/utils/translate/helper';

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
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  loading: boolean = false;

  loadingData: boolean = true;

  displayedColumns = ['names', 'region', 'phone'];
  
  dataSourceX = new MatTableDataSource();

  subscriptionUsers: Subscription = new Subscription();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private _router: Router, private _usersSvc: UsersService, private _translate: TranslateHelper) { }



  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void{
    this.subscriptionUsers.unsubscribe();
  }

  ngAfterViewInit() {     
    this.dataSourceX = this._translate.translateTableMaterial(this.paginator);
    this.dataSourceX.sort = this.sort;
  }

  getUsers() {
    this.subscriptionUsers = this._usersSvc.getUsers().pipe(
      map(actions => {
        return actions.map(
          (data:any) => ({
            id: data.payload.doc.id,
            paciente: data.payload.doc.data().paciente,
            signo: data.payload.doc.data().signo,
          }));
      }))
      .subscribe( (data) => {
        this.loadingData = false;
        this.dataSourceX.data = data;
      } 
    );    
  }

  onDeleteUser($event: any, user: any) {
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
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, no eliminar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._usersSvc.deleteUser(user);
        swalWithBootstrapButtons.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El usuario esta a salvo :)',
          'error'
        )
      }
    })
  }

  applyFilter(filterValue: any) {
    this.dataSourceX.filter = filterValue.target.value.trim().toLowerCase();
  }

  exportCsv() {
    var data = this.dataSourceX.data;
    var array = typeof data != 'object' ? JSON.parse(data) : data;
    var str = '';
    var column = 'ID, Nombre Completo, Correo, Telefono, Identificación, Login, Area, Region, Provisioner \r\n';
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
    elementToClick.download = "Usuario-Matriculados-" + fullDateCsv + ".csv";
    elementToClick.click();  
  }

}
