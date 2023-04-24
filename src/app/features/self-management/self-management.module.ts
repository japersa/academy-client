import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfManagementRoutingModule } from './self-management-routing.module';
import { SelfManagementComponent } from './self-management.component';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { GlobalWithdrawalsComponent } from './components/global-withdrawals/global-withdrawals.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';


@NgModule({
  declarations: [
    SelfManagementComponent,
    OrdersComponent,
    CheckoutComponent,
    CreateOrderComponent,
    GlobalWithdrawalsComponent,
    WithdrawalsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StripeModule.forRoot(environment.stripePK),
    SelfManagementRoutingModule,
    ClipboardModule
  ]
})
export class SelfManagementModule { }
