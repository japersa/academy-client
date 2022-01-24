import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  role = 'administradores'
  users = [];

  subscription$: Subscription;

  constructor(private dashboardService: DashboardService) { }

  getAdmins() {
    this.users.length = 0;
    this.role = 'administradores'
    this.subscription$ = this.dashboardService.getAdmins().pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log(error);
      });
  }

  getStudents() {
    this.users.length = 0;
    this.role = 'estudiantes'
    this.subscription$ = this.dashboardService.getStudents().pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log(error);
      });
  }

  getTeachers() {
    this.users.length = 0;
    this.role = 'profesores'
    this.subscription$ = this.dashboardService.getTeachers().pipe(take(1)).subscribe(res => {
      this.users.push(...res)
    },
      error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
    this.getAdmins();
  }

}
