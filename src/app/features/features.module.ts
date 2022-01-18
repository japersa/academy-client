import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutModule } from './admin/layouts/admin-layout/admin-layout.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminLayoutModule
  ], exports: [
    AdminLayoutModule
  ]
})
export class FeaturesModule { }
