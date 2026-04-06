import { Component, OnDestroy, OnInit } from '@angular/core';
import { take } from 'rxjs';
import {
  CatalogPricesService,
  PublicCheckoutOfferPayload,
} from 'src/app/core/services/catalog-prices.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  readonly coinpaymentsAction = 'https://www.coinpayments.net/index.php';

  loading = true;
  loadError: string | null = null;
  offer: PublicCheckoutOfferPayload | null = null;

  constructor(private catalogPrices: CatalogPricesService) {}

  ngOnInit(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('pricing-page');

    this.catalogPrices.getCatalog().pipe(take(1)).subscribe({
      next: (res) => {
        this.offer = res.public_checkout;
        this.loading = false;
        if (!this.offer) {
          this.loadError =
            'No hay oferta pública activa. Configura «Ofertas públicas» en el administrador.';
        }
      },
      error: () => {
        this.loading = false;
        this.loadError =
          'No se pudieron cargar los precios. Comprueba la API o vuelve a intentarlo.';
      },
    });
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('pricing-page');
  }
}
