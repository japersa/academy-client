import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCourseByStepsComponent } from './create-course-by-steps.component';

const routes: Routes = [{ path: '', component: CreateCourseByStepsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCourseByStepsRoutingModule { }
