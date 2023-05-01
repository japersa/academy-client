import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    QuicklinkModule,
    HttpClientModule
  ],
  exports: [
  ]
})
export class AdminModule { }
