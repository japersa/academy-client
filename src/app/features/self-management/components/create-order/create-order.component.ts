import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { PacksService } from '../../services/packs.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent {
  price = '';
  form!: FormGroup;
  errorMessage: string | null;

  constructor(
    // import the form builder
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private packsService: PacksService
  ) {
    // Build the form
    this.buildForm();
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

  get referralCodeField() {
    return this.form?.get('referral_code');
  }

  get referralCodeFieldDirty() {
    return this.referralCodeField?.dirty || this.referralCodeField?.touched;
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

      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postal_code: ['', [Validators.required]],
      address: ['', [Validators.required]],
      referral_code: ['', [Validators.required]],

      tos: ['', [Validators.requiredTrue]],
      cancellation_policies: ['', [Validators.requiredTrue]]
    });
  }

  createPack(formData: any) {
    // this.packsService.createPack(formData).subscribe(
    //   {
    //     next: r => console.log(r)

    //   }
    // );
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(x => {
      console.log(x)
    }
    );
  }

}
