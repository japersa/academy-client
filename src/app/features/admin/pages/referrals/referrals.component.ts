import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { ReferredUserRow, UserService } from 'src/app/shared/services/user.service';
import { CatalogPricesService } from 'src/app/core/services/catalog-prices.service';

interface SelfManagementPackage {
  status?: string;
  package_type?: string;
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
  /**
   * Muestra el banner de renovación solo si ya hubo un plan Academia pagado (activo o cerrado
   * por vencimiento) o suscripción full. Un paquete solo en `pending` no cuenta.
   */
  hasActiveSelfManagementPlan = false;
  /** true solo si el backend confirma referral_active (p. ej. tras pago del plan). */
  referralActive = false;
  referralNextRenewal?: string | null;

  /** Importe recompra y comisión al patrocinador (catálogo / admin). */
  rebuyAmountUsd = '30';
  rebuyCurrency = 'USD';
  referrerRebuyCommissionUsd = '10';

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

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private catalogPricesService: CatalogPricesService,
  ) {}

  get rebuyPriceLabel(): string {
    return `${this.rebuyAmountUsd} ${this.rebuyCurrency}`.trim();
  }

  /** Renovación mensual solo tiene sentido si el backend ya asignó fecha (tras pago del plan). */
  get showRebuyMonthlyCta(): boolean {
    return this.hasActiveSelfManagementPlan && !!this.referralNextRenewal;
  }

  /**
   * Banner «Ir a Academia»: sin plan de Academia, o con plan pero sin fecha de próxima recompra aún
   * (misma idea que «aún no hay recompra» — no mostrar hueco vacío entre estadísticas y la red).
   */
  get showGoToAcademiaBanner(): boolean {
    return !this.hasActiveSelfManagementPlan || !this.referralNextRenewal;
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
        this.referralActive = user.referral_active === true;
        this.referralNextRenewal = user.referral_next_renewal ?? null;
        const pkgs = user.packages_self_management as SelfManagementPackage[] | undefined;
        const hasActivePkg =
          Array.isArray(pkgs)
          && pkgs.some((p) => (p.status || '').toLowerCase() === 'active');
        const hasPaidOrExpiredAgPackage =
          Array.isArray(pkgs)
          && pkgs.some((p) => {
            const st = (p.status || '').toLowerCase();
            const isAg = (p.package_type || '').toLowerCase() === 'ag';
            return isAg && (st === 'active' || st === 'closed');
          });
        const subscriptionFull = (user.subscription || '').toLowerCase() === 'full';
        this.hasActiveSelfManagementPlan =
          hasActivePkg || subscriptionFull || hasPaidOrExpiredAgPackage;
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
}
