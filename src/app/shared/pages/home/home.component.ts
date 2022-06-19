import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { UserDataService } from '../../../core/services/user-data.service';
import { BehaviorSubject } from 'rxjs';

import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from 'swiper';
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  courses = [];
  continueLearningCourses = [];

  public dashboardColor: boolean = false;

  slides$ = new BehaviorSubject<any>([]);

  constructor(
    private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router
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

  goToCourseDetail(id: string) {

    this.router.navigate([`/course/${id}`])

  }

  ngOnInit(): void {
    this.fillCourses();
    this.coursesService.getKeepWatching().subscribe(r => {
      this.continueLearningCourses = r;
      console.log(r);

    });

  }
}
