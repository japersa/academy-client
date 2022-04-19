import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {

  source: any = null;
  course: any = {};

  courseId = '';

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService,
  ) {

    this.subscription1$ = this.route.paramMap.subscribe((params: ParamMap) => {
      this.courseId = params.get('id');
    });


  }

  loadCourse() {
    this.subscription2$ = this.coursesService.getCourseById(this.courseId).subscribe(res => {
      console.log(res);

      Object.assign(this.course, res)
      this.notificationsService.showNotification('bottom', 'center', 'Curso cargado con éxito', 2);
    },
      error => {
        console.log(error.error);
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear módulo', 4);
      }
    );
  }

  ngOnInit() {
    this.loadCourse();
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
