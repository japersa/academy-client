import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../../shared/services/courses.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';


@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {

  // COURSES
  courses = [];
  courseEdit = {};

  showFormCreateCourse = false;
  showFormEditCourse = false;

  // OTHERS
  subscription$: Subscription;
  subscription1$: Subscription;

  constructor(private coursesService: CoursesService) { }

  changeStateShow(value: boolean) {
    this.showFormCreateCourse = value;
    this.showFormEditCourse = value;
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

  ngOnInit(): void {
    this.subscription$ = this.coursesService.getCourses().pipe(take(1)).subscribe(res => {
      console.log(res);
      Object.assign(this.courses, res);
    },
      error => {
        console.log('Error: ', error);
      }
    )
  }

}
