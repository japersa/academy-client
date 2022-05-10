import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
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

  eventFiles = null;
  eventVideo = null;

  currentModule = '';

  topicForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Input() topic = null;
  @Output() showEvent = new EventEmitter<boolean>();

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
          ])),
          link: new FormControl('', Validators.compose([
          ])),
        })
      ], []),
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

    const itemsArr = this.topicForm.get('links') as FormArray;
    this.topicForm.patchValue({
      title: this.topic.title,
      description: this.topic.description,
      links: this.topic.links
    })
    this.removeItem(topic.links[0])

    topic.links.forEach(e => {

      const newItem = this.formBuilder.group({
        title: new FormControl('', Validators.compose([
        ])),
        link: new FormControl('', Validators.compose([
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
