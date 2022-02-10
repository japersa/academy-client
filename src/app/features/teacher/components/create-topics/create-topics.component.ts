import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-topics',
  templateUrl: './create-topics.component.html',
  styleUrls: ['./create-topics.component.scss']
})
export class CreateTopicsComponent implements OnInit, OnDestroy {

  modules = [];

  topicForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

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

    this.topicForm = this.formBuilder.group({
      module: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      video: new FormControl('', Validators.compose([
      ])),
      files: new FormControl('', Validators.compose([
      ]))
    });

  }

  createTopic(dataForm: any) {
    console.log(dataForm);

    this.subscription1$ = this.coursesService.createTopic(dataForm).subscribe(res => {
      console.log(res);

      Object.assign(this.modules, res);
    },
      error => {
        console.log(error.error);
      }
    );

    this.showEvent.emit(false);

  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  loadTopics() {

    this.subscription1$ = this.coursesService.getTopics().subscribe(res => {
      console.log(res);

      Object.assign(this.modules, res);
    },
      error => {
        console.log(error.error);
      }
    );

  }

  ngOnInit(): void {
    this.loadTopics()
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
