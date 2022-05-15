import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

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
    private router: Router
  ) {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.courseId = params.get('id');
    });


  }

  goToTopicDetail(topicId: string) {
    console.log(topicId);
    this.router.navigate([`/class/${topicId}`])
  }

  getGeight() {
    return `height: ${this.course.modules.length * 50}% !important`;
  }

  loadCourse() {
    this.coursesService.getCourseById(this.courseId).subscribe(res => {
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
  }

}
