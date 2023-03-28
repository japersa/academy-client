import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { CancelRoutingModule } from './cancel-routing.module';
import { CancelComponent } from './cancel.component';


@NgModule({
  declarations: [CancelComponent],
  imports: [
    CommonModule,
    CancelRoutingModule,
    QuicklinkModule
  ]
})
export class CancelModule { }
