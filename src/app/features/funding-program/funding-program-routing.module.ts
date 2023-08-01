import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundingProgramComponent } from './funding-program.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { MyPackagesComponent } from './components/my-packages/my-packages.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { CreateDemoComponent } from './components/create-demo/create-demo.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProximamenteComponent } from './components/proximamente/proximamente.component';
import { MetricsComponent } from './components/metrics/metrics.component';

const routes: Routes = [
  { path: 'home', component: FundingProgramComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'create-demo', component: CreateDemoComponent },
  { path: 'my-packages', component: MyPackagesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'order/:id', component: OrderDetailComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'withdrawals', component: WithdrawalsComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'prox', component: ProximamenteComponent },
  { path: 'metrics', component: MetricsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingAreaRoutingModule { }
