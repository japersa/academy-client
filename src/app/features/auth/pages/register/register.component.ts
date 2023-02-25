import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { MyValidators } from '../../../../core/utils/validators';

import swal from "sweetalert2";
import { AlertsService } from '../../../../core/services/alerts.service';


@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  constructor(
    private formBuilder: FormBuilder,
    public utilsService: UtilsService,
    public notificationService: NotificationsService,
    private alertsService: AlertsService,
    private router: Router,
    private registerService: RegisterService) {

    this.buildForm();

  }

  showSwal(type) {
    if (type == "basic") {
      swal.fire({
        title: "Here's a message!",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success"
        }
      })
    } else if (type == "title-and-text") {
      swal.fire({
        title: "Here's a message!",
        text: "It's pretty, isn't it?",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-info"
        }
      })
    } else if (type == "success-message") {
      swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success",
        },
        icon: "success"
      })
    } else if (type == "warning-message-and-confirmation") {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          customClass: {
            cancelButton: "btn btn-danger",
            confirmButton: "btn btn-success mr-1",
          },
          confirmButtonText: "Yes, delete it!",
          buttonsStyling: false
        })
        .then(result => {
          if (result.value) {
            swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
              buttonsStyling: false
            });
          }
        })
    } else if (type == "warning-message-and-cancel") {
      swal
        .fire({
          title: "Are you sure?",
          text: "You will not be able to recover this imaginary file!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, keep it",
          customClass: {
            confirmButton: "btn btn-success mr-1",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false
        })
        .then(result => {
          if (result.value) {
            swal.fire({
              title: "Deleted!",
              text: "Your imaginary file has been deleted.",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
              buttonsStyling: false
            })
          } else {
            swal.fire({
              title: "Cancelled",
              text: "Your imaginary file is safe :)",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-info",
              },
              buttonsStyling: false
            });
          }
        });
    } else if (type == "custom-html") {
      swal.fire({
        title: "HTML example",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-success mr-1",
        },
        html:
          "You can use <b>bold text</b>, " +
          '<a href="https://github.com">links</a> ' +
          "and other HTML tags"
      });
    } else if (type == "auto-close") {
      swal.fire({
        title: "Auto close alert!",
        text: "I will close in 2 seconds.",
        timer: 2000,
        showConfirmButton: false
      });
    } else if (type == "input-field") {
      swal
        .fire({
          title: "Input something",
          html:
            '<div class="form-group">' +
            '<input id="input-field" type="text" class="form-control" />' +
            "</div>",
          showCancelButton: true,
          customClass: {
            confirmButton: "btn btn-success mr-1",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false
        })
        .then(function (result) {
          swal.fire({
            icon: "success",
            html:
              "You entered: <strong>" +
              (document.getElementById("input-field") as HTMLInputElement)
                .value +
              "</strong>",
            customClass: {
              confirmButton: "btn btn-success",
            },
            buttonsStyling: false
          });
        });
    }
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

  get identityCardField() {
    return this.form?.get('identity_card');
  }

  get identityCardFieldDirty() {
    return this.identityCardField?.dirty || this.identityCardField?.touched;
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

  get stateField() {
    return this.form?.get('state');
  }

  get stateFieldDirty() {
    return this.stateField?.dirty || this.stateField?.touched;
  }

  get countryField() {
    return this.form?.get('country');
  }

  get countryFieldDirty() {
    return this.countryField?.dirty || this.countryField?.touched;
  }

  get birthDateField() {
    return this.form?.get('birth_date');
  }

  get birthDateFieldDirty() {
    return this.birthDateField?.dirty || this.birthDateField?.touched;
  }

  get passwordField() {
    return this.form?.get('password');
  }

  get passwordFieldDirty() {
    return this.passwordField?.dirty || this.passwordField?.touched;
  }

  get confirmPasswordField() {
    return this.form?.get('confirm_password');
  }

  get confirmPasswordFieldDirty() {
    return this.confirmPasswordField?.dirty || this.confirmPasswordField?.touched;
  }

  get termsConditionsField() {
    return this.form?.get('terms_conditions');
  }

  get termsConditionsFieldDirty() {
    return this.termsConditionsField?.dirty || this.termsConditionsField?.touched;
  }

  get datapoliticsField() {
    return this.form?.get('data_politics');
  }

  get datapoliticsFieldDirty() {
    return this.datapoliticsField?.dirty || this.datapoliticsField?.touched;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      identity_card: ['', [Validators.required]],
      country_code: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
      terms_conditions: ['', [Validators.requiredTrue]],
      data_politics: ['', [Validators.requiredTrue]]
    }, {
      validators: MyValidators.matchPasswords
    }
    );

  };


  registerUser(dataForm: any) {

    dataForm.username = dataForm.email;
    console.log(dataForm);

    this.alertsService.showSwal(3, '', '');


    // this.registerService.register(dataFrom).subscribe(res => {
    //   this.notificationService.showNotification('bottom', 'center', 'Te has registrado correctamente', 2);
    //   this.form.reset();
    //   this.router.navigate(['/sign-in'])
    // },
    //   error => {
    //     this.errorMessage = error.error;
    //     console.log(error.error);
    //     this.notificationService.showNotification('bottom', 'center', 'Error al registrarse', 4);
    //   });

  }

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
  }
}
