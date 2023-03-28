import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription.component';


@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    QuicklinkModule
  ]
})
export class SubscriptionModule { }
