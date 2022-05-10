import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../../core/services/utils.service';
import { TopicCommentsService } from '../../../../../shared/services/topic-comments.service';
import { NotificationsService } from '../../../../../core/services/notifications.service';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent implements OnInit {

  @Input() comment = null;
  @Output() loadUnanswered = new EventEmitter<any>();

  commentForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private topicCommentsService: TopicCommentsService,
    private notificationsService: NotificationsService,
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.commentForm = this.formBuilder.group({
      body: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(500)
      ])),
    });

  }

  createReply(dataForm) {
    const data = {}
    Object.assign(data, dataForm);
    Object.assign(data, { comment: this.comment.id });

    this.topicCommentsService.createReplyComment(data).subscribe(
      {
        next: (r) => this.notificationsService.showNotification('bottom', 'center', 'Su comentario fue enviado correctamente', 2),
        error: (e) => {
          this.notificationsService.showNotification('bottom', 'center', 'Error al publicar comentario', 4)
          this.errorMessage = e.error;
        },
        complete: () => {
          this.commentForm.reset();
          this.loadUnanswered.emit(true);
        }
      }
    )
  }

  ngOnInit(): void {
  }

}
