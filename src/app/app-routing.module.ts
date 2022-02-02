import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Layouts
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin-courses',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/pages/dashboard/dashboard.module')
          .then(m => m.DashboardModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./shared/pages/user/user-profile.module')
          .then(m => m.UserModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('./features/admin/pages/admins/admins.module')
          .then(m => m.AdminsModule)
      },
      {
        path: 'admin-courses',
        loadChildren: () => import('./features/teacher/pages/admin-courses/admin-courses.module')
          .then(m => m.AdminCoursesModule)
      },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('./features/auth/pages/login/login.module')
          .then(m => m.LoginModule)
      },
      {
        path: 'sign-up',
        loadChildren: () => import('./features/auth/pages/register/register.module')
          .then(m => m.RegisterModule)
      },
      {
        path: 'forget-password',
        loadChildren: () => import('./features/auth/pages/forget-password/forget-password.module')
          .then(m => m.ForgetPasswordModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'sign-in'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
