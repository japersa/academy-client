import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfManagementComponent } from './self-management.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

const routes: Routes = [
  { path: 'home', component: SelfManagementComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'create-order', component: CreateOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfManagementRoutingModule { }
