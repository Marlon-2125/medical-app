import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScaleInfraestructureDashboardComponent } from './scale-infraestructure-dashboard/dashboard.component';
import { ScaleInfraestructureDetailsComponent } from './scale-infraestructure-details/scale-infraestructure-details.component';
import { ScaleInfraestructureRequestComponent } from './scale-infraestructure-request/scale-infraestructure-request.component';

import { MaterialModule } from '../../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { ScaleInfraestructureRoutingModule } from './scale-infraestructure-routing.module';
import { InfraestructureService } from 'src/app/services/infraestructure.service';


@NgModule({
  declarations: [
    ScaleInfraestructureDashboardComponent,
    ScaleInfraestructureDetailsComponent,
    ScaleInfraestructureRequestComponent
  ],
  imports: [
    CommonModule,
    ScaleInfraestructureRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule
  ],
  providers: [InfraestructureService]
})
export class ScaleInfrastructureModule { }
