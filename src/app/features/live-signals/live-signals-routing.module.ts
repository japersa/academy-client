import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveSignalsComponent } from './live-signals.component';

const routes: Routes = [{ path: '', component: LiveSignalsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveSignalsRoutingModule {}
