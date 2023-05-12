import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-self-management',
  templateUrl: './self-management.component.html',
  styleUrls: ['./self-management.component.scss']
})
export class SelfManagementComponent implements OnInit {

  referalCode = '0000000'; 
  buttonText = 'Copiar';

  copied() {
    this.buttonText = 'Copiado';
  }

  constructor(public userDataService: UserDataService,
  ) { }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe(
     {
      next: (r) => this.referalCode = r?.referral_code
     } 
    );
  }

}
