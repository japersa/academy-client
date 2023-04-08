import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { take } from 'rxjs/operators';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}

@Component({
  selector: 'app-admins',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  userEdit = {};
  showFormCreateUser = false;
  showFormEditUser = false;
  role: ROLES_ENUM = ROLES_ENUM.ALL;
  users = [];

  rows: any = [];

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;

  constructor(private dashboardService: DashboardService,
    private _Activatedroute: ActivatedRoute
  ) { }

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
    // this.getAll();
  }


  getUsers() {
    this.users.length = 0;

    this.dashboardService.getUsersByRole({ rol: this.role }).subscribe(
      {
        next: r => {
          this.rows = r?.results;
          console.log(this.rows);
        },
        error: e => console.log('error ' + e.error)
      }
    );
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

          this.dashboardService.deleteUser(userId).subscribe(res => {

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

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  filterTable($event) {
    let val = $event.target.value;
    this.temp = this.rows.filter(function (d) {
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params => {
      this.role = params['role'];
      this.getUsers();
    });
  }

  ngOnDestroy(): void {
  }

}
