import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  commissionBalance: number = 0;
  travelPoints: number = 0;
  referralCode: string = '';
  referralActive: boolean = false;
  referralNextRenewal?: string | null;

  loading: boolean = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadUserReferralData();
  }

  loadUserReferralData() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.commissionBalance = user.commission_balance ?? 0;
        this.travelPoints = user.travel_points ?? 0;
        this.referralCode = user.referral_code;
        this.referralActive = user.referral_active ?? false;
        this.referralNextRenewal = user.referral_next_renewal ?? null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la información de referidos.';
      }
    });
  }

  payMonthlyRebuy(tokenId: string) {
    if (!tokenId) {
      this.error = 'Falta el token de pago (Stripe).';
      return;
    }

    this.loading = true;
    this.error = null;

    this.http.post<any>(`${apiURL}/payments/payment/referral-rebuy/stripe`, {
      token_id: tokenId
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.referralActive = true;
        this.referralNextRenewal = res.next_renewal;
        this.loadUserReferralData();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'No se pudo procesar el pago de la recompra.';
      }
    });
  }
}

