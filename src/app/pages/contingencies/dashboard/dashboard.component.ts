import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ContingenciesService } from 'src/app/services/contingencies.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { TranslateHelper } from 'src/app/utils/translate/helper';

export interface ContingencyInterface {
  contingency_ID?: string,
  user_ID: string;
  contingency_Type: string;
  contingency_State: string;
  contingency_Date: Date;
  answer: string;
  details: string;
  reference: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  loading: boolean = false;

  loadingData: boolean = true;

  userId: string = '';

  user: any = {
    names: "",
    surnames: ""
  };

  listStatus: string = 'Today';

  subscriptionContingencies: Subscription = new Subscription();
  subscriptionAllContingencies: Subscription = new Subscription();
  subscriptionCurrentUser: Subscription = new Subscription();

  paginatorIntl = new MatPaginatorIntl();

  displayedColumns = ['contingency_State', 'reference', 'contingency_Date'];

  dataSourceX = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(private _router: Router, private _contingeciesSvc: ContingenciesService, private _usersSvc: UsersService, private _translate: TranslateHelper) {
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('user_id') || '';
    this.getContingencies();
    if(sessionStorage.getItem('user_names') && sessionStorage.getItem('user_surnames')){
      this.user.names = sessionStorage.getItem('user_names');
      this.user.surnames = sessionStorage.getItem('user_surnames');
    } else {
      this.sayHello(this.userId);
    }
  }

  ngOnDestroy(){
    this.subscriptionContingencies.unsubscribe();
    this.subscriptionCurrentUser.unsubscribe();
    if(this.listStatus == "All"){
      this.subscriptionAllContingencies.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSourceX = this._translate.translateTableMaterial(this.paginator);
    this.dataSourceX.sort = this.sort;
  }

  getContingencies() {
    this.loadingData = true;
    this.subscriptionContingencies = this._contingeciesSvc.getContingencies(this.userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            contingency_ID: data.payload.doc.id,
            contingency_Type: data.payload.doc.data().contingencies_Type,
            contingency_State: data.payload.doc.data().contingencies_State,
            contingency_Date: data.payload.doc.data().contingencies_Date,
            answer: data.payload.doc.data().answer,
            details: data.payload.doc.data().details,
            reference: data.payload.doc.data().references
          }));
      }))
      .subscribe(data => {
        this.loadingData = false;
        this.dataSourceX.data = data
      });
    
    if(this.listStatus == 'All'){
      this.subscriptionAllContingencies.unsubscribe();
    }

    this.listStatus = "Today";
  }

  getAllContingencies() {
    this.loadingData = true;
    this.subscriptionAllContingencies = this._contingeciesSvc.getAllContingencies(this.userId).pipe(
      map(actions => {
        return actions.map(
          (data: any) => ({
            contingency_ID: data.payload.doc.id,
            contingency_Type: data.payload.doc.data().contingencies_Type,
            contingency_State: data.payload.doc.data().contingencies_State,
            contingency_Date: data.payload.doc.data().contingencies_Date,
            answer: data.payload.doc.data().answer,
            details: data.payload.doc.data().details,
            reference: data.payload.doc.data().references
          }));
      }))
      .subscribe(data => {
        this.loadingData = false;
        this.dataSourceX.data = data
      });

    this.listStatus = "All";    
    this.subscriptionContingencies.unsubscribe();
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

  viewDetails(contingency: any) {
    if (contingency.contingency_State == "Pendiente") {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: '¡Esta solicitud aún no tiene respuesta!'
      })
    }
    else {
      this._router.navigate(['/contingencies/contingency-details', contingency.contingency_ID]);
    }
  }

}
