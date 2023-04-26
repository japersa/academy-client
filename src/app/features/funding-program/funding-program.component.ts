import { Component, OnInit } from '@angular/core';
import { PacksService } from './services/packs.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/core/services/user-data.service';
 
@Component({
  selector: 'app-trading-area',
  templateUrl: './funding-program.component.html',
  styleUrls: ['./funding-program.component.scss']
})
export class FundingProgramComponent implements OnInit {

  referalCode = '0000000';
  myPackages: any[] = [];

  constructor(
    private packsService: PacksService,
    private router: Router,
    public userDataService: UserDataService
  ) { }

  getMypackages() {
    this.packsService.getMyPacks().subscribe(
      response => {
        console.log(response);
        this.myPackages = response;
        console.log(this.myPackages);

      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getMypackages();
    this.userDataService.userData$.subscribe(
      {
       next: (r) => this.referalCode = r?.referral_code
      } 
     );
  }
}
