import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { take } from 'rxjs/operators';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit, OnDestroy {

  userEdit = {};
  showFormCreateUser = false;
  showFormEditUser = false;
  role = 'administradores'
  users = [];

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscription4$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private dashboardService: DashboardService) {
  }

  createUser() {
    this.showFormCreateUser = !this.showFormCreateUser;
  }

  editUser(user: object) {
    this.userEdit = user;
    this.showFormEditUser = !this.showFormCreateUser;
  }

  changeStateShow(value: boolean) {
    this.showFormCreateUser = value;
    this.showFormEditUser = value;
  }


  getAdmins() {
    this.users.length = 0;
    this.role = 'administradores'
    this.subscription1$ = this.dashboardService.getUsersByRole(ROLES_ENUM.ADMIN).pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  getStudents() {
    this.users.length = 0;
    this.role = 'estudiantes'
    this.subscription2$ = this.dashboardService.getUsersByRole(ROLES_ENUM.STUDENT).pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  getTeachers() {
    this.users.length = 0;
    this.role = 'profesores'
    this.subscription3$ = this.dashboardService.getUsersByRole(ROLES_ENUM.TEACHER).pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log('error ' + error.error);
      });
  }

  deleteUser(userId: string) {

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

          this.subscription4$ = this.dashboardService.deleteUser(userId).pipe(take(1)).subscribe(res => {

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

    this.getAdmins();

    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
    this.subscriptions.push(this.subscription3$);
    this.subscriptions.push(this.subscription4$);

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }

}
