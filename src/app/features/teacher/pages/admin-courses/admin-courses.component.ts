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

  showFormCreateTopic = false;
  showFormEditTopic = false;

  // QUIZZES
  quizzes = [];
  quizEdit = {};

  showFormCreateQuizzes = false;
  showFormEditQuizzes = false;

  constructor(private coursesService: CoursesService) { }

  changeStateShow(value: boolean) {
    this.loadData();
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

          this.coursesService.deleteCourse(courseId).subscribe(res => {
            this.loadCourses();
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

    this.coursesService.getModulesByCourseId(courseId).subscribe(res => {
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

          this.coursesService.deleteModule(moduleId).subscribe(res => {
            this.loadModules();
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

    this.coursesService.getTopicsByModuleId(courseId).subscribe(res => {
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

          this.coursesService.deleteTopic(topicId).subscribe(res => {
            this.loadTopics();
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

    this.coursesService.getQuizzesByCourseId(courseId).subscribe(res => {
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

          this.coursesService.deleteQuiz(quizId).subscribe(res => {
            this.loadQuizes();
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

  loadCourses() {
    // GET COURSES
    this.coursesService.getCourses().subscribe(res => {
      this.courses = res.my_courses_created;
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }

  loadModules() {
    // GET MODULES
    this.coursesService.getModules().subscribe(res => {
      this.modules = res;
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }

  loadTopics() {
    // GET TOPICS
    this.coursesService.getTopics().subscribe(res => {
      this.topics = res;
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }

  loadQuizes() {

    // GET QUIZZES
    this.coursesService.getQuizzes().subscribe(res => {
      this.quizzes = res;
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }

  loadData() {

    this.loadCourses();
    this.loadModules();
    this.loadTopics();
    this.loadQuizes();

  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
  }

}
