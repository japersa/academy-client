import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { SuccessRoutingModule } from './success-routing.module';
import { SuccessComponent } from './success.component';


@NgModule({
  declarations: [SuccessComponent],
  imports: [
    CommonModule,
    SuccessRoutingModule,
    QuicklinkModule
  ]
})
export class SuccessModule { }
