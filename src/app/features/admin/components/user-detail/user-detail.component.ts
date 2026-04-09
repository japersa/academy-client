import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {


  buttonText = 'Copiar';

  userId: string | null = null;
  user: any = null;
  packages: any[] = [];
  packagesActive: any[] = [];
  packAgActived: any[] = [];
  packAgActive: string = 'Inactivo';
  loadError: string | null = null;

  agActivete() {
    if (this.packAgActived.length > 0) {
      this.packAgActive = 'Activo';
    }
  }

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
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
    if (!this.packages?.length) {
      return;
    }
    for (const order of this.packages) {
      try {
        order.balance = this.convertBalanceToNumber(order.balance);
      } catch {
        /* balance opcional / otro formato */
      }
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

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('id');
      if (!this.userId) {
        return;
      }
      this.loadError = null;
      this.dashboardService.getUsersById(this.userId).subscribe({
        next: r => {
          this.user = r;
          const pkgs = Array.isArray(this.user.packages) ? this.user.packages : [];
          const selfMgmt = Array.isArray(this.user.packages_self_management)
            ? this.user.packages_self_management
            : [];
          this.packagesActive = pkgs.filter((pkg: any) => pkg.status === 'active');
          this.packAgActived = selfMgmt.filter((pkg: any) => pkg.status === 'active');
          this.packages = pkgs;
          this.convertBalancesToNumbers();
          this.agActivete();
        },
        error: err => {
          this.user = null;
          this.loadError =
            err?.error?.detail ||
            err?.error?.message ||
            'No se pudo cargar el usuario.';
        },
      });
    });



  }
}
