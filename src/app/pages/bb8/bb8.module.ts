import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Bb8SearchComponent } from './bb8-search/bb8-search.component';
import { Bb8DetailsComponent } from './bb8-details/bb8-details.component';

import { MaterialModule } from '../../utils/material/material.module';
import { ReactiveFormsModule  } from '@angular/forms';
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { Bb8RoutingModule } from './bb8-routing.module';

@NgModule({
  declarations: [
    Bb8SearchComponent,
    Bb8DetailsComponent
  ],
  imports: [
    CommonModule,
    Bb8RoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LoadingBarModule
  ]
})
export class Bb8Module { }
