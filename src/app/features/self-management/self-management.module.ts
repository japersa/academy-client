import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfManagementRoutingModule } from './self-management-routing.module';
import { SelfManagementComponent } from './self-management.component';


@NgModule({
  declarations: [
    SelfManagementComponent
  ],
  imports: [
    CommonModule,
    SelfManagementRoutingModule
  ]
})
export class SelfManagementModule { }
