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
import { ModalModule } from 'ngx-bootstrap/modal';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CreateDemoComponent } from './components/create-demo/create-demo.component';
import { SuccessPaymentComponent } from '../../shared/components/success-payment/success-payment.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProximamenteComponent } from './components/proximamente/proximamente.component';


@NgModule({
  declarations: [
    FundingProgramComponent,
    CreateOrderComponent,
    MyPackagesComponent,
    OrdersComponent,
    CheckoutComponent,
    WithdrawalsComponent,
    RankingComponent,
    CreateDemoComponent,
    SuccessPaymentComponent,
    OrderDetailComponent,
    ProximamenteComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,
    ReactiveFormsModule,
    StripeModule.forRoot(environment.stripePK),
    QuicklinkModule,
    ClipboardModule,
    ModalModule
  ]
})
export class FundingProgramModule { }
