import { Component, OnInit } from '@angular/core';
import { StripeScriptTag } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PacksService } from '../../../funding-program/services/packs.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  productID = '';
  cardCaptureReady = false
  invalidError: any = null;
  stripeCard = null;

  cardOptions = {
    iconStyle: 'solid',
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#706f6f',
        color: '#706f6f',
        fontWeight: '100',
        // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        // fontSize: '18px',
        '::placeholder': {
          color: '#706f6f'
        }
      }
    }
  };

  constructor(private stripeScriptTag: StripeScriptTag,
    private packsService: PacksService,
    private route: ActivatedRoute
  ) {
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey(environment.stripePK);
    }
  }

  createPaymentMethod(event) {
    console.log(event);
    const data = {
      package_self_management_id: this.productID,
      token_id: event.id
    };
    this.packsService.createPack(data).subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  onStripeInvalid(error: Error) {
    console.log('Validation Error', error)
  }

  onStripeError(error: Error) {
    console.error('Stripe error', error)
  }

  setPaymentMethod(token: stripe.paymentMethod.PaymentMethod) {
    console.log('Stripe Payment Method', token)
  }

  setStripeToken(event: stripe.Token) {
    console.log('Stripe Token', event);
    const data = {
      package_self_management_id: this.productID,
      token_id: event.id
    };
    this.packsService.payPackStripe(data).subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  setStripeSource(source: stripe.Source) {
    console.log('Stripe Source', source)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productID = params.get('id');
    });
  }

}
