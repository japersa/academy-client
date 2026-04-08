import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CatalogPricesService } from 'src/app/core/services/catalog-prices.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { isReferralRenewalDueOrOverdue } from 'src/app/shared/utils/referral-renewal-date';

const apiURL = environment.apiURL;

interface SelfManagementPackage {
  status?: string;
  package_type?: string;
}

@Component({
  selector: 'app-referral-rebuy-checkout',
  templateUrl: './referral-rebuy-checkout.component.html',
  styleUrls: ['./referral-rebuy-checkout.component.scss'],
})
export class ReferralRebuyCheckoutComponent implements OnInit {
  rebuyAmountUsd = '30';
  rebuyCurrency = 'USD';

  hasActiveSelfManagementPlan = false;
  /** Sin fecha de renovación no aplica el flujo de recompra mensual. */
  referralNextRenewal: string | null = null;
  planChecked = false;

  loading = false;

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

  modalRef?: BsModalRef;

  /** Viene del catálogo API (`CRYPTO_CHECKOUT_DISCLAIMER` en el servidor). */
  cryptoCheckoutDisclaimer = '';

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
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private catalogPricesService: CatalogPricesService,
    private modalService: BsModalService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.rebuyCryptoForm = this.formBuilder.group({
      currency2: ['', Validators.required],
    });
  }

  get rebuyPriceLabel(): string {
    return `${this.rebuyAmountUsd} ${this.rebuyCurrency}`.trim();
  }

  get currencyField() {
    return this.rebuyCryptoForm?.get('currency2');
  }

  ngOnInit(): void {
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
        this.cryptoCheckoutDisclaimer = (c.crypto_checkout_disclaimer ?? '').trim();
      },
      error: () => {},
    });

    this.userService.getUser().subscribe({
      next: (user) => {
        const pkgs = user.packages_self_management as SelfManagementPackage[] | undefined;
        const hasActivePkg =
          Array.isArray(pkgs) && pkgs.some((p) => (p.status || '').toLowerCase() === 'active');
        const hasPaidOrExpiredAgPackage =
          Array.isArray(pkgs) &&
          pkgs.some((p) => {
            const st = (p.status || '').toLowerCase();
            const isAg = (p.package_type || '').toLowerCase() === 'ag';
            return isAg && (st === 'active' || st === 'closed');
          });
        const subscriptionFull = (user.subscription || '').toLowerCase() === 'full';
        this.hasActiveSelfManagementPlan =
          hasActivePkg || subscriptionFull || hasPaidOrExpiredAgPackage;
        this.referralNextRenewal = user.referral_next_renewal ?? null;
        this.planChecked = true;
        if (!this.hasActiveSelfManagementPlan) {
          this.toastr.warning(
            'La recompra mensual del código de referido solo aplica si tienes un plan de Academia (autogestión) activo.',
            'Renovación',
          );
          this.router.navigate(['/referrals']);
        } else if (!this.referralNextRenewal) {
          this.toastr.info(
            'La renovación mensual solo está disponible cuando ya tienes una fecha de próxima renovación (se asigna al confirmar el pago del plan).',
            'Renovación',
          );
          this.router.navigate(['/referrals']);
        } else if (!isReferralRenewalDueOrOverdue(this.referralNextRenewal)) {
          this.toastr.info(
            'El pago de la recompra solo está habilitado el día de tu renovación o si ya venció. El importe es el de recompra mensual, no el del plan completo.',
            'Renovación',
          );
          this.router.navigate(['/referrals']);
        }
      },
      error: () => {
        this.planChecked = true;
        this.router.navigate(['/referrals']);
      },
    });
  }

  payRebuyCoinpayments(template: TemplateRef<unknown>): void {
    if (this.rebuyCryptoForm.invalid) {
      this.rebuyCryptoForm.markAllAsTouched();
      return;
    }
    this.loading = true;
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
            this.modalRef = this.modalService.show(template);
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          const detail = err?.error?.detail;
          const msg =
            typeof detail === 'string'
              ? detail
              : 'No se pudo iniciar el pago de la recompra con CoinPayments.';
          this.toastr.warning(msg, 'Pago');
        },
      });
  }
}
