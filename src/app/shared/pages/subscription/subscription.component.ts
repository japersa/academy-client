import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  role: string = null;

  /** IPN hacia el backend Django (`/full/payment/`). */
  readonly coinpaymentsIpnUrl = `${environment.apiURL.replace(/\/$/, '')}/full/payment/`;
  coinpaymentsSuccessUrl = '';
  coinpaymentsCancelUrl = '';

  readonly logoStartAcademy =
    'https://res.cloudinary.com/ddw7odxzr/image/upload/v1719765038/RC_11326_Logo_Final_Start_Academy_Alex_Logotipo_Negativo_ku9htb.png';

  featuresVIP: object[] = [
    {
      title: "Acceso a todos los cursos",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Academia",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Educación Básica",
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
      title: "Academia",
      icon: "tim-icons icon-check-2 icon-primary"
    },
    {
      title: "Educación Básica",
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
    //   title: "educación intermedia",
    //   icon: "tim-icons icon-simple-remove icon-primary"
    // },
  ]

  constructor(public userDataService: UserDataService) {
    this.role = this.userDataService.userData$.value.subscription;
    console.log(this.role);

  }

  ngOnInit(): void {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    this.coinpaymentsSuccessUrl = `${origin}/referrals`;
    this.coinpaymentsCancelUrl = `${origin}/cancel`;
  }

}
