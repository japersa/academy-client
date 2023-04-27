import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ClipboardModule,
    QuicklinkModule,
    CarouselModule
  ]
})
export class HomeModule { }
