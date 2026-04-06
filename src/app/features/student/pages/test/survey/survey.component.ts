import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Model, StylesManager, SurveyNG } from 'survey-angular';
import { CoursesService } from '../../../../../shared/services/courses.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../../core/services/notifications.service';


interface Question {
  answer: string;
  question: string;
  optionOne: string;
  optionTwo: string;
  optionThree: string;
  optionFour: string;
}

interface QuizResponse {
  id: number;
  course_id: number;
  course_name: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}


StylesManager.applyTheme('modern');
// CSS references
// https://github.com/surveyjs/survey-library/blob/master/src/defaultCss/cssmodern.ts
const myCss = {

  title: 'text-primary',
  navigationButton: 'btn btn-primary btn-lg',
  timerRoot: 'text-white',
  completedPage: 'sv-completedpage bg-transparent',
  progressBar: "sv-progress__bar btn-primary",

  question: {
    titleOnAnswer: "sv-question__title--answer btn-primary",
    itemChecked: "sv-radio--checked btn-primary",
  },

  radiogroup: {
    root: 'sv-selectbase',
    rootMultiColumn: 'sv-selectbase--multi-column',
    item: 'sv-item sv-radio sv-selectbase__item',
    itemOnError: 'sv-item--error',
    itemInline: 'sv-selectbase__item--inline',
    label: 'sd-selectbase__label text-white',
    labelChecked: '',
    itemDisabled: 'sv-item--disabled sv-radio--disabled',
    itemChecked: 'sv-item--checked sv-radio--checked ',
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

  @Input() courseId: string | null = null;

  test: QuizResponse | null = null;

  json = {
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

  private transformQuestion(q: Question, index: number) {
    // Filter out empty choices
    const choices = [q.optionOne, q.optionTwo, q.optionThree, q.optionFour]
      .filter(choice => choice !== '');

    // Store the correct answer value directly
    const correctAnswer = q[q.answer as keyof Question] as string;

    return {
      questions: [
        {
          type: 'radiogroup',
          name: `question_${index}`, // More stable naming
          title: q.question,
          choicesOrder: 'random',
          choices,
          correctAnswer // This matches the actual value, not the property name
        }
      ]
    };
  }

  private putQuestions(): void {
    if (!this.test?.questions) return;

    // Clear existing questions except the first intro page
    this.json.pages = this.json.pages.slice(0, 1);

    // Transform and add each question
    this.test.questions.forEach((question, index) => {
      const transformedQuestion = this.transformQuestion(question, index);
      this.json.pages.push((transformedQuestion as any));
    });
  }

  private handleQuizCompletion(survey: Model): void {
    const result = survey.data;
    const correctAnswers = survey.getCorrectedAnswerCount();
    const totalQuestions = survey.getQuizQuestionCount();
    const isApproved = correctAnswers / totalQuestions >= 0.8;

    console.log('Quiz Results:', {
      answers: result,
      correct: correctAnswers,
      total: totalQuestions,
      isApproved
    });

    if (isApproved) {
      this.handleApprovedCourse();
    } else {
      this.handleFailedCourse();
    }
  }

  private handleApprovedCourse(): void {
    if (!this.courseId) return;

    this.coursesService.approveCourse(this.courseId).subscribe({
      next: () => {
        this.notificationsService.showNotification(
          'bottom',
          'center',
          'Curso aprobado con éxito',
          2
        );
        setTimeout(() => this.router.navigate(['/profile']), 1000);
      },
      error: (error) => {
        console.error('Error approving course:', error);
        this.notificationsService.showNotification(
          'bottom',
          'center',
          'Error al aprobar el curso',
          4
        );
      }
    });
  }

  private handleFailedCourse(): void {
    this.notificationsService.showNotification(
      'bottom',
      'center',
      'Curso no aprobado',
      4
    );
    setTimeout(() => this.router.navigate(['/referrals']), 1000);
  }

  getTest(courseId: string): void {
    this.coursesService.getQuizzesByCourseId(courseId).subscribe({
      next: (response: QuizResponse[]) => {
        if (!response?.length) {
          this.notificationsService.showNotification(
            'bottom',
            'center',
            'Curso no encontrado',
            4
          );
          return;
        }
        this.test = response[0];
        this.json.title = this.test.course_name;
        this.putQuestions();
        this.initializeSurvey();
      },
      error: (error) => {
        console.error('Failed to load quiz:', error);
        this.notificationsService.showNotification(
          'bottom',
          'center',
          'Error cargando el quiz',
          4
        );
      }
    });
  }

  private initializeSurvey(): void {
    const survey = new Model(this.json);
    survey.locale = 'es';

    SurveyNG.render('surveyElement', {
      model: survey,
      css: myCss
    });

    survey.onComplete.add((sender) => this.handleQuizCompletion((sender as any)));
  }

  ngOnInit(): void {
    if (this.courseId) {
      this.getTest(this.courseId);
    }
  }
}