import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  role: string = null;

  featuresVIP: object[] = [
    {
      title: "Acceso a todos los cursos",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Autogestión de Fondos",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Seguro de capital",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Contrato digital",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Monitoreo 24/7",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Software MetaTrader 5",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Soporte 24/7",
      icon: "tim-icons icon-check-2 icon-primary"
    },
  ];

  featuresFull: object[] = [
    {
      title: "Acceso a curso básico",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Autogestión de Fondos",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Seguro de capital",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Contrato digital",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Monitoreo 24/7",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Software MetaTrader 5",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Soporte 24/7",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    // {
    //   title: "Alianzas comerciales",
    //   icon: "tim-icons icon-simple-remove icon-primary"
    // },
  ]

  constructor(public userDataService: UserDataService) {
    this.role = this.userDataService.userData$.value.subscription;
    console.log(this.role);

  }

  ngOnInit(): void {
  }

}
