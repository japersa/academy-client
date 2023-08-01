import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { SelfManagementComponent } from './self-management.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { GlobalWithdrawalsComponent } from './components/global-withdrawals/global-withdrawals.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProximamenteComponent } from '../funding-program/components/proximamente/proximamente.component';
import { WalletComponent } from './components/wallet/wallet.component';

const routes: Routes = [
  { path: 'home', component: SelfManagementComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'create-order', component: CreateOrderComponent }, 
  { path: 'order/:id', component: OrderDetailComponent },
  { path: 'global-withdrawals', component: GlobalWithdrawalsComponent },
  { path: 'withdrawals', component: WithdrawalsComponent },
  { path: 'prox', component: ProximamenteComponent },
  { path: 'wallet', component: WalletComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfManagementRoutingModule { }
