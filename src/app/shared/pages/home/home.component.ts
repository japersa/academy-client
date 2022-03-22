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

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private coursesService: CoursesService,
    public userDataService: UserDataService,
    private router: Router) { }

  fillCourses() {
    this.subscription1$ = this.coursesService.getCourses().pipe(take(1)).subscribe(res => {
      Object.assign(this.courses, res);
    },
      error => {
        console.log(error);
      });
  }

  goToCourseDetail(id: string) {

    this.router.navigate([`/courses/${id}`])

  }

  ngOnInit(): void {
    this.fillCourses();
    // Subs
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

}
