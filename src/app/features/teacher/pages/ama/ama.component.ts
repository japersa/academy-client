import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AmaService } from '../../../../shared/services/ama.service';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { TopicCommentsService } from '../../../../shared/services/topic-comments.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-ama',
  templateUrl: './ama.component.html',
  styleUrls: ['./ama.component.scss']
})
export class AmaComponent implements OnInit, OnDestroy {

  unansweredQuestion = [];

  commentForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  constructor(private amaService: AmaService,
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

    this.topicCommentsService.createTopicComment(data).subscribe(
      {
        next: (r) => this.notificationsService.showNotification('bottom', 'center', 'Su comentario fue enviado correctamente', 2),
        error: (e) => {
          this.notificationsService.showNotification('bottom', 'center', 'Error al publicar comentario', 4)
          this.errorMessage = e.error;
        },
        complete: () => this.commentForm.reset()
      }
    )
  }






  getUnansweredQuestions() {

    this.amaService.getUnansweredQuestions().pipe(take(1)).subscribe(res => {
      console.log(res);
      Object.assign(this.unansweredQuestion, res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  loadData() {
    this.getUnansweredQuestions();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
  }

}
