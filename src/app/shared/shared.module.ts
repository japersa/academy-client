import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { UserModule } from './pages/user/user-profile.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserModule
  ],
  exports: [
    UserModule
  ]
})
export class SharedModule { }
