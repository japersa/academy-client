import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
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

  topicForm: UntypedFormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

  constructor(
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    public firebaseStorageService: FirebaseStorageService,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.topicForm = this.formBuilder.group({
      module: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      title: new UntypedFormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      description: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(500)
      ])),
      video: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      files: new UntypedFormControl('', Validators.compose([
      ])),
      links: new UntypedFormArray([
        this.formBuilder.group({
          title: new UntypedFormControl('', Validators.compose([
          ])),
          link: new UntypedFormControl('', Validators.compose([
          ])),
        })
      ], []),
    });

  }

  addNewLink() {
    const itemsArr = this.topicForm.get('links') as UntypedFormArray;
    const newItem = this.formBuilder.group({
      title: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      link: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
    })
    itemsArr.push(newItem)
  }

  removeItem(i) {
    const arr = this.topicForm.get('links') as UntypedFormArray;
    arr.removeAt(i);
  }

  createTopic(dataForm: any) {
    if (this.eventFiles) {
      this.createTopicFile();
    }
    this.firebaseStorageService.uploadCourseVideo(this.eventVideo, dataForm);
    this.firebaseStorageService.uploadPercent.subscribe({
      complete: () => {
        this.firebaseStorageService.uploadPercent = null;
        this.firebaseStorageService.uploadPercentFiles = null;
        setTimeout(() => this.showEvent.emit(false), 2000);
      }
    });
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

    this.coursesService.getModules().subscribe(res => {
      Object.assign(this.modules, res);
    },
      error => {
        console.log(error.error);
      }
    );

  }

  ngOnInit(): void {
    this.loadModules()
  }

  ngOnDestroy(): void {
  }

}
