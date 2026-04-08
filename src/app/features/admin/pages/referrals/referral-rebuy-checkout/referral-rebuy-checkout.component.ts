import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CatalogPricesService } from 'src/app/core/services/catalog-prices.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

const apiURL = environment.apiURL;

interface SelfManagementPackage {
  status?: string;
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
  planChecked = false;

  loading = false;
  error: string | null = null;

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
      },
      error: () => {},
    });

    this.userService.getUser().subscribe({
      next: (user) => {
        const pkgs = user.packages_self_management as SelfManagementPackage[] | undefined;
        const hasActivePkg =
          Array.isArray(pkgs) && pkgs.some((p) => (p.status || '').toLowerCase() === 'active');
        const subscriptionFull = (user.subscription || '').toLowerCase() === 'full';
        this.hasActiveSelfManagementPlan = hasActivePkg || subscriptionFull;
        this.planChecked = true;
        if (!this.hasActiveSelfManagementPlan) {
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
            this.modalRef = this.modalService.show(template);
          }
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
