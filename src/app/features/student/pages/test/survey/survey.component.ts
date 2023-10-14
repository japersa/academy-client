import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Model, StylesManager, SurveyNG } from 'survey-angular';
import { CoursesService } from '../../../../../shared/services/courses.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../../core/services/notifications.service';

StylesManager.applyTheme('modern');

const myCss = {

  title: 'text-primary',
  navigationButton: 'btn btn-primary btn-lg',
  timerRoot: 'text-white',
  completedPage: 'sv-completedpage bg-transparent',
  

  radiogroup: {
    root: 'sv-selectbase',
    rootMultiColumn: 'sv-selectbase--multi-column',
    item: 'sv-item sv-radio sv-selectbase__item',
    itemOnError: 'sv-item--error',
    itemInline: 'sv-selectbase__item--inline',
    label: 'sd-selectbase__label text-white',
    labelChecked: '',
    itemDisabled: 'sv-item--disabled sv-radio--disabled',
    itemChecked: 'sv-item--checked sv-radio--checked',
    itemHover: 'sv-item--allowhover sv-radio--allowhover',
    itemControl: 'sv-visuallyhidden sv-item__control sv-radio__control',
    itemDecorator: 'sv-item__svg sv-radio__svg ',
    controlLabel: 'sv-item__control-label',
    materialDecorator: 'sv-item__decorator sv-radio__decorator',
    other: 'sv-input sv-comment sv-selectbase__other',
    clearButton: 'sv-btn sv-selectbase__clear-btn',
    column: 'sv-selectbase__column'
  }

};

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @Input() courseId = null;

  test: any = {};

  json: any = {
    title: '',
    showProgressBar: 'bottom',
    showTimerPanel: 'top',
    maxTimeToFinishPage: 180,
    maxTimeToFinish: 1800,
    firstPageIsStarted: true,
    startSurveyText: 'Iniciar evaluación',
    pages: [
      {
        questions: [
          {
            type: 'html',
            html: '<p>Estás a punto de comenzar el cuestionario. <br/>Tiene 180 segundos por pregunta y 30 minutos para completar el cuestionario.<br/>Presiona en <b>\'Iniciar evaluación\'</b> cuando esté listo.</p>'
          }
        ]
      }
    ],
    completedHtml: '<h4>Usted obtuvo <b>{correctedAnswers}</b> preguntas correctas de <b>{questionCount}</b>.</h4>'

  };

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private notificationsService: NotificationsService,
  ) { }

  getTest(courseId: string) {
    this.coursesService.getQuizzesByCourseId(courseId).subscribe(
      {
        next: (r) => {
          this.test = r[0];
        },
        error: (e) => console.log(e.error),
        complete: () => {
          this.json.title = this.test.course_name;
          this.putQuestions();
          const survey = new Model(this.json);
          survey.locale = 'es';

          SurveyNG.render('surveyElement', {
            model: survey,
            css: myCss
          });

          survey.onComplete.add((sender, options) => {
            const result = sender.data;
            result['correct_answers'] = sender.getCorrectedAnswerCount();
            result['no_of_questions'] = sender.getQuizQuestionCount();
            const isApprove: boolean = result['correct_answers'] / result['no_of_questions'] >= 0.8 ? true : false;

            if (isApprove) {
              this.coursesService.approveCourse(this.courseId).subscribe({
                next: (r) => console.log(r),
                error: (e) => console.log(e.error),
                complete: () => {
                  this.notificationsService.showNotification('bottom', 'center', 'Curso aprobado con éxito', 2);
                  setTimeout(() => {
                    this.router.navigate([`/profile`])
                  }, 1000)
                }
              });
            } else {
              this.notificationsService.showNotification('bottom', 'center', 'Curso no aprobado con éxito', 4);
              setTimeout(() => {
                this.router.navigate([`/home`])
              }, 1000)
            }

          });
        }
      }
    )
  }


  putQuestions() {

    this.test.questions.forEach(q => {

      let CHOICES = [q.optionOne, q.optionTwo, q.optionThree, q.optionFour]
      CHOICES = CHOICES.filter(c => c !== '')

      const question = {
        questions: [
          {
            type: 'radiogroup',
            name: 'id' + (new Date()).getTime(),
            title: q.question,
            choicesOrder: 'random',
            choices: CHOICES,
            correctAnswer: q[q.answer]
          }
        ]
      }
      this.json.pages.push(question);

    });

  }


  ngOnInit(): void {

    this.getTest(this.courseId);

  }

}
