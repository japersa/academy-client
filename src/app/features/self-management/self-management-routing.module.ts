import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelfManagementComponent } from './self-management.component';

const routes: Routes = [
  { path: 'home', component: SelfManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfManagementRoutingModule { }
