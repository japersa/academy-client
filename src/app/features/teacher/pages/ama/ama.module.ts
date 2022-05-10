import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmaRoutingModule } from './ama-routing.module';
import { AmaComponent } from './ama.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AmaComponent],
  imports: [
    CommonModule,
    AmaRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AmaModule { }
