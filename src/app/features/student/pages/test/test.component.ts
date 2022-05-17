import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoursesService } from '../../../../shared/services/courses.service';
import { Model, StylesManager, SurveyNG } from 'survey-angular';
// import 'survey-angular/survey.css';
import { NotificationsService } from '../../../../core/services/notifications.service';

StylesManager.applyTheme('modern');

const myCss = {
  question: {
    title: 'question_content_custom'
  }
};


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  courseId = '';

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
            html: 'Estás a punto de comenzar el cuestionario. <br/>Tiene 180 segundos por pregunta y 30 minutos para completar el cuestionario.<br/>Presiona en <b>\'Iniciar evaluación\'</b> cuando esté listo.'
          }
        ]
      }
    ],
    completedHtml: '<h4>Usted obtuvo <b>{correctedAnswers}</b> preguntas correctas de <b>{questionCount}</b>.</h4>'

  };

  // @Output() submitSurvey = new EventEmitter<any>();
  // @Input()
  result: any;

  constructor(
    private route: ActivatedRoute,
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
                    this.router.navigate([`/home`])
                  }, 20000)
                }
              });
            } else {
              this.notificationsService.showNotification('bottom', 'center', 'Curso no aprobado con éxito', 2);
              setTimeout(() => {
                this.router.navigate([`/home`])
              }, 20000)
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

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.courseId = id;
      this.getTest(id);
    });

  }



}
