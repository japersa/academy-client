import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { LiveSignalsRoutingModule } from './live-signals-routing.module';
import { LiveSignalsComponent } from './live-signals.component';

@NgModule({
  declarations: [LiveSignalsComponent],
  imports: [CommonModule, RouterModule, LiveSignalsRoutingModule, QuicklinkModule],
})
export class LiveSignalsModule {}
