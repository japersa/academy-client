import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Subscription } from 'rxjs';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-topics',
  templateUrl: './create-topics.component.html',
  styleUrls: ['./create-topics.component.scss']
})
export class CreateTopicsComponent implements OnInit, OnDestroy {

  modules = [];

  eventFiles = null;
  eventVideo = null;

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
        Validators.required,
      ])),
      files: new FormControl('', Validators.compose([
      ])),
      links: new FormArray([
        this.formBuilder.group({
          title: new FormControl('', Validators.compose([
            Validators.required,
          ])),
          link: new FormControl('', Validators.compose([
            Validators.required,
          ])),
        })
      ], [Validators.required]),
    });

  }

  addNewLink() {
    const itemsArr = this.topicForm.get('links') as FormArray;
    const newItem = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      link: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    })
    itemsArr.push(newItem)
  }

  removeItem(i) {
    const arr = this.topicForm.get('links') as FormArray;
    arr.removeAt(i);
  }

  createTopic(dataForm: any) {
    this.createTopicFile();
    this.firebaseStorageService.uploadCourseVideo(this.eventVideo, dataForm);
    this.firebaseStorageService.uploadPercent.pipe(finalize(() => {
      this.showEvent.emit(false);
    })).subscribe();
  }

  createTopicFile() {
    this.firebaseStorageService.uploadCourseFiles(this.eventFiles);
    this.firebaseStorageService.uploadPercentFiles.subscribe();
  }

  handleVideoChange(event) {
    this.eventVideo = event;
  }

  handleFilesChange(event) {
    this.eventFiles = event;
  }

  cancelCreate() {
    this.showEvent.emit(false);
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
    this.loadModules()
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
