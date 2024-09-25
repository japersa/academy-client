import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { Router } from '@angular/router';
import { link } from 'fs';


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

  openAndroid() {
    const url = 'https://play.google.com/store/apps/details?id=com.sniperpro.sniperpro';
    window.open(url, '_blank');
  }

  openiOS() {
    const url = 'https://testflight.apple.com/join/6laFRCqS';
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe(
      {
        next: (r) => this.referalCode = r?.referral_code
      }
    );
  }

}
