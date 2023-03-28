import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuicklinkModule} from 'ngx-quicklink';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { ForgetPasswordComponent } from './forget-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    ForgetPasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuicklinkModule
  ]
})
export class ForgetPasswordModule { }
