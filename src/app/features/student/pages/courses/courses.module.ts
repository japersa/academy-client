import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';


@NgModule({
  declarations: [CoursesComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    ProgressbarModule.forRoot(),
    QuicklinkModule
  ]
})
export class CoursesModule { }
