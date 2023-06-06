import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { PackagesService } from '../../services/packages.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {


  buttonText = 'Copiar';

  userId: string = null;
  user = null;
  packages: any [] = null;
  packagesActive: any [] = null;
  packAgActived: any [] = null;
  packAgActive: string = 'Inactivo';

  agActivete() {
    if(this.packAgActived.length > 0){
      this.packAgActive = 'Activo';
    }
  }

  constructor(private dashboardService: DashboardService,
              private route: ActivatedRoute,
              private packsServices: PackagesService
  ) { }

  copied() {
    this.buttonText = 'Copiado';
  } 


  convertBalanceToNumber(balance: string): string {
    switch(balance) {
      case 'one_hundred_thousand':
        return '100.000'; 
      case 'fifty_thousand':
        return '50.000';
      case 'two_hundred_thousand':
        return '200.000';
      case 'five_hundred_thousand':
        return '500.000';
      default:
        throw new Error('Balance string not recognized'); 
    }
  }

  convertBalancesToNumbers(): void {
    for (const order of this.packages) {
      order.balance = this.convertBalanceToNumber(order.balance);
    }
  }

/*   add(fechaCreacion: Date) {
    const fechaFinalizacion = new Date(fechaCreacion.getTime() + 15 * 24 * 60 * 60 * 1000);
    const paquete: Paquete = {
      fechaCreacion: fechaCreacion,
      fechaFinalizacion: fechaFinalizacion
    };
    this.paquetes.push(paquete);
  } */


  ngOnInit(): void {

    this.packsServices.getPackagesById('4').subscribe(
      {
        next: pack => {
          console.log(pack);
          
      },
        error: e => console.log(e)
      }
    );
 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('id');
      this.dashboardService.getUsersById(this.userId).subscribe(
        {
          next: r => { 
            this.user = r;
            this.packagesActive = this.user.packages.filter(pkg => pkg.status === 'active');
            this.packAgActived = this.user.packages_self_management.filter(pkg => pkg.status === 'active');
            this.packages =  this.user.packages;
            this.convertBalancesToNumbers(); 
            console.log(this.packages); 
            console.log(this.packAgActived); 
            this.agActivete();
            
          },
          error: e => console.log('error ' + e.error)
        }
      );
    });



  }
}
