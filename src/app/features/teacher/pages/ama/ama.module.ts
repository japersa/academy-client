import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmaRoutingModule } from './ama-routing.module';
import { AmaComponent } from './ama.component';


@NgModule({
  declarations: [AmaComponent],
  imports: [
    CommonModule,
    AmaRoutingModule
  ]
})
export class AmaModule { }
