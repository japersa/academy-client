import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNavbarComponent } from './course-navbar/course-navbar.component';
import { TopicCommentsComponent } from './topic-comments/topic-comments.component';

@NgModule({
  declarations: [
    CourseNavbarComponent,
    TopicCommentsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CourseNavbarComponent,
    TopicCommentsComponent
  ]
})
export class ComponentsModule { }
