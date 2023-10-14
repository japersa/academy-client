import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Model, StylesManager, SurveyNG } from 'survey-angular';
import { CoursesService } from '../../../../../shared/services/courses.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../../core/services/notifications.service';

const surveyJson = {
  "isPanelless": true,
  "cssVariables": {
      "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
      "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
      "--sjs-general-backcolor-dim": "rgba(255, 255, 255, 1)",
      "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
      "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
      "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
      "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
      "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
      "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
      "--sjs-primary-backcolor": "#AB8E3A",
      "--sjs-primary-backcolor-light": "rgba(171, 142, 58, 0.1)",
      "--sjs-primary-backcolor-dark": "rgba(156, 130, 53, 1)",
      "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
      "--sjs-base-unit": "8px",
      "--sjs-corner-radius": "4px",
      "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
      "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
      "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
      "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
      "--sjs-shadow-small": "0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
      "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
      "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
      "--sjs-shadow-inner": "inset 0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
      "--sjs-border-light": "rgba(0, 0, 0, 0.09)",
      "--sjs-border-default": "rgba(0, 0, 0, 0.16)",
      "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
      "--sjs-special-red": "rgba(229, 10, 62, 1)",
      "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
      "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-special-green": "rgba(25, 179, 148, 1)",
      "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
      "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-special-blue": "rgba(67, 127, 217, 1)",
      "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
      "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
      "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
      "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
      "--sjs-article-font-xx-large-fontSize": "64px",
      "--sjs-article-font-xx-large-textDecoration": "none",
      "--sjs-article-font-xx-large-fontWeight": "700",
      "--sjs-article-font-xx-large-fontStyle": "normal",
      "--sjs-article-font-xx-large-fontStretch": "normal",
      "--sjs-article-font-xx-large-letterSpacing": "0",
      "--sjs-article-font-xx-large-lineHeight": "64px",
      "--sjs-article-font-xx-large-paragraphIndent": "0px",
      "--sjs-article-font-xx-large-textCase": "none",
      "--sjs-article-font-x-large-fontSize": "48px",
      "--sjs-article-font-x-large-textDecoration": "none",
      "--sjs-article-font-x-large-fontWeight": "700",
      "--sjs-article-font-x-large-fontStyle": "normal",
      "--sjs-article-font-x-large-fontStretch": "normal",
      "--sjs-article-font-x-large-letterSpacing": "0",
      "--sjs-article-font-x-large-lineHeight": "56px",
      "--sjs-article-font-x-large-paragraphIndent": "0px",
      "--sjs-article-font-x-large-textCase": "none",
      "--sjs-article-font-large-fontSize": "32px",
      "--sjs-article-font-large-textDecoration": "none",
      "--sjs-article-font-large-fontWeight": "700",
      "--sjs-article-font-large-fontStyle": "normal",
      "--sjs-article-font-large-fontStretch": "normal",
      "--sjs-article-font-large-letterSpacing": "0",
      "--sjs-article-font-large-lineHeight": "40px",
      "--sjs-article-font-large-paragraphIndent": "0px",
      "--sjs-article-font-large-textCase": "none",
      "--sjs-article-font-medium-fontSize": "24px",
      "--sjs-article-font-medium-textDecoration": "none",
      "--sjs-article-font-medium-fontWeight": "700",
      "--sjs-article-font-medium-fontStyle": "normal",
      "--sjs-article-font-medium-fontStretch": "normal",
      "--sjs-article-font-medium-letterSpacing": "0",
      "--sjs-article-font-medium-lineHeight": "32px",
      "--sjs-article-font-medium-paragraphIndent": "0px",
      "--sjs-article-font-medium-textCase": "none",
      "--sjs-article-font-default-fontSize": "16px",
      "--sjs-article-font-default-textDecoration": "none",
      "--sjs-article-font-default-fontWeight": "400",
      "--sjs-article-font-default-fontStyle": "normal",
      "--sjs-article-font-default-fontStretch": "normal",
      "--sjs-article-font-default-letterSpacing": "0",
      "--sjs-article-font-default-lineHeight": "28px",
      "--sjs-article-font-default-paragraphIndent": "0px",
      "--sjs-article-font-default-textCase": "none"
  },
  "themeName": "default",
  "colorPalette": "light",
  "backgroundImageFit": "cover",
  "backgroundImageAttachment": "scroll"
};
const survey = new Model(surveyJson);

const myCss = {
  // question: {
  //   content: 'sd-question__content question_content_custom',
  //   titleOnAnswer: 'question-title-answered'
  // },
  title: 'text-primary',
  navigationButton: 'btn btn-primary btn-lg',
  timerRoot: 'text-default',
  completedPage: 'sv-completedpage bg-transparent',

  radiogroup: {
    root: 'sv-selectbase',
    rootMultiColumn: 'sv-selectbase--multi-column',
    item: 'sv-item sv-radio sv-selectbase__item',
    itemOnError: 'sv-item--error',
    itemInline: 'sv-selectbase__item--inline',
    label: 'sd-selectbase__label text-default',
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

survey.applyTheme({
  "cssVariables": {
      // ...
  },
  "themeName": "doubleborder",

});

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
