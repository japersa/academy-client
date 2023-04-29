import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutModule } from './admin/layouts/admin-layout/admin-layout.module';
import { AdminCoursesModule } from './teacher/pages/admin-courses/admin-courses.module';
import { CreateCourseByStepsModule } from './teacher/pages/create-course-by-steps/create-course-by-steps.module';
import { FundingProgramModule } from './funding-program/funding-program.module';

import { QuicklinkModule } from 'ngx-quicklink';
import { SelfManagementModule } from './self-management/self-management.module';
import { BillingModule } from './billing/billing.module';

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    AdminLayoutModule,
    AdminCoursesModule,
    CreateCourseByStepsModule,
    FundingProgramModule,
    QuicklinkModule,
    SelfManagementModule,
    BillingModule
  ],
  exports: [
    AdminLayoutModule,
    AdminCoursesModule,
    CreateCourseByStepsModule,
    FundingProgramModule,
    SelfManagementModule
  ]
})
export class FeaturesModule { }
