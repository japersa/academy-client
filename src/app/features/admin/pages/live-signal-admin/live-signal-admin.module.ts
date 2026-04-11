import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuicklinkModule } from 'ngx-quicklink';
import { LiveSignalAdminRoutingModule } from './live-signal-admin-routing.module';
import { LiveSignalAdminComponent } from './live-signal-admin.component';

@NgModule({
  declarations: [LiveSignalAdminComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LiveSignalAdminRoutingModule,
    QuicklinkModule,
  ],
})
export class LiveSignalAdminModule {}
