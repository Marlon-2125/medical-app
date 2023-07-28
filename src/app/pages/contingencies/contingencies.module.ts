import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ContingencyDetailsComponent } from './contingency-details/contingency-details.component';
import { ContingencyRequestComponent } from './contingency-request/contingency-request.component';

import { MaterialModule } from '../../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { ContingenciesRoutingModule } from './contingencies-routing.module';
import { ContingenciesService } from 'src/app/services/contingencies.service';


@NgModule({
  declarations: [
    DashboardComponent,
    ContingencyDetailsComponent,
    ContingencyRequestComponent
  ],
  imports: [
    CommonModule,
    ContingenciesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule,
  ],
  providers: [ContingenciesService]
})
export class ContingenciesModule { }
