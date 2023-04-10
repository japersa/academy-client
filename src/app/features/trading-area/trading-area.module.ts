import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule } from 'ngx-quicklink';

import { TradingAreaRoutingModule } from './trading-area-routing.module';
import { TradingAreaComponent } from './trading-area.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePackComponent } from './components/create-pack/create-pack.component';
import { OrdersComponent } from './components/orders/orders.component';
import { MyPackagesComponent } from './components/my-packages/my-packages.component';


@NgModule({
  declarations: [
    TradingAreaComponent,
    CreatePackComponent,
    MyPackagesComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,
    ReactiveFormsModule,
    QuicklinkModule
  ]
})
export class TradingAreaModule { }
