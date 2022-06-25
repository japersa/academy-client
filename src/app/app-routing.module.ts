import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { AdminLayoutComponent } from './features/admin/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './features/auth/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/test/1',
    pathMatch: 'full'
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
      {
        path: 'pricing',
        loadChildren: () => import('./features/auth/pages/pricing/pricing.module')
          .then(m => m.PricingModule)
      },
      {
        path: 'success',
        loadChildren: () => import('./features/auth/pages/success/success.module')
          .then(m => m.SuccessModule)
      },
      {
        path: 'cancel',
        loadChildren: () => import('./features/auth/pages/cancel/cancel.module')
          .then(m => m.CancelModule)
      },

    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
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
        path: 'course-by-steps',
        loadChildren: () => import('./features/teacher/pages/create-course-by-steps/create-course-by-steps.module')
          .then(m => m.CreateCourseByStepsModule)
      },
      {
        path: 'admin-courses',
        loadChildren: () => import('./features/teacher/pages/admin-courses/admin-courses.module')
          .then(m => m.AdminCoursesModule)
      },
      {
        path: 'ama',
        loadChildren: () => import('./features/teacher/pages/ama/ama.module')
          .then(m => m.AmaModule)
      },
      {
        path: 'course/:id',
        loadChildren: () => import('./features/student/pages/courses/courses.module')
          .then(m => m.CoursesModule)
      },
      {
        path: 'subscription',
        loadChildren: () => import('./shared/pages/subscription/subscription.module')
          .then(m => m.SubscriptionModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./shared/pages/home/home.module')
          .then(m => m.HomeModule)
      },
      {
        path: 'test/:id',
        loadChildren: () => import('./features/student/pages/test/test.module')
          .then(m => m.TestModule)
      },
      {
        path: 'class/:id',
        loadChildren: () => import('./features/student/pages/class/class.module')
          .then(m => m.ClassModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./shared/pages/notifications/notifications.module')
          .then(m => m.NotificationsModule)
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
      preloadingStrategy: QuicklinkStrategy,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
