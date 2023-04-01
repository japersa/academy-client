import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagesRoutingModule } from './packages-routing.module';
import { QuicklinkModule } from 'ngx-quicklink';
import { PackagesComponent } from './packages.component';


@NgModule({
  declarations: [
    PackagesComponent
  ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    QuicklinkModule
  ]
})
export class PackagesModule { }
