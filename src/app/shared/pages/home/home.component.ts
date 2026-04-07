import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { buildWhatsAppReferralShareUrl } from '../../../shared/utils/referral-share';
import { UserDataService } from '../../../core/services/user-data.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../../features/auth/services/register.service';
import { StorageService } from '../../../core/services/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  referalCode = '0000000';

  constructor(public userDataService: UserDataService,
    private route: Router,
    private registerService: RegisterService,
    private storageService: StorageService,
  ) { }

  get whatsappReferralHref(): string {
    return buildWhatsAppReferralShareUrl(this.referalCode);
  }

  ngOnInit(): void {
    this.userDataService.userData$.subscribe({
      next: (r) => {
        if (r?.referral_code) {
          this.referalCode = r.referral_code;
        }
      },
    });
    this.registerService.getUser().subscribe({
      next: (r) => {
        this.userDataService.userData$.next(r);
        this.referalCode = r?.referral_code ?? this.referalCode;
        void this.storageService.set('userData', r);
      },
      error: (e) => console.error(e),
    });
  }

}
