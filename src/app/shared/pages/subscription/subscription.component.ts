import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  role: string = null;

  constructor(public userDataService: UserDataService) { 
    this.role = this.userDataService.userData$.value.subscription;

  }

  ngOnInit(): void {
    console.log(this.role );
    
  }

}
