import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradingAreaComponent } from './trading-area.component';
import { CreatePackComponent } from '../../components/create-pack/create-pack.component';
import { MyPackagesComponent } from '../../components/my-packages/my-packages.component';

const routes: Routes = [
  { path: '', component: TradingAreaComponent },
  { path: 'create-pack', component: CreatePackComponent },
  { path: 'my-packages', component: MyPackagesComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingAreaRoutingModule { }
