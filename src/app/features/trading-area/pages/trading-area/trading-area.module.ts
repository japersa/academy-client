import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { TradingAreaRoutingModule } from './trading-area-routing.module';
import { TradingAreaComponent } from './trading-area.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatePackComponent } from '../../components/create-pack/create-pack.component';


@NgModule({
  declarations: [
    TradingAreaComponent, 
    CreatePackComponent
  ],
  imports: [
    CommonModule,
    TradingAreaRoutingModule,
    ReactiveFormsModule,
    QuicklinkModule
  ]
})
export class TradingAreaModule { }
