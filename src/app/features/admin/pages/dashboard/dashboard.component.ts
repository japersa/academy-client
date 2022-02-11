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
          return this.dataChart
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
        console.log(res[j])
        var firstName = res[j].teacher.first_name
        var lastName = res[j].teacher.last_name
        var profilePic = res[j].teacher.image_profile;
        var imgProfile = res[j].path_preview_image
        var img = `<img src="`+imgProfile+`" alt="Curso de ????" style="max-height:100px;">`
        if (imgProfile=="Sin imagen"){
          img=``
        }
        var description = res[j].description
        if(description.length > 10){
          description = description.substring(0,50) + `...`
        }
        var active=res[j].teacher.is_active
        var isActive
        var iconColor
        if(active){
          isActive = "Activo"
          iconColor = `icon-minimal-right text-primary`;
        } else {
          isActive = "Inactivo"
          //iconColor = `icon-alert-circle-exc text-danger`;
          iconColor = `icon-minimal-right text-primary`;
        }
        const div = document.createElement('div');
        div.className = 'col-lg-3';
        div.innerHTML =
          `
          <div class=" card card-chart">
            <div class=" card-header">
              <h5 class=" card-category">
                <span><img class="rounded-circle" src="` +
          profilePic +
          `" style="max-height:35px;"></img></span>     ` +
          firstName +
          ` ` +
          lastName +
          `</h5><hr/>
              ` +
          img +
          `
            </div>
          <div class=" card-body">
          
            <h4 class=" card-title">
                <i class=" tim-icons `+iconColor+`"> </i> ` +
          description +
          `</h4>
          </div>
          <div class="card-footer">
            <hr />
            <div class="stats">
              <button class="btn btn-simple btn-primary btn-sm" type="submit">
                <i class="tim-icons icon-pencil text-primary"> </i> Editar Curso
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

    /*var gradientChartOptionsConfigurationWithTooltipBlue: any = {
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
              fontColor: "#2380f7"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#2380f7"
            }
          }
        ]
      }
    };*/

    /*var gradientChartOptionsConfigurationWithTooltipPurple: any = {
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
              color: "rgba(225,78,202,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };*/

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

    /*var gradientChartOptionsConfigurationWithTooltipOrange: any = {
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
              suggestedMin: 50,
              suggestedMax: 110,
              padding: 20,
              fontColor: "#ff8a76"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(220,53,69,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#ff8a76"
            }
          }
        ]
      }
    };*/

    /*var gradientChartOptionsConfigurationWithTooltipGreen: any = {
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
              suggestedMin: 50,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(0,242,195,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };*/

    /*var gradientBarChartConfiguration: any = {
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
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 120,
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ],

        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e"
            }
          }
        ]
      }
    };*/

    /*this.canvas = document.getElementById("chartLineRed");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors*/



    /*var data = {
      labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
      datasets: [
        {
          label: "Data",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#ec250d",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#ec250d",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#ec250d",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [80, 100, 70, 80, 120, 80]
        }
      ]
    };*/

    /*var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipRed
    });*/

    /*this.canvas = document.getElementById("chartLineGreen");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors*/

    /*var data = {
      labels: ["JUL", "AUG", "SEP", "OCT", "NOV"],
      datasets: [
        {
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#00d6b4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#00d6b4",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#00d6b4",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [90, 27, 60, 12, 80]
        }
      ]
    };*/

    /*var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen
    });*/

    var chart_labels = this.dataLabel;
    this.datasets = [
      this.dataChart,
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
            label: "My First dataset",
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

    //this.canvas = document.getElementById("CountryChart");
    //this.ctx = this.canvas.getContext("2d");
    //var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    //gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    //gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    //gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    /*var myChart = new Chart(this.ctx, {
      type: "bar",
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ["USA", "GER", "AUS", "UK", "RO", "BR"],
        datasets: [
          {
            label: "Countries",
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: "#1f8ef1",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: [53, 20, 10, 80, 100, 45]
          }
        ]
      },
      options: gradientBarChartConfiguration
    });*/
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
