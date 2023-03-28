import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyComponent } from './academy.component';


@NgModule({
  declarations: [
    AcademyComponent
  ],
  imports: [
    CommonModule,
    AcademyRoutingModule,
    QuicklinkModule
  ]
})
export class AcademyModule { }
