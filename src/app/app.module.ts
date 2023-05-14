import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';

import { AppRoutingModule } from './app-routing.module';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// Core Modules
import { CoreModule } from './core/core.module';

// Features Module
import { FeaturesModule } from './features/features.module';

// Shared Modulse
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './shared/components/components.module';

import { environment } from 'src/environments/environment';

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
    QuicklinkModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ToastrModule.forRoot(),
    CoreModule,
    SharedModule,
    FeaturesModule
  ],
  exports: [],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
