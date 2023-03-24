import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingAreaRoutingModule } from './trading-area-routing.module';
import { TradingAreaComponent } from './trading-area.component';

@NgModule({
  declarations: [
    TradingAreaComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,

  ]
})
export class TradingAreaModule { }
