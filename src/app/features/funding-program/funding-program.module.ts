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
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { RankingComponent } from './components/ranking/ranking.component';

import {ClipboardModule} from '@angular/cdk/clipboard';


@NgModule({
  declarations: [
    FundingProgramComponent,
    CreateOrderComponent,
    MyPackagesComponent,
    OrdersComponent,
    CheckoutComponent,
    WithdrawalsComponent,
    RankingComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,
    ReactiveFormsModule,
    StripeModule.forRoot(environment.stripePK),
    QuicklinkModule,
    ClipboardModule
  ]
})
export class FundingProgramModule { }
