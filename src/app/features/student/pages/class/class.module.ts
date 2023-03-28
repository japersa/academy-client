import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { ClassRoutingModule } from './class-routing.module';
import { ClassComponent } from './class.component';
import { ComponentsModule } from '../../components/components.module';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [ClassComponent],
  imports: [
    CommonModule,
    ClassRoutingModule,
    ComponentsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    QuicklinkModule
  ],
})
export class ClassModule { }
