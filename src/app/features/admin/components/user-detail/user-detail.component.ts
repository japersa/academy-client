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
            this.packages =  this.user.packages; 
            console.log(this.user);
            console.log(this.packagesActive.length);
            console.log(this.user.packages);
            
            
          },
          error: e => console.log('error ' + e.error)
        }
      );
    });
  }
}
