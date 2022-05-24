import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelComponent } from './cancel.component';

const routes: Routes = [{ path: '', component: CancelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelRoutingModule { }
