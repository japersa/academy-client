import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';


@NgModule({
  declarations: [PricingComponent],
  imports: [
    CommonModule,
    PricingRoutingModule,
    ProgressbarModule,
    QuicklinkModule
  ]
})
export class PricingModule { }
