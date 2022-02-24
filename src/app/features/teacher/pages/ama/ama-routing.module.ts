import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AmaComponent } from './ama.component';

const routes: Routes = [{ path: '', component: AmaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmaRoutingModule { }
