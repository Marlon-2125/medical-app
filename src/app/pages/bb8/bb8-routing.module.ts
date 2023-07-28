import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Bb8DetailsComponent } from './bb8-details/bb8-details.component';
import { Bb8SearchComponent } from './bb8-search/bb8-search.component';
import { AuthenticationGuard } from 'src/app/guard/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'bb8-search'},
  { path: 'bb8-search', component: Bb8SearchComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
  { path: 'bb8-details', component: Bb8DetailsComponent, canActivate: [AuthenticationGuard], data: {role: "repairman"} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Bb8RoutingModule { }
