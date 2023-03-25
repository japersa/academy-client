import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from 'swiper';
import { CoursesService } from '../../../../shared/services/courses.service';
import { RegisterService } from '../../../auth/services/register.service';
import { UserDataService } from '../../../../core/services/user-data.service';
import { StorageService } from '../../../../core/services/storage.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AcademyComponent {

  courses = [];
  continueLearningCourses = [];

  public dashboardColor: boolean = false;

  slides$ = new BehaviorSubject<any>([]);

  constructor(
    private coursesService: CoursesService,
    private registerService: RegisterService,
    public userDataService: UserDataService,
    private storageService: StorageService,
    private notificationsService: NotificationsService
  ) { }

  fillCourses() {
    this.coursesService.getCourses().subscribe(res => {

      if (this.userDataService.userData$.value.rol === 'admin') {
        this.courses = res.all;
      }
      if (this.userDataService.userData$.value.rol === 'teacher') {
        this.courses = res.my_courses_created;
      }
      if (this.userDataService.userData$.value.rol === 'student') {
        this.courses = res.my_enrolled_courses;
      }
    },
      error => {
        console.log(error);
      });
  }

  getUser() {
    setTimeout(() => {
      this.registerService.getUser().subscribe(
        {
          next: (r) => {
            this.userDataService.userData$.next(r);
            this.storageService.set('userData', r);
          },
          error: (e) => {
            console.log(e.error);
          }
        }
      )
    }, 200);
  }

  ngOnInit(): void {
    this.fillCourses();
    this.coursesService.getKeepWatching().subscribe(r => {
      this.continueLearningCourses = r;
    });
    this.getUser();
    if (this.userDataService.userData$.value.subscription === 'none') {
      this.notificationsService.showNotification('top', 'center', 'Aún no tienes una subscripción, puedes obtenerla rápidamente <a href="/subscription">AQUÍ</a>.</p>', 3);
    }

  }
}
