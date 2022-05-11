import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TopicCommentsService } from '../../../../shared/services/topic-comments.service';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-topic-comments',
  templateUrl: './topic-comments.component.html',
  styleUrls: ['./topic-comments.component.scss']
})
export class TopicCommentsComponent implements OnInit {

  @Input() comments = [];

  topicId = '';

  commentForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private topicCommentsService: TopicCommentsService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private userDataService: UserDataService,
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.commentForm = this.formBuilder.group({
      body: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(500)
      ])),
    });

  }

  createComment(dataForm) {
    const data = {}
    Object.assign(data, dataForm);
    Object.assign(data, { topic: this.topicId });

    this.topicCommentsService.createTopicComment(data).subscribe(
      {
        next: (r) => { this.notificationsService.showNotification('bottom', 'center', 'Su comentario fue enviado correctamente', 2) },
        error: (e) => {
          this.notificationsService.showNotification('bottom', 'center', 'Error al publicar comentario', 4)
          this.errorMessage = e.error;
        },
        complete: () => {
          this.commentForm.reset();
          Object.assign(data, {
            created_at: new Date(),
            author: {
              first_name: this.userDataService.userData$.value.first_name,
              image_profile: this.userDataService.userData$.value.image_profile
            }
          });

          this.comments.unshift(data);
        }
      }
    )
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.topicId = params.get('id');
    });
  }

}
