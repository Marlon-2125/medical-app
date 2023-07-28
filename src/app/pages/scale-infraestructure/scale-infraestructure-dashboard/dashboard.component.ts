import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { InfraestructureService } from 'src/app/services/infraestructure.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { TranslateHelper } from 'src/app/utils/translate/helper';

export interface InfraestructureInterface {
}

@Component({
  selector: 'app-infraestructure-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class ScaleInfraestructureDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  loading: boolean = false;

  loadingData: boolean = true;

  userId: string = '';

  userIdentification: string = '';

  user: any = {
    names: "",
    surnames: ""
  };

  listStatus: string = 'Today';

  subscriptionInfraestructure: Subscription = new Subscription();
  subscriptionAllInfraestructure: Subscription = new Subscription();
  subscriptionCurrentUser: Subscription = new Subscription();

  paginatorIntl = new MatPaginatorIntl();

  displayedColumns = ['infraestructure_Status', 'task', 'dateCreated'];

  dataSourceX = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private _router: Router, private _infraestructureSvc: InfraestructureService, private _usersSvc: UsersService, private _translate: TranslateHelper) {
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('user_id') || '';
    this.userIdentification = sessionStorage.getItem('user_identification') || '';
    this.getInfraestructure();
    if(sessionStorage.getItem('user_names') && sessionStorage.getItem('user_surnames')){
      this.user.names = sessionStorage.getItem('user_names');
      this.user.surnames = sessionStorage.getItem('user_surnames');
    } else {
      this.sayHello(this.userId);
    }
  }

  ngOnDestroy(){
    this.subscriptionInfraestructure.unsubscribe();
    this.subscriptionCurrentUser.unsubscribe();
    if(this.listStatus == "All"){
      this.subscriptionAllInfraestructure.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSourceX = this._translate.translateTableMaterial(this.paginator);
    this.dataSourceX.sort = this.sort;
  }

  getInfraestructure() {
    this.loadingData = true;
    this.subscriptionInfraestructure = this._infraestructureSvc.getInfraestructure(this.userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            infraestructure_ID: data.payload.doc.id,
            process: data.payload.doc.data().process,
            infraestructure_Status: data.payload.doc.data().infraestructure_Status,
            dateCreated: data.payload.doc.data().dateCreated,
            comments: data.payload.doc.data().comments,
            subject: data.payload.doc.data().subject,
            task: data.payload.doc.data().task
          }));
      }))
      .subscribe(data => {
        this.loadingData = false;
        console.log(data);
        this.dataSourceX.data = data
      });
    
    if(this.listStatus == 'All'){
      this.subscriptionAllInfraestructure.unsubscribe();
    }

    this.listStatus = "Today";
  }

  getAllInfraestructure() {
    this.loadingData = true;
    this.subscriptionAllInfraestructure = this._infraestructureSvc.getAllInfraestructure(this.userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            infraestructure_ID: data.payload.doc.id,
            process: data.payload.doc.data().process,
            infraestructure_Status: data.payload.doc.data().infraestructure_Status,
            dateCreated: data.payload.doc.data().dateCreated,
            comments: data.payload.doc.data().comments,
            subject: data.payload.doc.data().subject,
            task: data.payload.doc.data().task
          }));
      }))
      .subscribe(data => {
        this.loadingData = false;
        this.dataSourceX.data = data
      });

    this.listStatus = "All";    
    this.subscriptionInfraestructure.unsubscribe();
  }

  sayHello(userId: string) {
    this.subscriptionCurrentUser = this._usersSvc.getCurrentUser(userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            names: data.payload.doc.data().names,
            surnames: data.payload.doc.data().surnames
          }));
      }))
      .subscribe( data => {
        this.user = data[0];
      });
  }

  onDevelopment(){
    Swal.fire({
      icon: 'info',
      title: 'Oops...',
      text: '¡Este módulo está en desarrollo!'
    })
  }

  viewDetails(infraestructure: any) {
    if (infraestructure.infraestructure_Status == "Pendiente") {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: '¡Esta solicitud aún no tiene respuesta!'
      })
    }
    else {
      this._router.navigate(['/scale-infraestructure/details', infraestructure.infraestructure_ID]);
    }
  }
  

}
