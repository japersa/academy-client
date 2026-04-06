import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FundingBalancePriceRow {
  balance: string;
  amount: string;
  currency: string;
  label: string;
  sort_order: number;
}

export interface SelfManagementPlanPriceRow {
  package_type: string;
  amount: string;
  currency: string;
  label: string;
}

export interface PublicCheckoutOfferPayload {
  slug: string;
  title: string;
  hero_subtitle: string;
  amount: string;
  currency: string;
  coinpayments_merchant_id: string;
  item_name: string;
  item_desc: string;
  success_url: string;
  cancel_url: string;
  ipn_url: string;
}

export interface CatalogPricesResponse {
  funding_balances: FundingBalancePriceRow[];
  self_management_plans: SelfManagementPlanPriceRow[];
  public_checkout: PublicCheckoutOfferPayload | null;
}

@Injectable({ providedIn: 'root' })
export class CatalogPricesService {
  private readonly base = environment.apiURL.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  getCatalog(): Observable<CatalogPricesResponse> {
    return this.http.get<CatalogPricesResponse>(`${this.base}/catalog/prices/`);
  }
}
