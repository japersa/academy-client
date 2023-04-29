import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule } from 'ngx-quicklink';

import { AdminsRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CreateUserComponent } from '../../components/create-user/create-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';

@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    EditUserComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    BsDatepickerModule,
    QuicklinkModule
  ],
  exports: [
    CreateUserComponent,
    EditUserComponent
  ]
})
export class UsersModule { }
