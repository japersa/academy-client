import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuicklinkModule} from 'ngx-quicklink';

import { UserComponent } from './user.component';
import { UserRoutes } from './user-profile.routing';
import { ComponentsModule } from '../../components/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoutes),
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    QuicklinkModule
  ],
  declarations: [UserComponent],
  exports: [UserComponent]
})
export class UserModule { }
