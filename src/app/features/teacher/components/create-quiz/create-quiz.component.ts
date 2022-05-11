import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit, OnDestroy {

  courses = []

  quizForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService,
    private userDataService: UserDataService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.quizForm = this.formBuilder.group({

      course: new FormControl('', Validators.compose([
        Validators.required
      ])),

      questions: new FormArray([
        this.formBuilder.group({
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
        })
      ], [Validators.required]),

    });

  }

  addNewItem() {
    const itemsArr = this.quizForm.get('questions') as FormArray;
    const newItem = this.formBuilder.group({
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
    })
    itemsArr.push(newItem)
  }

  removeItem(i) {
    const arr = this.quizForm.get('questions') as FormArray;
    arr.removeAt(i);
  }

  createQuiz(dataForm: any) {

    console.log(dataForm);

    this.coursesService.createQuiz(dataForm).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Quiz creado con éxito', 2);
      this.errorMessage = '';
      this.quizForm.reset();
      this.showEvent.emit(false);
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear quiz', 4);
      }
    );
  }

  loadCourses() {

    this.coursesService.getCourses().subscribe(res => {
      if (this.userDataService.userData$.value.rol === 'admin') {
        this.courses = res.all;
      }
      if (this.userDataService.userData$.value.rol === 'teacher') {
        this.courses = res.my_courses_created;
      }
    },
      error => {
        console.log(error.error);
      }
    );

  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  ngOnInit(): void {

    this.loadCourses()

  }

  ngOnDestroy(): void {
  }

}
