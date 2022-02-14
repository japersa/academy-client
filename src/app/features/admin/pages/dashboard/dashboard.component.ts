import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { take } from 'rxjs/operators';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
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
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  public dataChartFix;

  subscription$: Subscription;

  constructor(private dashboardService: DashboardService) { }

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
    this.subscription$ = this.dashboardService
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
    this.subscription$ = this.dashboardService.getUsersByCount().pipe(take(1)).subscribe(
        (res) => {
          //debugger
          var data = res.avg_users_months[0];
          var currentMonth = new Date().getMonth();
          var count = 0;
          for(var i = 11; i >= 0 ; i--){
            if(data[i]!=undefined){
              this.dataChart.push(data[i].users)
            } else {
              this.dataChart.push(0)
            }
            count++
          }
          console.log(this.dataChart)
          
          this.dataChartFix = [
            this.dataChart[0],
            this.dataChart[1],
            this.dataChart[2],
            this.dataChart[3],
            this.dataChart[4],
            this.dataChart[5],
            this.dataChart[6],
            this.dataChart[7],
            this.dataChart[8],
            this.dataChart[9],
            this.dataChart[10],
            this.dataChart[11],
          ];
          return this.dataChartFix
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //Trae los cursos y los agrega al final del div del dashboard
  fillCourses(){
    this.subscription$ = this.dashboardService.getAdminCourses().pipe(take(1)).subscribe(res => {
      console.log(res);
      for(var j = 0; j < res.length; j++){
        //console.log(res[j])
        //Imagen del curso
        var imgCourse = res[j].path_preview_image
        var img = `<img src="`+imgCourse+`" alt="Curso de ????" style="max-height:100px; width: 100%; height:auto">`
        if (imgCourse=="Sin imagen"){
          img=``
        }
        //Titulo del curso
        var title = res[j].title
        if(title.length > 50){
          title = title.substring(0,50) + `...`
        }
        //Descripción del curso
        var description = res[j].description;
        var maxTextLimit = 70
        if (description.length > maxTextLimit) {
          description = description.substring(0, maxTextLimit) + `...`;
        }
        //var active=res[j].teacher.is_active
        //var isActive
        //var iconColor
        //if(active){
        //  isActive = "Activo"
        //  iconColor = `icon-minimal-right text-primary`;
        //} else {
        //  isActive = "Inactivo"
          //iconColor = `icon-alert-circle-exc text-danger`;
        //  iconColor = `icon-minimal-right text-primary`;
        //}
        const div = document.createElement('div');
        div.className = 'col-lg-3';
        div.id = 'course'
        div.innerHTML =
          `
          <div class=" card card-chart" style="height: 350px">
            <div class=" card-header" style="height:35%">
              ` +
          img +
          ` <hr/>
            </div>
          <div class=" card-body" style="height:30%">
          
            <h4 class=" card-title"> ` +
          title +
          `</h4>
          <p>`+description+`</p>
          </div>
          <div class="card-footer" style="height:30%">
            <hr />
            <div class="stats">
              <button class="btn btn-fill btn-primary btn-sm" type="submit">
                <!--<i class="tim-icons icon-pencil text-primary"> </i>--> Ver Curso
              </button>
            </div>
          </div>
        </div>`;
      document.getElementById('dashboard').appendChild(div)
      }
      

    
    },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
    //debugger
    this.getAdmins();
    this.setDataLabel();
    this.showGeneralStatistics();
    this.fillChart();
    this.fillCourses();
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(233,32,16,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };
    var chart_labels = this.dataLabel;
    this.datasets = [
      this.dataChart,
      //this.dataChartFix,
      /*[this.dataChart[0],
      this.dataChart[1],
      this.dataChart[2],
      this.dataChart[3],
      this.dataChart[4],
      this.dataChart[5],
      this.dataChart[6],
      this.dataChart[7],
      this.dataChart[8],
      this.dataChart[9],
      this.dataChart[10],
      this.dataChart[11],]*/
    ];
    this.data = this.datasets[0];

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    var config = {
      type: "line",
      data: {
        labels: chart_labels,
        datasets: [
          {
            label: "Nuevos usuarios",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: "#0AC116",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: "#0AC116",
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#0AC116",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: this.data
          }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.myChartData = new Chart(this.ctx, config);
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
