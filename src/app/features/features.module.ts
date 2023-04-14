import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutModule } from './admin/layouts/admin-layout/admin-layout.module';
import { AdminCoursesModule } from './teacher/pages/admin-courses/admin-courses.module';
import { CreateCourseByStepsModule } from './teacher/pages/create-course-by-steps/create-course-by-steps.module';
import { TradingAreaModule } from './trading-area/trading-area.module';

import { QuicklinkModule } from 'ngx-quicklink';
import { SelfManagementModule } from './self-management/self-management.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminLayoutModule,
    AdminCoursesModule,
    CreateCourseByStepsModule,
    TradingAreaModule,
    QuicklinkModule,
    SelfManagementModule
  ],
  exports: [
    AdminLayoutModule,
    AdminCoursesModule,
    CreateCourseByStepsModule,
    TradingAreaModule,
    SelfManagementModule
  ]
})
export class FeaturesModule { }
