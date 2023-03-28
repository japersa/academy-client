import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { UserModule } from './pages/user/user-profile.module';

import { QuicklinkModule} from 'ngx-quicklink';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserModule,
    QuicklinkModule
  ],
  exports: [
    UserModule
  ]
})
export class SharedModule { }
