import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';

import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule,AngularFireStorageModule } from '@angular/';


// Core Modules
import { CoreModule } from './core/core.module';

// Features Module
import { FeaturesModule } from './features/features.module';

// Shared Modulse
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './shared/components/components.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "<your-api-key>",
      authDomain: "<your-auth-domain>",
      storageBucket: "<project-id>.appspot.com",
      projectId: "<your-project-id>",
    }),
    AngularFireStorageModule
    ToastrModule.forRoot(),
    CoreModule,
    SharedModule,
    FeaturesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
