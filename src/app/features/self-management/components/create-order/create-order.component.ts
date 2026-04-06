import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from 'src/app/core/utils/http-error-message';
import { UtilsService } from 'src/app/core/services/utils.service';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/features/auth/services/register.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserDataService } from 'src/app/core/services/user-data.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  price = '';
  form!: FormGroup;
  errorMessage: Record<string, unknown> | null = null;
  /** Mensaje del API debajo del input de código de referido (p. ej. inválido o propio código). */
  referralCodeServerError: string | null = null;
  referalCode = '0000000';
  private readonly subs = new Subscription();

  constructor(
    // import the form builder
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    private packsService: PacksService,
    private router: Router,
    private registerService: RegisterService,
    public userDataService: UserDataService,
    private storageService: StorageService,
    private toastr: ToastrService,
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
      referral_code: ['', [Validators.required, Validators.maxLength(6), this.validarReferralCode.bind(this)]],
      tos: ['', [Validators.requiredTrue]],
      cancellation_policies: ['', [Validators.requiredTrue]]
    });
  }

  createPack(formData: any) {
    this.errorMessage = null;
    this.referralCodeServerError = null;
    this.packsService.createPack(formData).subscribe({
      next: () => {
        this.packsService.getMyPacks().subscribe({
          next: (pkg) => {
            const newPack = pkg.reduce((prev: { id: number }, current: { id: number }) =>
              prev.id > current.id ? prev : current
            );
            this.router.navigate([`/self-management/checkout/${newPack.id}`]);
          },
          error: (err: unknown) => {
            this.handleCreateOrderApiError(err, 'Error');
          },
        });
      },
      error: (err: unknown) => {
        this.handleCreateOrderApiError(err, 'No se pudo crear el pedido');
      },
    });
  }

  /**
   * Errores de código de referido: solo mensaje bajo el input (sin duplicar bloque general ni toast).
   * Otros errores: bloque general + toast.
   */
  private handleCreateOrderApiError(err: unknown, toastTitle: string): void {
    const msg = getHttpErrorMessage(err);
    if (this.isReferralRelatedApiError(err, msg)) {
      this.errorMessage = null;
      this.referralCodeServerError = msg.trim();
      this.referralCodeField?.markAsTouched();
      return;
    }
    this.referralCodeServerError = null;
    this.setErrorMessageFromPayload(err, msg);
    this.toastr.error(msg, toastTitle);
  }

  private isReferralRelatedApiError(err: unknown, msg: string): boolean {
    const lower = msg.toLowerCase();
    if (lower.includes('referido') || lower.includes('referral')) {
      return true;
    }
    if (err instanceof HttpErrorResponse && err.error && typeof err.error === 'object' && !(err.error instanceof Blob)) {
      const keys = Object.keys(err.error as object);
      if (keys.some((k) => k.toLowerCase().includes('referral'))) {
        return true;
      }
    }
    return false;
  }

  private setErrorMessageFromPayload(err: unknown, displayMsg: string): void {
    if (err instanceof HttpErrorResponse && err.error && typeof err.error === 'object' && !(err.error instanceof Blob)) {
      this.errorMessage = { ...(err.error as Record<string, unknown>), detail: displayMsg };
    } else {
      this.errorMessage = { detail: displayMsg };
    }
  }

  validarReferralCode(control: FormControl): { [key: string]: boolean } | null {
    const codigoReferencia = this.referalCode; // Reemplaza 'tu_variable' por el valor de tu variable específica

    if (control.value === codigoReferencia) {
      return { 'referralCodeInvalido': true };
    }

    return null;
  }

  ngOnInit(): void {
    this.subs.add(
      this.registerService.getUser().subscribe({
        next: (r) => {
          this.userDataService.userData$.next(r);
          this.referalCode = r?.referral_code ?? '0000000';
          void this.storageService.set('userData', r);
        },
        error: (e) => console.error(e),
      })
    );
    this.subs.add(
      this.userDataService.userData$.subscribe((data) => {
        if (data?.referral_code != null && data.referral_code !== '') {
          this.referalCode = data.referral_code;
        }
      })
    );
    this.subs.add(
      this.form.get('referral_code')?.valueChanges.subscribe(() => {
        this.referralCodeServerError = null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
