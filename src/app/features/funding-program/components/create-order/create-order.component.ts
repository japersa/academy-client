import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CatalogPricesService,
  FundingBalancePriceRow,
} from 'src/app/core/services/catalog-prices.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { PacksService } from '../../services/packs.service';

@Component({
  selector: 'app-create-pack',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  price = '';
  form!: FormGroup;
  errorMessage: string | null;
  fundingTiers: FundingBalancePriceRow[] = [];

  private readonly fallbackFunding: FundingBalancePriceRow[] = [
    { balance: 'fifty_thousand', amount: '299.00', currency: 'USD', label: '50.000 USD', sort_order: 1 },
    { balance: 'one_hundred_thousand', amount: '499.00', currency: 'USD', label: '100.000 USD', sort_order: 2 },
    { balance: 'two_hundred_thousand', amount: '979.00', currency: 'USD', label: '200.000 USD', sort_order: 3 },
    { balance: 'five_hundred_thousand', amount: '2149.00', currency: 'USD', label: '500.000 USD', sort_order: 4 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private packsService: PacksService,
    private router: Router,
    private catalogPrices: CatalogPricesService,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.catalogPrices.getCatalog().subscribe({
      next: (res) => {
        this.fundingTiers =
          res.funding_balances?.length > 0 ? res.funding_balances : this.fallbackFunding;
      },
      error: () => {
        this.fundingTiers = this.fallbackFunding;
      },
    });
  }

  // declare getters for each field
  get firstNameField() {
    return this.form?.get('first_name');
  }

  get firstNameFieldDirty() {
    return this.firstNameField?.dirty || this.firstNameField?.touched;
  }

  get lastNameField() {
    return this.form?.get('last_name');
  }

  get lastNameFieldDirty() {
    return this.lastNameField?.dirty || this.lastNameField?.touched;
  }

  get emailField() {
    return this.form?.get('email');
  }

  get emailFieldDirty() {
    return this.emailField?.dirty || this.emailField?.touched;
  }

  get countryCodeField() {
    return this.form?.get('country_code');
  }

  get countryCodeFieldDirty() {
    return this.countryCodeField?.dirty || this.countryCodeField?.touched;
  }

  get phoneField() {
    return this.form?.get('phone_number');
  }

  get phoneFieldDirty() {
    return this.phoneField?.dirty || this.phoneField?.touched;
  }

  get addressField() {
    return this.form?.get('address');
  }

  get addressFieldDirty() {
    return this.addressField?.dirty || this.addressField?.touched;
  }

  get cityField() {
    return this.form?.get('city');
  }

  get cityFieldDirty() {
    return this.cityField?.dirty || this.cityField?.touched;
  }

  get postalCodeField() {
    return this.form?.get('postal_code');
  }

  get postalCodeFieldDirty() {
    return this.postalCodeField?.dirty || this.postalCodeField?.touched;
  }

  get countryField() {
    return this.form?.get('country');
  }

  get countryFieldDirty() {
    return this.countryField?.dirty || this.countryField?.touched;
  }

  get termsConditionsField() {
    return this.form?.get('tos');
  }

  get termsConditionsFieldDirty() {
    return this.termsConditionsField?.dirty || this.termsConditionsField?.touched;
  }

  get cancellationPoliticsField() {
    return this.form?.get('cancellation_policies');
  }

  get datapoliticsFieldDirty() {
    return this.cancellationPoliticsField?.dirty || this.cancellationPoliticsField?.touched;
  }

  // create the form
  private buildForm() {
    this.form = this.formBuilder.group({
      currencies: ['', [Validators.required]],
      balance: ['one_hundred_thousand', [Validators.required]],
      account_type: ['', [Validators.required]],

      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      address: ['', [Validators.required]],

      tos: ['', [Validators.requiredTrue]],
      cancellation_policies: ['', [Validators.requiredTrue]]
    });
  }

  createPack(formData: any) {
    this.packsService.createPack(formData).subscribe(() => {
      this.packsService.getMyPacks().subscribe(pkg => {
        const newPack = pkg.reduce((prev, current) => {
          return (prev.id > current.id) ? prev : current;
        });
        console.log(newPack);
        this.router.navigate([`/funding-program/checkout/${newPack.id}`]);
      });
    }
    );
  }

}
