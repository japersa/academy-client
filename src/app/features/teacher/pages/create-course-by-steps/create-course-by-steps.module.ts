import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { CreateCourseByStepsRoutingModule } from './create-course-by-steps-routing.module';
import { CreateCourseByStepsComponent } from './create-course-by-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AdminCoursesModule } from '../admin-courses/admin-courses.module';


@NgModule({
  declarations: [
    CreateCourseByStepsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule,
    AngularMultiSelectModule,
    CreateCourseByStepsRoutingModule,
    QuicklinkModule
  ]
})
export class CreateCourseByStepsModule { }
