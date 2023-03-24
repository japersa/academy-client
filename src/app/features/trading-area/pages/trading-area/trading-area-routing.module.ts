import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradingAreaComponent } from './trading-area.component';

const routes: Routes = [{ path: '', component: TradingAreaComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingAreaRoutingModule { }
