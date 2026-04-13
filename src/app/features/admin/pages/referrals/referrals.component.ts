import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { buildWhatsAppReferralShareUrl } from 'src/app/shared/utils/referral-share';
import { ReferredUserRow, UserService } from 'src/app/shared/services/user.service';
import { CatalogPricesService } from 'src/app/core/services/catalog-prices.service';
import { isReferralRenewalDueOrOverdue } from 'src/app/shared/utils/referral-renewal-date';
import { isTeacherOrAdminRole } from 'src/app/shared/utils/staff-role';
import { UserEventsService } from 'src/app/core/services/user-events.service';

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
  /** Paginación solo en front (el API devuelve la lista completa). */
  referralsPageSize = 10;
  referralsCurrentPage = 1;
  /** Profesor y admin: sin recompra mensual ni bajada de plan por fecha. */
  isTeacherOrAdmin = false;
  /** true hasta que termina la primera carga de perfil (incluye lista de referidos desde el API). */
  profileLoading = true;

  private visibilityListener?: () => void;
  private referralEventsSub?: Subscription;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private catalogPricesService: CatalogPricesService,
    private userEventsService: UserEventsService,
  ) {}

  get rebuyPriceLabel(): string {
    return `${this.rebuyAmountUsd} ${this.rebuyCurrency}`.trim();
  }

  /**
   * CTA «Ir a pagar»: solo el día de `referral_next_renewal` o si la fecha ya venció (recompra pendiente).
   * No mientras la renovación sea futura (el usuario ve la fecha en la tarjeta de código).
   */
  get showRebuyMonthlyCta(): boolean {
    if (this.isTeacherOrAdmin) {
      return false;
    }
    return isReferralRenewalDueOrOverdue(this.referralNextRenewal);
  }

  /**
   * Usuario con plan (o equivalente) pero el backend aún no devolvió fecha de recompra: mensaje de sincronización / recompra.
   * No usar para usuarios nuevos sin plan (ver `showAcademiaOnboardingBanner`).
   */
  get showAcademiaRebuySyncBanner(): boolean {
    if (this.isTeacherOrAdmin) {
      return false;
    }
    return !this.referralNextRenewal && this.hasActiveSelfManagementPlan;
  }

  /**
   * Usuario nuevo / sin plan de Academia: solo invitar a contratar el plan. Sin título ni texto de «recompra» ni importe mensual.
   */
  get showAcademiaOnboardingBanner(): boolean {
    if (this.isTeacherOrAdmin) {
      return false;
    }
    return !this.referralNextRenewal && !this.hasActiveSelfManagementPlan;
  }

  /**
   * Plan activo y fecha de recompra aún futura: acceso a Academia/cursos sin CTA de pago (ese va solo al vencer el plazo).
   */
  get showAcademiaCourseBanner(): boolean {
    if (this.isTeacherOrAdmin) {
      return false;
    }
    return (
      this.hasActiveSelfManagementPlan &&
      !!this.referralNextRenewal &&
      !isReferralRenewalDueOrOverdue(this.referralNextRenewal)
    );
  }

  /** Mensaje neutro para staff: Academia sin mencionar recompra. */
  get showStaffAcademiaBanner(): boolean {
    return this.isTeacherOrAdmin;
  }

  ngOnInit(): void {
    this.loadUserReferralData(false);
    this.referralEventsSub = this.userEventsService.referralUpdated$.subscribe(() => {
      this.loadUserReferralData(true);
    });
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
    this.referralEventsSub?.unsubscribe();
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

  /** Filas de la página actual. */
  get referredUsersPaged(): ReferredUserRow[] {
    const start = (this.referralsCurrentPage - 1) * this.referralsPageSize;
    return this.referredUsers.slice(start, start + this.referralsPageSize);
  }

  get referralsTotalPages(): number {
    const n = this.referredUsers.length;
    if (n <= 0) {
      return 1;
    }
    return Math.ceil(n / this.referralsPageSize);
  }

  get referralsRangeLabel(): string {
    const n = this.referredUsers.length;
    if (n === 0) {
      return '';
    }
    const start = (this.referralsCurrentPage - 1) * this.referralsPageSize + 1;
    const end = Math.min(n, this.referralsCurrentPage * this.referralsPageSize);
    return `${start}–${end} de ${n}`;
  }

  get showReferralsPagination(): boolean {
    return this.referredUsers.length > this.referralsPageSize;
  }

  setReferralsPage(page: number): void {
    const total = this.referralsTotalPages;
    this.referralsCurrentPage = Math.min(Math.max(1, page), total);
  }

  prevReferralsPage(): void {
    this.setReferralsPage(this.referralsCurrentPage - 1);
  }

  nextReferralsPage(): void {
    this.setReferralsPage(this.referralsCurrentPage + 1);
  }

  /** Mismo criterio que el banner del propio usuario: staff siempre «activo» para el código. */
  referredUserReferralCodeActive(row: ReferredUserRow): boolean {
    return isTeacherOrAdminRole(row?.rol) || row?.referral_active === true;
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
        this.isTeacherOrAdmin = isTeacherOrAdminRole(user?.rol);
        this.commissionBalance = user.commission_balance ?? 0;
        this.travelPoints = user.travel_points ?? 0;
        this.referralCode = user.referral_code ?? '';
        this.referralActive =
          this.isTeacherOrAdmin || user.referral_active === true;
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
        const tp = this.referralsTotalPages;
        if (this.referralsCurrentPage > tp) {
          this.referralsCurrentPage = tp;
        }
        this.profileLoading = false;
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

}
