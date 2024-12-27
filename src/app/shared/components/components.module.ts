import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DxVectorMapModule } from 'devextreme-angular';

import { FooterComponent } from './footer/footer.component';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { AuthNavbarComponent } from './auth-navbar/auth-navbar.component';
import { FixedPluginComponent } from './fixed-plugin/fixed-plugin.component';

import { ProgressbarModule } from "ngx-bootstrap/progressbar";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    DxVectorMapModule,
    ProgressbarModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    FooterComponent,
    PictureUploadComponent,
    AuthNavbarComponent,
    FixedPluginComponent,
  ],
  exports: [
    FooterComponent,
    PictureUploadComponent,
    ProgressbarModule,
    AuthNavbarComponent,
    FixedPluginComponent,
  ]
})
export class ComponentsModule { }
