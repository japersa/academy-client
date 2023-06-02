import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import swal from 'sweetalert2';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-admins',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  bsRangeValue: Date[] = null;

  bsConfig?: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'YYYY-MM-DD',
    useUtc: true,
    showClearButton: true
  }

  @ViewChild('search') input!: ElementRef;

  userEdit = {};
  showFormCreateUser = false;
  showFormEditUser = false;
  role: ROLES_ENUM = undefined;

  rows: any = [];
  activeRow: any;
  entries: number = 10;
  selected: any[] = [];
  temp = [];

  options = {};

  constructor(private dashboardService: DashboardService,
    private route: ActivatedRoute
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
  }

  filterTable($event: any) {
    let val = $event.target.value;
    this.temp = this.rows.filter(function (d: any) {
      for (var key in d) {
        if (d[key].toString().toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  getUsers() {

    this.dashboardService.getUsersByRole(this.options).subscribe(
      {
        next: r => {
          this.rows = r?.results;
          this.rows.forEach((e: any) => (e['demo_package'] = 'null'));
          this.temp = r?.results;

          this.temp = this.rows.map((prop: any, key: any) => {
            return {
              ...prop,
              idx: key,
            };
          });

        },
        error: e => console.log('error ' + e.error)
      }
    );
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  resetFilters() {
    this.entries = 10;
    this.options['rol'] = this.role;
    this.bsRangeValue = null;

    delete this.options['since'];
    delete this.options['until'];

    this.getUsers();
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
            this.getUsers();
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

  onValueChange(value: Date[]): void {
    if (value) {
      const date = value.map(item => item.toISOString());
      this.options['since'] = date[0];
      this.options['until'] = date[1];
      this.getUsers();
    }
  };



  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.role = params.get('role') as ROLES_ENUM;
      this.options['rol'] = params.get('role');
      this.getUsers();
    });
  }

}
