import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCoursesRoutingModule } from './admin-courses-routing.module';
import { AdminCoursesComponent } from './admin-courses.component';
import { CreateCourseComponent } from '../../components/create-course/create-course.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CreateTopicsComponent } from '../../components/create-topics/create-topics.component';
import { CreateQuizComponent } from '../../components/create-quiz/create-quiz.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminCoursesComponent,
    CreateCourseComponent,
    CreateTopicsComponent,
    CreateQuizComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    AdminCoursesRoutingModule
  ], exports: [
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminCoursesModule { }
