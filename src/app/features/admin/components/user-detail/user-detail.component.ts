import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('id');
      this.dashboardService.getUsersById(this.userId).subscribe(
        {
          next: r => { 
            this.user = r;
            this.packagesActive = this.user.packages.filter(pkg => pkg.status === 'active');
            this.packAgActived = this.user.packages_self_management.filter(pkg => pkg.status === 'active');
            this.packages =  this.user.packages; 
            console.log(this.packAgActived);
            this.agActivete();
          },
          error: e => console.log('error ' + e.error)
        }
      );
    });
  }
}
