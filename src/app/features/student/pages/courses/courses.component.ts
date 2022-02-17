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
    private sanitizer: DomSanitizer) {
    // this.source = this.sanitizer.bypassSecurityTrustResourceUrl('https://firebasestorage.googleapis.com/v0/b/mistrades-b043d.appspot.com/o/y2mate.com%20-%20Linkin%20Park%20feat%20Travis%20Barker%20%20Bleed%20It%20Out_480p.mp4?alt=media&token=df12c13b-7e0a-4fa8-956a-d5ff9dacfee5');

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
