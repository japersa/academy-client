import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutModule } from './admin/layouts/admin-layout/admin-layout.module';
import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminLayoutModule,
    AdminModule
  ], exports: [
    AdminLayoutModule,
    AdminModule
  ]
})
export class FeaturesModule { }
