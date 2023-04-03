import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { QuicklinkModule } from 'ngx-quicklink';
import { PackagesComponent } from './packages.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PackagesComponent
  ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    ReactiveFormsModule,
    QuicklinkModule
  ]
})
export class PackagesModule { }
