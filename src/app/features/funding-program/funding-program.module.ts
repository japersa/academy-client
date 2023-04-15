import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule } from 'ngx-quicklink';

import { TradingAreaRoutingModule } from './funding-program-routing.module';
import { FundingProgramComponent } from './funding-program.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { MyPackagesComponent } from './components/my-packages/my-packages.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    FundingProgramComponent,
    CreateOrderComponent,
    MyPackagesComponent,
    OrdersComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,
    ReactiveFormsModule,
    StripeModule.forRoot(environment.stripePK),
    QuicklinkModule
  ]
})
export class FundingProgramModule { }
