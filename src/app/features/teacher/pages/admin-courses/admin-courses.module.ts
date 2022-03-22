import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCoursesRoutingModule } from './admin-courses-routing.module';
import { AdminCoursesComponent } from './admin-courses.component';
import { CreateCourseComponent } from '../../components/create-course/create-course.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CreateTopicsComponent } from '../../components/create-topics/create-topics.component';
import { CreateQuizComponent } from '../../components/create-quiz/create-quiz.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CreateModuleComponent } from '../../components/create-module/create-module.component';
import { EditCourseComponent } from '../../components/edit-course/edit-course.component';
import { EditModuleComponent } from '../../components/edit-module/edit-module.component';
import { EditTopicsComponent } from '../../components/edit-topics/edit-topics.component';
import { EditQuizComponent } from '../../components/edit-quiz/edit-quiz.component';


@NgModule({
  declarations: [
    AdminCoursesComponent,
    CreateCourseComponent,
    CreateTopicsComponent,
    CreateQuizComponent,
    CreateModuleComponent,
    EditCourseComponent,
    EditModuleComponent,
    EditTopicsComponent,
    EditQuizComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    AdminCoursesRoutingModule
  ], exports: [
    CreateCourseComponent,
    CreateTopicsComponent,
    CreateQuizComponent,
    CreateModuleComponent,
    EditCourseComponent,
    EditModuleComponent,
    EditTopicsComponent,
    EditQuizComponent
  ]
})
export class AdminCoursesModule { }
