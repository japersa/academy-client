import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  courseId = null;

  result: any;

  constructor(
    private route: ActivatedRoute,
  ) { }



  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.courseId = id;
    });

  }



}
