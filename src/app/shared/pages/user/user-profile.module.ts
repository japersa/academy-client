import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuicklinkModule} from 'ngx-quicklink';

import { UserComponent } from './user.component';
import { UserRoutes } from './user-profile.routing';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoutes),
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    QuicklinkModule
  ],
  declarations: [UserComponent],
  exports: [UserComponent]
})
export class UserModule { }
