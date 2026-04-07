import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  source: any = null;
  course: any = {};

  shouldExpand = true

  courseId = '';


  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService,
    public userDataService: UserDataService,
    private router: Router
  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.courseId = params.get('id');
    });


  }

  goToTopicDetail(topicId: string) {
    this.router.navigate([`/class/${topicId}`])
  }

  loadCourse() {
    this.coursesService.getCourseById(this.courseId).subscribe(res => {
      Object.assign(this.course, res);
      console.log(res);
    },
      error => {
        console.log(error.error);
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear módulo', 4);
      }
    );
  }

  ngOnInit() {
    this.loadCourse();
  }

}
