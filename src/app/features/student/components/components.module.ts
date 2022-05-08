import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNavbarComponent } from './course-navbar/course-navbar.component';
import { TopicCommentsComponent } from './topic-comments/topic-comments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CourseNavbarComponent,
    TopicCommentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CourseNavbarComponent,
    TopicCommentsComponent
  ]
})
export class ComponentsModule { }
