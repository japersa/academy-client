import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { finalize } from 'rxjs/operators';

function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj
}

@Component({
  selector: 'app-edit-topics',
  templateUrl: './edit-topics.component.html',
  styleUrls: ['./edit-topics.component.scss']
})
export class EditTopicsComponent implements OnInit, OnDestroy {

  modules = [];

  eventFiles = null;
  eventVideo = null;

  currentModule = '';

  topicForm: UntypedFormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Input() topic = null;
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
      video: new UntypedFormControl(null),
      files: new UntypedFormControl(null),
      links: new UntypedFormArray([
        this.formBuilder.group({
          title: new UntypedFormControl(null),
          link: new UntypedFormControl(null,),
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

    dataForm = clean(dataForm);
    console.log(dataForm);

    if (this.eventFiles) {
      this.createTopicFile();
    }
    this.firebaseStorageService.updateCourseVideo(this.eventVideo, dataForm, this.topic.id);
    this.firebaseStorageService.uploadPercent.subscribe({
      complete: () => {        
        this.firebaseStorageService.uploadPercent = null;
        this.firebaseStorageService.uploadPercentFiles = null;
        setTimeout(() => this.showEvent.emit(false), 2000);
      }
    });

  }

  handleVideoChange(event) {
    this.eventVideo = event;
  }

  handleFilesChange(event) {
    this.eventFiles = event;
  }

  createTopicFile() {
    this.firebaseStorageService.uploadCourseFiles(this.eventFiles);
    this.firebaseStorageService.uploadPercentFiles.subscribe();
  }


  cancelCreate() {
    this.showEvent.emit(false);
  }

  setValues(topic: any) {

    const itemsArr = this.topicForm.get('links') as UntypedFormArray;
    this.topicForm.patchValue({
      title: this.topic.title,
      description: this.topic.description,
      links: this.topic.links
    })
    this.removeItem(topic.links[0])

    topic.links.forEach(e => {

      const newItem = this.formBuilder.group({
        title: new UntypedFormControl('', Validators.compose([
        ])),
        link: new UntypedFormControl('', Validators.compose([
        ])),
      })
      itemsArr.push(newItem)

    });
  }


  getTopicName() {
    this.coursesService.getModuleById(this.topic.module_id).subscribe(res => {
      this.currentModule = res.name
    },
      error => {
        console.log(error.error);
      }
    );
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
    this.loadModules();
    this.getTopicName();
    this.setValues(this.topicForm);
  }

  ngOnDestroy(): void {
  }

}
