import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../../../../shared/services/courses.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit, OnDestroy {

  // COURSES
  courses = [];
  courseEdit = {};

  showFormCreateCourse = false;
  showFormEditCourse = false;

  // MODULES
  modules = [];
  moduleEdit = {};

  showFormCreateModule = false;
  showFormEditModule = false;

  // TOPICS
  topics = [];
  topicEdit = {};

  showFormCreateTopic = true;
  showFormEditTopic = false;

  // QUIZZES
  quizzes = [];
  quizEdit = {};

  showFormCreateQuizzes = false;
  showFormEditQuizzes = false;

  // OTHERS
  subscription$: Subscription;
  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscription5$: Subscription;
  subscription6$: Subscription;
  subscription7$: Subscription;
  subscription8$: Subscription;
  subscription9$: Subscription;

  subscriptions: Subscription[] = [];

  constructor(private coursesService: CoursesService) { }

  changeStateShow(value: boolean) {
    this.loadData()
    // Courses
    this.showFormCreateCourse = value;
    this.showFormEditCourse = value;
    // Modules
    this.showFormCreateModule = value;
    this.showFormEditModule = value;
    // Topics
    this.showFormCreateTopic = value;
    this.showFormEditTopic = value;
    // Topics
    this.showFormCreateQuizzes = value;
    this.showFormEditQuizzes = value;
  }

  // COURSES

  createCourse() {
    this.showFormCreateCourse = !this.showFormCreateCourse;
  }

  editCourse(course: object) {
    this.courseEdit = course;
    this.showFormEditCourse = !this.showFormEditCourse;
  }

  deleteCourse(courseId: string) {

    swal
      .fire({
        title: 'Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {

          this.subscription1$ = this.coursesService.deleteCourse(courseId).pipe(take(1)).subscribe(res => {
            this.loadData();
            swal.fire({
              title: 'Eliminado!',
              text: 'La orden ha sido ejecutada',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success',
              },
              buttonsStyling: false
            })
          },
            error => {
              console.log('error ' + error.error);
            });

        } else {
          swal.fire({
            title: 'Cancelado',
            text: 'No hemos eliminado nada :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info',
            },
            buttonsStyling: false
          });
          return false
        }
      });


  }

  // Modules

  createModule() {
    this.showFormCreateModule = !this.showFormCreateModule;
  }

  getModulesByCourseId(courseId: string) {

    this.subscription7$ = this.coursesService.getModulesByCourseId(courseId).pipe(take(1)).subscribe(res => {
      this.modules.length = 0;
      Object.assign(this.modules, res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  editModule(module: object) {
    this.moduleEdit = module;
    this.showFormEditModule = !this.showFormEditModule;
  }

  deleteModule(moduleId: string) {

    swal
      .fire({
        title: 'Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {

          this.subscription1$ = this.coursesService.deleteModule(moduleId).pipe(take(1)).subscribe(res => {
            this.loadData();
            swal.fire({
              title: 'Eliminado!',
              text: 'La orden ha sido ejecutada',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success',
              },
              buttonsStyling: false
            })
          },
            error => {
              console.log('error ' + error.error);
            });

        } else {
          swal.fire({
            title: 'Cancelado',
            text: 'No hemos eliminado nada :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info',
            },
            buttonsStyling: false
          });
          return false
        }
      });

  }

  // Topics

  createTopic() {
    this.showFormCreateTopic = !this.showFormCreateTopic;
  }

  getTopicByModuleId(courseId: string) {

    this.subscription8$ = this.coursesService.getTopicsByModuleId(courseId).pipe(take(1)).subscribe(res => {
      this.topics.length = 0;
      Object.assign(this.topics, res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  editTopic(topic: object) {
    this.topicEdit = topic;
    this.showFormEditTopic = !this.showFormEditTopic;
  }

  deleteTopic(topicId: string) {

    swal
      .fire({
        title: 'Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {

          this.subscription1$ = this.coursesService.deleteTopic(topicId).pipe(take(1)).subscribe(res => {
            this.loadData();
            swal.fire({
              title: 'Eliminado!',
              text: 'La orden ha sido ejecutada',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success',
              },
              buttonsStyling: false
            })
          },
            error => {
              console.log('error ' + error.error);
            });

        } else {
          swal.fire({
            title: 'Cancelado',
            text: 'No hemos eliminado nada :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info',
            },
            buttonsStyling: false
          });
          return false
        }
      });

  }

  // QUIZZES

  createQuiz() {
    this.showFormCreateQuizzes = !this.showFormCreateQuizzes;
  }

  getQuizzesByCourseId(courseId: string) {

    this.subscription9$ = this.coursesService.getQuizzesByCourseId(courseId).pipe(take(1)).subscribe(res => {
      this.quizzes.length = 0;
      Object.assign(this.quizzes, res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  editQuiz(quiz: object) {
    this.quizEdit = quiz;
    this.showFormEditQuizzes = !this.showFormEditQuizzes;
  }

  deleteQuiz(quizId: string) {

    swal
      .fire({
        title: 'Estas seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '¡Sí, bórralo!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false
      })
      .then(result => {
        if (result.value) {

          this.subscription6$ = this.coursesService.deleteQuiz(quizId).pipe(take(1)).subscribe(res => {
            this.loadData();
            swal.fire({
              title: 'Eliminado!',
              text: 'La orden ha sido ejecutada',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-success',
              },
              buttonsStyling: false
            })
          },
            error => {
              console.log('error ' + error.error);
            });

        } else {
          swal.fire({
            title: 'Cancelado',
            text: 'No hemos eliminado nada :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-info',
            },
            buttonsStyling: false
          });
          return false
        }
      });


  }

  loadData() {

    this.courses.length = 0;
    this.modules.length = 0;
    this.topics.length = 0;
    this.quizzes.length = 0;

    // GET COURSES
    this.subscription$ = this.coursesService.getCourses().subscribe(res => {
      Object.assign(this.courses, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )
    // GET MODULES
    this.subscription2$ = this.coursesService.getModules().subscribe(res => {
      Object.assign(this.modules, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )
    // GET TOPICS
    this.subscription3$ = this.coursesService.getTopics().subscribe(res => {
      Object.assign(this.topics, res);
      console.log(res);
      
    },
      error => {
        console.log('Error: ', error);
      }
    )
    // GET QUIZZES
    this.subscription5$ = this.coursesService.getQuizzes().subscribe(res => {
      Object.assign(this.quizzes, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )

  }

  // Tracks
  // trackCourse(index, c) {
  //   return c.id
  // }
  // trackModule(index, m) {
  //   return m.id
  // }
  // trackTopics(index, t) {
  //   return t.id
  // }
  // trackQuiz(index, q) {
  //   return q.id
  // }

  ngOnInit(): void {
    this.loadData();

    // Subs
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
    this.subscriptions.push(this.subscription3$);
    this.subscriptions.push(this.subscription4$);
    this.subscriptions.push(this.subscription5$);
    this.subscriptions.push(this.subscription6$);
    this.subscriptions.push(this.subscription7$);
    this.subscriptions.push(this.subscription8$);
    this.subscriptions.push(this.subscription9$);

  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

}
