import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { ReferredUserRow, UserService } from 'src/app/shared/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CatalogPricesService } from 'src/app/core/services/catalog-prices.service';

const apiURL = environment.apiURL;

interface SelfManagementPackage {
  status?: string;
}

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit, OnDestroy {
  commissionBalance: number = 0;
  travelPoints: number = 0;
  referralCode: string = '';
  /** Recompra mensual solo tiene sentido con paquete de autogestión / Academia activo. */
  hasActiveSelfManagementPlan = false;
  /** Solo es false si el backend envía explícitamente false (el valor por defecto en servidor es activo). */
  referralActive = true;
  referralNextRenewal?: string | null;

  /** Importe recompra y comisión al patrocinador (catálogo / admin). */
  rebuyAmountUsd = '30';
  rebuyCurrency = 'USD';
  referrerRebuyCommissionUsd = '10';

  loading: boolean = false;
  error: string | null = null;

  referredUsers: ReferredUserRow[] = [];
  /** true hasta que termina la primera carga de perfil (incluye lista de referidos desde el API). */
  profileLoading = true;

  private referralRenewalPollId: ReturnType<typeof setInterval> | null = null;
  private referralRenewalPollAttempts = 0;
  private readonly referralRenewalPollMs = 12000;
  /** ~10 minutos de reintentos */
  private readonly referralRenewalPollMax = 50;
  private visibilityListener?: () => void;

  rebuyCryptoForm!: FormGroup;

  coinpaymentRebuyResponse: {
    amount?: string;
    txn_id?: string;
    address?: string;
    confirms_needed?: string;
    checkout_url?: string;
    status_url?: string;
    qrcode_url?: string;
  } | null = null;

  /** Mismas opciones que el checkout de Academia (`checkout.component.ts`). */
  currencies: { name: string; logo: string; symbol: string }[] = [
    { name: 'Bitcoin', logo: '', symbol: 'btc' },
    { name: 'Bitcoin Cash', logo: '', symbol: 'BCH' },
    { name: 'Ripple', logo: '', symbol: 'xrp' },
    { name: 'Tether USD (Omni Layer)', logo: '', symbol: 'USDT' },
    { name: 'Tether USD (ERC20)', logo: '', symbol: 'USDT.ERC20' },
    { name: 'Tether USD (TRON/TRC20)', logo: '', symbol: 'USDT.TRC20' },
    { name: 'Litecoin', logo: '', symbol: 'LTC' },
  ];

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private catalogPricesService: CatalogPricesService,
  ) {
    this.rebuyCryptoForm = this.formBuilder.group({
      currency2: ['', Validators.required],
    });
  }

  get rebuyPriceLabel(): string {
    return `${this.rebuyAmountUsd} ${this.rebuyCurrency}`.trim();
  }

  ngOnInit(): void {
    this.loadUserReferralData(false);
    this.visibilityListener = () => {
      if (document.visibilityState === 'visible') {
        this.loadUserReferralData(true);
      }
    };
    document.addEventListener('visibilitychange', this.visibilityListener);
    this.catalogPricesService.getCatalog().subscribe({
      next: (c) => {
        const rr = c.referral_rebuy;
        const rebuy = rr?.rebuy_amount ?? rr?.amount;
        if (rebuy) {
          this.rebuyAmountUsd = rebuy;
        }
        if (rr?.currency) {
          this.rebuyCurrency = rr.currency;
        }
        if (rr?.referrer_commission_usd) {
          this.referrerRebuyCommissionUsd = rr.referrer_commission_usd;
        }
      },
      error: () => {},
    });
  }

  ngOnDestroy(): void {
    this.stopReferralRenewalPolling();
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener);
    }
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

  onReferralCodeCopied(success: boolean): void {
    if (success) {
      this.toastr.success('Código copiado al portapapeles.', 'Copiado');
    } else {
      this.toastr.warning('No se pudo copiar. Intenta de nuevo o copia manualmente.', 'Copiar');
    }
  }

  /**
   * @param silent Si true, no muestra el spinner principal ni reinicia lista en blanco;
   *               sirve para sondeo y al volver a la pestaña.
   */
  loadUserReferralData(silent: boolean) {
    if (!silent) {
      this.profileLoading = true;
    }
    this.userService.getUser().subscribe({
      next: (user) => {
        this.commissionBalance = user.commission_balance ?? 0;
        this.travelPoints = user.travel_points ?? 0;
        this.referralCode = user.referral_code ?? '';
        this.referralActive = user.referral_active !== false;
        this.referralNextRenewal = user.referral_next_renewal ?? null;
        const pkgs = user.packages_self_management as SelfManagementPackage[] | undefined;
        const hasActivePkg =
          Array.isArray(pkgs)
          && pkgs.some((p) => (p.status || '').toLowerCase() === 'active');
        const subscriptionFull = (user.subscription || '').toLowerCase() === 'full';
        // Mismo criterio que el backend: Academia = paquete activo o suscripción full.
        this.hasActiveSelfManagementPlan = hasActivePkg || subscriptionFull;
        this.referredUsers = Array.isArray(user.referred_users) ? user.referred_users : [];
        this.profileLoading = false;

        this.syncReferralRenewalPollingState();
      },
      error: (err) => {
        console.error(err);
        if (!silent) {
          this.error = 'No se pudo cargar la información de referidos.';
        }
        this.profileLoading = false;
      }
    });
  }

  private syncReferralRenewalPollingState(): void {
    const waitingForRebuyState =
      this.hasActiveSelfManagementPlan &&
      (!this.referralActive || !this.referralNextRenewal);
    if (waitingForRebuyState) {
      this.startReferralRenewalPolling();
    } else {
      this.stopReferralRenewalPolling();
    }
  }

  private startReferralRenewalPolling(): void {
    if (this.referralRenewalPollId !== null) {
      return;
    }
    this.referralRenewalPollAttempts = 0;
    this.referralRenewalPollId = setInterval(() => {
      this.referralRenewalPollAttempts += 1;
      if (this.referralRenewalPollAttempts > this.referralRenewalPollMax) {
        this.stopReferralRenewalPolling();
        return;
      }
      this.loadUserReferralData(true);
    }, this.referralRenewalPollMs);
  }

  private stopReferralRenewalPolling(): void {
    if (this.referralRenewalPollId !== null) {
      clearInterval(this.referralRenewalPollId);
      this.referralRenewalPollId = null;
    }
  }

  /**
   * Misma API que el curso Academia: `payment/referral-rebuy/coinpayments`
   * (paralelo a `payment/package-self-management/coinpayments`).
   */
  payRebuyCoinpayments(): void {
    if (this.rebuyCryptoForm.invalid) {
      this.rebuyCryptoForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    this.coinpaymentRebuyResponse = null;
    this.http
      .post<typeof this.coinpaymentRebuyResponse>(`${apiURL}/payment/referral-rebuy/coinpayments`, {
        currency2: this.rebuyCryptoForm.value.currency2,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res && typeof res === 'object') {
            this.coinpaymentRebuyResponse = res;
          }
          this.loadUserReferralData(true);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          const detail = err?.error?.detail;
          this.error =
            typeof detail === 'string'
              ? detail
              : 'No se pudo iniciar el pago de la recompra con CoinPayments.';
        },
      });
  }
}
