import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    QuicklinkModule,
    HttpClientModule,
    ClipboardModule
  ],
  exports: [
  ]
})
export class AdminModule { }
