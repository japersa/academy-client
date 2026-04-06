import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './billing.component';


@NgModule({
  declarations: [
    BillingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BillingRoutingModule
  ]
})
export class BillingModule { }
