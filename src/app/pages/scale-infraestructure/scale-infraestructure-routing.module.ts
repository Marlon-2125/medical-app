import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScaleInfraestructureDashboardComponent } from './scale-infraestructure-dashboard/dashboard.component';
import { ScaleInfraestructureDetailsComponent } from './scale-infraestructure-details/scale-infraestructure-details.component';
import { ScaleInfraestructureRequestComponent } from './scale-infraestructure-request/scale-infraestructure-request.component';

import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard'},
  { path: 'dashboard', component: ScaleInfraestructureDashboardComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
  { path: 'details/:id', component: ScaleInfraestructureDetailsComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
  { path: 'request', component: ScaleInfraestructureRequestComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScaleInfraestructureRoutingModule { }
