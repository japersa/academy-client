import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topic-comments',
  templateUrl: './topic-comments.component.html',
  styleUrls: ['./topic-comments.component.scss']
})
export class TopicCommentsComponent implements OnInit {

  @Input() comments = [];

  commentForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.commentForm = this.formBuilder.group({
      body: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(500)
      ])),
    });

  }

  ngOnInit(): void {
  }

}
