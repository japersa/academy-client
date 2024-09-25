import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public chart: any;
  public dataChart: Array<string> = [];
  public labelChart: Array<string> = [];
  public months = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

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
          res.avg_users_months[0].forEach(e => {
            let d = new Date(e.date);
            this.labelChart.push(this.months[d.getMonth()]);
            this.dataChart.push(e.users);

          });
          this.total_students = res.total_students;
          this.total_admins = res.total_admins;
          this.total_teachers = res.total_teachers;
          this.createChart();

        },
        (error) => {
          console.log(error);
        }
      );
  };

  createChart() {

    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        // labels: this.labelChart,
        labels: this.labelChart,
        datasets: [
          {
            label: 'Nuevos usuarios',
            fill: true,
            borderColor: '#d0ad50',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d0ad50',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#DD0005',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.dataChart,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Usuarios registrados por mes'
          }
        }
      },

    });
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
