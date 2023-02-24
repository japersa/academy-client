import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit, OnDestroy {

  courses = []
  currentCourse = '';

  quizForm: UntypedFormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Input() quiz = null;
  @Output() showEvent = new EventEmitter<boolean>();

  constructor(
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService,
    public userDataService: UserDataService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.quizForm = this.formBuilder.group({

      course: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),

      questions: new UntypedFormArray([
        this.formBuilder.group({
          question: new UntypedFormControl('', Validators.compose([
            Validators.required, Validators.minLength(10), Validators.maxLength(100)
          ])),
          optionOne: new UntypedFormControl('', Validators.compose([
            Validators.required, Validators.required, Validators.minLength(2)
          ])),
          optionTwo: new UntypedFormControl('', Validators.compose([
            Validators.required, Validators.minLength(2)
          ])),
          optionThree: new UntypedFormControl('', Validators.compose([
          ])),
          optionFour: new UntypedFormControl('', Validators.compose([
          ])),

          answer: new UntypedFormControl('', Validators.compose([
            Validators.required
          ])),
        })
      ], [Validators.required]),

    });

  }

  addNewItem() {
    const itemsArr = this.quizForm.get('questions') as UntypedFormArray;
    const newItem = this.formBuilder.group({
      question: new UntypedFormControl('', Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(100)
      ])),
      optionOne: new UntypedFormControl('', Validators.compose([
        Validators.required, Validators.required, Validators.minLength(2)
      ])),
      optionTwo: new UntypedFormControl('', Validators.compose([
        Validators.required, Validators.minLength(2)
      ])),
      optionThree: new UntypedFormControl('', Validators.compose([
      ])),
      optionFour: new UntypedFormControl('', Validators.compose([
      ])),

      answer: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    })
    itemsArr.push(newItem)
  }

  removeItem(i) {
    const arr = this.quizForm.get('questions') as UntypedFormArray;
    arr.removeAt(i);
  }

  editQuiz(dataForm: any) {
    this.coursesService.updateQuiz(dataForm, this.quiz.id).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Quiz actualizado con éxito', 2);
      this.errorMessage = '';
      this.quizForm.reset();
      this.showEvent.emit(false);
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al actualizar quiz', 4);
      }
    );
  }

  loadCourses() {

    this.coursesService.getCourses().subscribe(res => {
      console.log(res);

      Object.assign(this.courses, res.my_courses_created);

      if (this.userDataService.userData$.value.rol === 'admin') {
        Object.assign(this.courses, res.all);
      }
    },
      error => {
        console.log(error.error);
      }
    );

  }

  getCourseName() {
    this.coursesService.getCourseById(this.quiz.course_id).subscribe(res => {

      this.currentCourse = res.title
    },
      error => {
        console.log(error.error);
      }
    );
  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  setValues(form: any) {

    const itemsArr = this.quizForm.get('questions') as UntypedFormArray;

    this.quizForm.patchValue(form);
    this.removeItem(form.questions[0])

    form.questions.forEach(e => {

      const newItem = this.formBuilder.group({
        question: new UntypedFormControl(e.question, Validators.compose([
          Validators.required, Validators.minLength(10), Validators.maxLength(100)
        ])),
        optionOne: new UntypedFormControl(e.optionOne, Validators.compose([
          Validators.required, Validators.required, Validators.minLength(2)
        ])),
        optionTwo: new UntypedFormControl(e.optionTwo, Validators.compose([
          Validators.required, Validators.minLength(2)
        ])),
        optionThree: new UntypedFormControl(e.optionThree, Validators.compose([
        ])),
        optionFour: new UntypedFormControl(e.optionFour, Validators.compose([
        ])),
        answer: new UntypedFormControl(e.answer, Validators.compose([
          Validators.required
        ])),
      })

      itemsArr.push(newItem)

    });
  }


  ngOnInit(): void {

    this.loadCourses();
    this.getCourseName();
    this.setValues(this.quiz);
  }

  ngOnDestroy(): void {

  }


}
