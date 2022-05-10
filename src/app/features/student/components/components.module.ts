import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicCommentsComponent } from './topic-comments/topic-comments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TopicCommentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    TopicCommentsComponent
  ]
})
export class ComponentsModule { }
