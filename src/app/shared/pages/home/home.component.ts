import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  referalCode = '0000000';

  constructor(public userDataService: UserDataService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe(
      {
        next: (r) => this.referalCode = r?.referral_code
      }
    );
  }

}
