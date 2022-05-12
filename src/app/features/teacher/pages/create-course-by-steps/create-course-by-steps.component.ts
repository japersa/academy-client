import { Component, OnInit, OnDestroy } from '@angular/core';
import Stepper from 'bs-stepper';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-course-by-steps',
  templateUrl: './create-course-by-steps.component.html',
  styleUrls: ['./create-course-by-steps.component.scss']
})
export class CreateCourseByStepsComponent implements OnInit, OnDestroy {

  validationMessages: any;
  errorMessage: string | null;
  event = null;
  eventFiles = null;

  // COURSE
  courseForm: FormGroup;

  // MODULES
  moduleForm: FormGroup;
  modules = [];

  // TOPICS
  topicForm: FormGroup;

  // QUIZZES
  quizForm: FormGroup;
  quizzes = [];

  // STEPPER

  value = 15;
  multiselect: any = [];
  private stepper: Stepper;
  checked = false;
  checked1 = false;
  checked2 = false;
  checked3 = false;

  public formWizard: FormGroup;
  wizard = false;
  step = 1;

  constructor(private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public firebaseStorageService: FirebaseStorageService,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService) {

    this.validationMessages = utilsService.getValidationMessages();

    // COURSE FORM
    this.courseForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(2000)
      ])),
      price: new FormControl('0', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^\\d+\\.?\\d{0,2}$')]
      )),
      path_preview_image: new FormControl('', Validators.compose([
      ])
      )
    });

    // MODULE FORM
    this.moduleForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
    });

    // TOPIC FORM
    // this.topicForm = this.formBuilder.group({
    //   module: new FormControl('', Validators.compose([
    //     Validators.required,
    //   ])),
    //   title: new FormControl('', Validators.compose([
    //     Validators.required, Validators.minLength(8), Validators.maxLength(100)
    //   ])),
    //   description: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.minLength(8),
    //     Validators.maxLength(500)
    //   ])),
    //   video: new FormControl('', Validators.compose([
    //     Validators.required,
    //   ])),
    //   files: new FormControl('', Validators.compose([
    //   ]))
    // });

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

    // QUIZ FORM
    this.quizForm = this.formBuilder.group({
      question: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(100)
      ])),
      optionOne: new FormControl('', Validators.compose([
        Validators.required, Validators.required, Validators.minLength(2)
      ])),
      optionTwo: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(2)
      ])),
      optionThree: new FormControl('', Validators.compose([
      ])),
      optionFour: new FormControl('', Validators.compose([
      ])),
      answer: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });

  }


  // COURSE
  createCourse(dataForm: any) {
    this.firebaseStorageService.uploadCourseCover(this.event, dataForm);
    this.firebaseStorageService.uploadPercent.subscribe(() => {
      this.firebaseStorageService.uploadPercent = null;
      this.courseForm.reset();
      this.event = null;
      this.errorMessage = '';
    });
  }

  handleImageChange(event) {
    this.event = event;
  }

  // MODULE

  createModule(dataForm: any) {
    const data = {
      name: dataForm.name,
      course: this.firebaseStorageService.course.id
    }
    this.coursesService.createModule(data).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Módulo creado con éxito', 2);
      this.moduleForm.reset();
      this.modules.push(res);
      this.event = null;
      this.errorMessage = '';
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear módulo', 4);
      }
    );
  }

  // TOPICS

  createTopic(dataForm: any) {
    if (this.eventFiles) {
      this.createTopicFile();
    }
    this.firebaseStorageService.uploadCourseVideo(this.event, dataForm);
    this.firebaseStorageService.uploadPercent.subscribe({
      complete: () => {
        this.firebaseStorageService.uploadPercent = null;
        this.firebaseStorageService.uploadPercentFiles = null;
        this.topicForm.reset();
        this.event = null;
      }
    });
  }

  createTopicFile() {
    this.firebaseStorageService.uploadCourseFiles(this.eventFiles);
    this.firebaseStorageService.uploadPercentFiles.subscribe();
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

  handleVideoChange(event) {
    this.event = event;
  }


  handleFilesChange(event) {
    this.eventFiles = event;
  }

  // QUIZZES
  createQuiz(dataForm: any) {

    const correctAnswer = dataForm.answer
    const answersArr = []

    const DATA = {
      question: dataForm.question,
      course: this.firebaseStorageService.course.id,
      answers: answersArr
    }

    Object.entries(dataForm).forEach(([key, value]) => {

      switch (key.toString()) {
        case 'optionOne':
          if (correctAnswer === '1') {
            answersArr.push({
              option: value,
              isCorrect: true
            })
            break;
          }
          answersArr.push({
            option: value,
            isCorrect: false
          })
          break;
        case 'optionTwo':
          if (correctAnswer === '2') {
            answersArr.push({
              option: value,
              isCorrect: true
            })
            break;
          }
          answersArr.push({
            option: value,
            isCorrect: false
          })
          break;
        case 'optionThree':
          if (correctAnswer === '3') {
            answersArr.push({
              option: value,
              isCorrect: true
            })
            break;
          }
          answersArr.push({
            option: value,
            isCorrect: false
          })
          break;
        case 'optionFour':
          if (correctAnswer === '4') {
            answersArr.push({
              option: value,
              isCorrect: true
            })
            break;
          }
          answersArr.push({
            option: value,
            isCorrect: false
          })
          break;

        default:
          break;
      }

    });

    this.coursesService.createQuiz(DATA).subscribe(res => {
      this.quizzes.push(res);
      this.notificationsService.showNotification('bottom', 'center', 'Quiz creado con éxito', 2);
      this.errorMessage = '';
      this.quizForm.reset();
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear quiz', 4);
      }
    );
  }

  // STEPPER

  get registerF() {
    return this.formWizard.controls;
  }

  onRegister() {
    this.wizard = true;
    // stop here if form is invalid
    if (this.formWizard.invalid) {
      return;
    }
    this.stepper.next();
  }
  next() {
    // if (this.formWizard.valid) {
    //   console.log("aici");
    // }
    if (this.value < 77) {
      this.step++;
      this.value += 24;
    }
    if (this.step === 1) {
      this.checked = true;
    } else if (this.step === 2) {
      this.checked1 = true;
    } else {
      this.checked2 = true;
    }
    this.stepper.next();
  }
  previous() {
    this.stepper.previous();
    if (this.value > 15) {
      this.value -= 24;
      this.step--;
    }
  }
  addCheched(event) {
    event.target.classList.add('checked');
  }

  // GENERAL

  reset(form: number) {
    switch (form) {
      case 1:
        this.courseForm.reset();
        break;

      case 2:
        this.moduleForm.reset();
        break;

      case 3:
        this.topicForm.reset();
        break;

      case 4:
        this.quizForm.reset();
        break;

      default:
        break;
    }

  }

  ngOnInit() {
    var wizard = document.getElementsByClassName('card-wizard')[0];
    wizard.classList.add('active');
    var stepper = document.getElementById('wizardProfile');

    this.stepper = new Stepper(stepper, {
      linear: false,
      animation: true
    });
  }

  ngOnDestroy(): void {
  }

}
