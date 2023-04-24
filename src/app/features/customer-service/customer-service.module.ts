import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { CustomerServiceComponent } from './customer-service.component';


@NgModule({
  declarations: [
    CustomerServiceComponent
  ],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule
  ]
})
export class CustomerServiceModule { }
