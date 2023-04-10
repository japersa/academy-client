import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradingAreaComponent } from './trading-area.component';
import { CreatePackComponent } from './components/create-pack/create-pack.component';
import { MyPackagesComponent } from './components/my-packages/my-packages.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path: 'home', component: TradingAreaComponent },
  { path: 'create-pack', component: CreatePackComponent },
  { path: 'my-packages', component: MyPackagesComponent },
  { path: 'orders', component: OrdersComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingAreaRoutingModule { }
