import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncompleteDashboardComponent } from './incomplete-dashboard/incomplete-dashboard.component';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard'},
  { path: 'dashboard', component: IncompleteDashboardComponent, canActivate: [AuthenticationGuard], data: {role: "support"} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncompleteRoutingModule { }
