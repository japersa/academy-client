import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminCoursesComponent } from './admin-courses.component';

const routes: Routes = [{ path: '', component: AdminCoursesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCoursesRoutingModule { }
