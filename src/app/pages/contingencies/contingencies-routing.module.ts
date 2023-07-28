import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContingencyDetailsComponent } from './contingency-details/contingency-details.component';
import { ContingencyRequestComponent } from './contingency-request/contingency-request.component';

import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
  { path: 'contingency-details/:id', component: ContingencyDetailsComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
  { path: 'contingency-request', component: ContingencyRequestComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingenciesRoutingModule { }
