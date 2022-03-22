import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit, OnDestroy {

  courses = []
  currentCourse = '';

  quizForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Input() quiz = null;
  @Output() showEvent = new EventEmitter<boolean>();

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

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
      course: new FormControl('', Validators.compose([
        Validators.required
      ])),
      answer: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });

  }

  editQuiz(dataForm: any) {
    this.subscription2$ = this.coursesService.updateQuiz(dataForm, this.quiz.id).subscribe(res => {
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

    this.subscription1$ = this.coursesService.getCourses().subscribe(res => {
      Object.assign(this.courses, res)
    },
      error => {
        console.log(error.error);
      }
    );

  }

  getCourseName() {
    this.subscription3$ = this.coursesService.getCourseById(this.quiz.course_id).subscribe(res => {
      console.log(res);

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

  ngOnInit(): void {
    this.loadCourses();
    this.getCourseName();
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
