import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public total_students: number = 0;
  public total_admins: number = 0;
  public total_teachers: number = 0;
 

  courses = [];

  constructor(private dashboardService: DashboardService, private router: Router) { }

  // Muestra el total de alumnos, docentes y administradores
  showGeneralStatistics() {
    this.dashboardService
      .getUsersByCount()
      .subscribe(
        (res) => {
          this.total_students = res.total_students;
          this.total_admins = res.total_admins;
          this.total_teachers = res.total_teachers;
        },
        (error) => {
          console.log(error);
        }
      );
  }



  getCourses() {
    this.dashboardService.getAdminCourses().subscribe(res => {
      Object.assign(this.courses, res);
    },
      error => {
        console.log(error);
      });
  }

  goToCourseDetail(id: string) {
    this.router.navigate([`/course/${id}`])
  }

  ngOnInit() {
    this.showGeneralStatistics();
    this.getCourses();
  }

  ngOnDestroy(): void {
  }

}
