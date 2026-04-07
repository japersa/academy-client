import { Component, OnInit, ViewChild } from '@angular/core';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { ReferredUserRow, UserService } from 'src/app/shared/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StripeScriptTag } from 'stripe-angular';

const apiURL = environment.apiURL;

interface SelfManagementPackage {
  status?: string;
}

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  commissionBalance: number = 0;
  travelPoints: number = 0;
  referralCode: string = '';
  /** Recompra mensual solo tiene sentido con paquete de autogestión / Academia activo. */
  hasActiveSelfManagementPlan = false;
  /** Solo es false si el backend envía explícitamente false (el valor por defecto en servidor es activo). */
  referralActive = true;
  referralNextRenewal?: string | null;

  loading: boolean = false;
  error: string | null = null;

  referredUsers: ReferredUserRow[] = [];
  /** true hasta que termina la primera carga de perfil (incluye lista de referidos desde el API). */
  profileLoading = true;

  cardCaptureReady = false;
  invalidError: { message?: string } | null = null;

  @ViewChild('stripeCard') stripeCard: { createToken: (ev: Event) => void } | null = null;

  cardOptions = {
    iconStyle: 'solid' as const,
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#706f6f',
        color: '#706f6f',
        fontWeight: '100',
        '::placeholder': {
          color: '#706f6f'
        }
      }
    }
  };

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private stripeScriptTag: StripeScriptTag,
  ) {
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey(environment.stripePK);
    }
  }

  ngOnInit(): void {
    this.loadUserReferralData();
  }

  displayReferredName(row: ReferredUserRow): string {
    const name = `${row.first_name || ''} ${row.last_name || ''}`.trim();
    return name || row.email || row.username || '—';
  }

  displayReferredEmail(row: ReferredUserRow): string {
    return (row.email && row.email.trim()) || row.username || '—';
  }

  get whatsappReferralHref(): string {
    return buildWhatsAppReferralShareUrl(this.referralCode);
  }

  loadUserReferralData() {
    this.profileLoading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.commissionBalance = user.commission_balance ?? 0;
        this.travelPoints = user.travel_points ?? 0;
        this.referralCode = user.referral_code ?? '';
        this.referralActive = user.referral_active !== false;
        this.referralNextRenewal = user.referral_next_renewal ?? null;
        const pkgs = user.packages_self_management as SelfManagementPackage[] | undefined;
        this.hasActiveSelfManagementPlan = Array.isArray(pkgs)
          && pkgs.some((p) => (p.status || '').toLowerCase() === 'active');
        this.referredUsers = Array.isArray(user.referred_users) ? user.referred_users : [];
        this.profileLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar la información de referidos.';
        this.profileLoading = false;
      }
    });
  }

  onStripeError(err: Error): void {
    console.error(err);
    this.invalidError = { message: err.message };
  }

  setStripeToken(event: stripe.Token): void {
    this.payMonthlyRebuy(event.id);
  }

  payMonthlyRebuy(tokenId: string) {
    if (!tokenId) {
      this.error = 'Falta el token de pago (Stripe).';
      return;
    }

    this.loading = true;
    this.error = null;

    this.http.post<{ next_renewal?: string }>(`${apiURL}/payments/payment/referral-rebuy/stripe`, {
      token_id: tokenId
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.referralActive = true;
        if (res.next_renewal) {
          this.referralNextRenewal = res.next_renewal;
        }
        this.loadUserReferralData();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        const detail = err?.error?.detail;
        this.error =
          typeof detail === 'string'
            ? detail
            : 'No se pudo procesar el pago de la recompra.';
      }
    });
  }

  submitRebuy($event: Event): void {
    if (!this.stripeCard?.createToken) {
      this.error = 'Stripe no está listo. Recarga la página.';
      return;
    }
    this.stripeCard.createToken($event);
  }
}
