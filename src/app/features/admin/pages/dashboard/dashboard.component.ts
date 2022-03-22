import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
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
  public dataChart = [];
  public dataLabel = [
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
  public dataChartFix;

  courses = [];

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscription3$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(private dashboardService: DashboardService, private router: Router) { }

  getAdmins() {

    // this.subscription$ = this.dashboardService.getAdmins().pipe(take(1)).subscribe(res => {
    //   console.log(res);

    // },
    //   error => {
    //     console.log(error);
    //   });
  }

  //Muestra el total de alumnos, docentes y administradores
  showGeneralStatistics() {
    this.subscription3$ = this.dashboardService
      .getUsersByCount()
      .pipe(take(1))
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
  //Le dá los valores a los labels de la gráfica de nuevos usuarios
  setDataLabel() {
    var currentMonth = new Date().getMonth();
    var normalYear = this.dataLabel;
    var moddedYear = [];
    var variableMonth = currentMonth;
    for (var i = normalYear.length - 1; i >= 0; i--) {
      moddedYear[i] = normalYear[variableMonth];
      variableMonth = variableMonth - 1;
      if (variableMonth < 0) {
        variableMonth = 11;
      }
      if (variableMonth == currentMonth) {
        break;
      }
    }
    this.dataLabel = moddedYear;
    return this.dataLabel;
  }
  //Llena la gráfica con la información de nuevos usuarios por mes
  fillChart() {
    this.subscription2$ = this.dashboardService.getUsersByCount().pipe(take(1)).subscribe(
      (res) => {
        //debugger
        var data = res.avg_users_months[0];
        var currentMonth = new Date().getMonth();
        var count = 0;
        for (var i = 11; i >= 0; i--) {
          if (data[i] != undefined) {
            this.dataChart.push(data[i].users)
          } else {
            this.dataChart.push(0)
          }
          count++
        }

        this.dataChartFix = [
          '' + this.dataChart[0],
          '' + this.dataChart[1],
          '' + this.dataChart[2],
          '' + this.dataChart[3],
          '' + this.dataChart[4],
          '' + this.dataChart[5],
          '' + this.dataChart[6],
          '' + this.dataChart[7],
          '' + this.dataChart[8],
          '' + this.dataChart[9],
          '' + this.dataChart[10],
          '' + this.dataChart[11],
        ];
        return this.dataChartFix
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fillCourses() {
    this.subscription1$ = this.dashboardService.getAdminCourses().pipe(take(1)).subscribe(res => {

      Object.assign(this.courses, res);

    },
      error => {
        console.log(error);
      });
  }

  goToCourseDetail(id: string) {

    this.router.navigate([`/courses/${id}`])

  }

  ngOnInit() {
    //debugger
    this.getAdmins();
    this.setDataLabel();
    this.showGeneralStatistics();
    this.fillChart();
    this.fillCourses();

    // Subs
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
    this.subscriptions.push(this.subscription3$);

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: 'nearest',
        intersect: 0,
        position: 'nearest'
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: '#9a9a9a'
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(233,32,16,0.1)',
              zeroLineColor: 'transparent'
            },
            ticks: {
              padding: 20,
              fontColor: '#9a9a9a'
            }
          }
        ]
      }
    };
    var chart_labels = this.dataLabel;
    this.datasets =
      // this.dataChart,
      //this.dataChartFix,
      [parseInt(this.dataChart[0], 10),
      parseInt(this.dataChart[1], 10),
      parseInt(this.dataChart[2], 10),
      parseInt(this.dataChart[3], 10),
      parseInt(this.dataChart[4], 10),
      parseInt(this.dataChart[5], 10),
      parseInt(this.dataChart[6], 10),
      parseInt(this.dataChart[7], 10),
      parseInt(this.dataChart[8], 10),
      parseInt(this.dataChart[9], 10),
      parseInt(this.dataChart[10], 10),
      parseInt(this.dataChart[11], 10),]
      ;
    // this.data = this.datasets;
    // this.data = ["1",2,3,4,4,5,6,7,8,9,"10","11"];
    // this.data = this.dataChart;
    this.data = this.dataChartFix;

    this.canvas = document.getElementById('chartBig1');
    this.ctx = this.canvas.getContext('2d');

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var config = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: [
          {
            label: 'Nuevos usuarios',
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#0AC116',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#0AC116',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#0AC116',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6]
            // this.dataChart
          },
        ],
      },
      options: gradientChartOptionsConfigurationWithTooltipRed,
    };
    this.myChartData = new Chart(this.ctx, config);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
