import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../features/admin/services/dashboard.service';
import { take } from 'rxjs/operators';
import { CoursesService } from '../../services/courses.service';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  courses = [];

  constructor(
    private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router
  ) { }

  fillCourses() {
    this.coursesService.getCourses().pipe(take(1)).subscribe(res => {
      Object.assign(this.courses, res.my_courses_created);
      Object.assign(this.courses, res.my_enrolled_courses);
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

  }

  ngOnDestroy(): void {
  }

}
