import { Component, OnInit } from '@angular/core';
import { StripeScriptTag } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PacksService } from '../../services/packs.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{

  orders: any[] = null;
  selectedOrder: any = null;

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
        },'::stripe-card-row': {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '10px'
        },
        '::stripe-card-row .stripe-card-field': {
          width: '48%',
        }
      }
    }
  };

  constructor(private stripeScriptTag: StripeScriptTag,
    private packsService: PacksService,
    private route: ActivatedRoute) {
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey(environment.stripePK);
    }
  }

  createPaymentMethod(extraData) {
    console.log(extraData);
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
    this.packsService.getMyOrders().subscribe(
      {
        next: r => {this.orders = r
        this.selectedOrder = this.orders.find((order) => order.id == this.productID); 
        }
      }
    );
  }

}
