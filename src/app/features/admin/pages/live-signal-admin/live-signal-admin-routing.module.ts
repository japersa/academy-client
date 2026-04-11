import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveSignalAdminComponent } from './live-signal-admin.component';

const routes: Routes = [{ path: '', component: LiveSignalAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveSignalAdminRoutingModule {}
