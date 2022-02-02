import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutModule } from './admin/layouts/admin-layout/admin-layout.module';
import { AdminCoursesModule } from './teacher/pages/admin-courses/admin-courses.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminLayoutModule,
    AdminCoursesModule
  ],
  exports: [
    AdminLayoutModule,
    AdminCoursesModule
  ]
})
export class FeaturesModule { }
