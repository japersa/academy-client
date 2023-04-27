import { Component, OnInit, TemplateRef } from '@angular/core';
import { StripeScriptTag } from 'stripe-angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PacksService } from '../../services/packs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface CPResponsePayment {
  amount: string;
  txn_id: string;
  address: string;
  confirms_needed: string;
  timeout: number;
  checkout_url: string;
  status_url: string;
  qrcode_url: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  orders: any[] = null;
  selectedOrder: any = null;

  coinpaymentResponse: CPResponsePayment = null;

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

  currencies: any[] = [
    {
      name: 'Bitcoin',
      logo: '',
      symbol: 'btc'
    },
    {
      name: 'Bitcoin Cash',
      logo: '',
      symbol: 'BCH'
    },
    {
      name: 'Ripple',
      logo: '',
      symbol: 'xrp'
    },
  ];

  modalRef?: BsModalRef;


  criptoform!: FormGroup;

  constructor(private stripeScriptTag: StripeScriptTag,
    private packsService: PacksService,
    public utilsService: UtilsService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
    if (!this.stripeScriptTag.StripeInstance) {
      this.stripeScriptTag.setPublishableKey(environment.stripePK);
    }
    this.buildForm();
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

  payWithCripto(template: TemplateRef<any>) {

    const data = {
      package_self_management_id: this.productID,
      currency2: this.criptoform.value.currency2
    };
    this.packsService.payPackCoinpayents(data).subscribe({
      next: (r) => {
        this.coinpaymentResponse = r;
        this.modalRef = this.modalService.show(template);
      },
      error: (e) => console.log(e)
    });
  }

  get currencyField() {
    return this.criptoform?.get('currency2');
  }

  get currencyDirty() {
    return this.currencyField?.dirty || this.currencyField?.touched;
  }

  private buildForm() {
    this.criptoform = this.formBuilder.group({
      currency2: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productID = params.get('id');
    });
    this.packsService.getMyOrders().subscribe(
      {
        next: r => {
          this.orders = r
          this.selectedOrder = this.orders.find((order) => order.id == this.productID);
        }
      }
    );
  }

}
