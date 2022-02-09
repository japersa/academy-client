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

  // OTHERS
  subscription$: Subscription;
  subscription1$: Subscription;
  subscription2$: Subscription;

  subscriptions: Subscription[] = [];

  constructor(private coursesService: CoursesService) { }

  changeStateShow(value: boolean) {
    // Courses
    this.showFormCreateCourse = value;
    this.showFormEditCourse = value;
    // Modules
    this.showFormCreateModule = value;
    this.showFormEditModule = value;
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

  ngOnInit(): void {
    // Subs
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);

    // GET COURSES
    this.subscription$ = this.coursesService.getCourses().pipe(take(1)).subscribe(res => {
      Object.assign(this.courses, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )
    // GET MODULES
    this.subscription2$ = this.coursesService.getModules().pipe(take(1)).subscribe(res => {
      Object.assign(this.modules, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

}
