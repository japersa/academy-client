import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { SurveyComponent } from './survey/survey.component';


@NgModule({
  declarations: [TestComponent, SurveyComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    QuicklinkModule
  ]
})
export class TestModule { }
