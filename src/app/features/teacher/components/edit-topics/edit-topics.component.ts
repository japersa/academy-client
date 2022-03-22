import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-topics',
  templateUrl: './edit-topics.component.html',
  styleUrls: ['./edit-topics.component.scss']
})
export class EditTopicsComponent implements OnInit, OnDestroy {

  modules = [];

  event = null;

  currentModule = '';

  topicForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Input() topic = null;
  @Output() showEvent = new EventEmitter<boolean>();

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public firebaseStorageService: FirebaseStorageService,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.topicForm = this.formBuilder.group({
      module: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      title: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(500)
      ])),
      video: new FormControl('', Validators.compose([
      ])),
      files: new FormControl('', Validators.compose([
      ]))
    });

  }

  createTopic(dataForm: any) {
    this.firebaseStorageService.updateCourseVideo(this.event, dataForm, this.topic.id);
    this.firebaseStorageService.uploadPercent.pipe(finalize(() => {
      this.showEvent.emit(false);
    })).subscribe();
  }

  handleVideoChange(event) {
    this.event = event;
  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  setValues() {
    this.topicForm.patchValue({ title: this.topic.title, description: this.topic.description})
  }

  getTopicName() {
    this.subscription3$ = this.coursesService.getModuleById(this.topic.module_id).subscribe(res => {
      this.currentModule = res.id
    },
      error => {
        console.log(error.error);
      }
    );
  }

  loadModules() {

    this.subscription1$ = this.coursesService.getModules().subscribe(res => {
      Object.assign(this.modules, res);
    },
      error => {
        console.log(error.error);
      }
    );

  }

  ngOnInit(): void {
    this.loadModules();
    this.getTopicName();
    this.setValues();
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
    this.subscriptions.push(this.subscription3$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

}
