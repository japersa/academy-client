import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradingAreaComponent } from './trading-area.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { MyPackagesComponent } from './components/my-packages/my-packages.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  { path: 'home', component: TradingAreaComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'my-packages', component: MyPackagesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingAreaRoutingModule { }
