import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncompleteDashboardComponent } from './incomplete-dashboard/incomplete-dashboard.component';

import { MaterialModule } from '../../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { IncompleteRoutingModule } from './incomplete-routing.module';

@NgModule({
  declarations: [
    IncompleteDashboardComponent
  ],
  imports: [
    CommonModule,
    IncompleteRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule
  ]
})
export class IncompleteModule { }
