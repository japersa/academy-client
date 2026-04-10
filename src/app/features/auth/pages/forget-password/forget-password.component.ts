import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from '../../../../core/services/utils.service';
import { ForgetPasswordService } from '../../services/forget-password.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  slidesTitle = '';
  itemsPerSlide = 3;
  slides = [
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/fondeo-icon_imbdsw.svg', 
      message: 'Fondeo con un broker 100% Real!' 
    },
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/capital-icon_pihmxz.svg', 
      message: 'Obten capital prestado para operar en el mercado' 
    },
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/retiro-beneficios-icon_uobwhd.svg', 
      message: 'Retiros de Beneficios' 
    },
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/iniciar-mundo-trading_nmbcgy.svg',
      message: 'Te ayudaremos a iniciar en el mundo del trading'
    },
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/multiplicar-capital_rgiv62.svg',
      message: 'Multiplicar tu capital ahora es mucho más seguro y efectivo!'
    },
    { image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/invita-amigos-icon_rsljpm.svg',
      message: 'Comiciona invitando a tus amigos'
    }
  ];

  form!: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  subscription$: Subscription;

  focus;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private router: Router,
    private forgetPasswordService: ForgetPasswordService) {

    this.validationMessages = utilsService.getValidationMessages();
    this.buildForm();  
  }

  //declare getters for ech field
  get emailField() {
    return this.form?.get('email');
  }
  get emailFieldDirty() {
    return this.emailField?.dirty || this.emailField?.touched;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
    });
  }

  recoverUser(dataFrom: any) {
    // JSON.stringify omite undefined: sin esto el POST puede ir como {} y el API devuelve 400.
    const email = String(dataFrom?.email ?? '').trim();
    const data = {
      username: email,
      email: email,
    };

    this.subscription$ = this.forgetPasswordService.register(data).pipe(take(1)).subscribe(res => {
      this.notificationService.showNotification('top', 'right', 'Se ha enviado la solicitud de cambio de clave correctamente', 2);
      this.form.reset();
      this.router.navigate(['/sign-in'])

    },
      error => {
        const err = error?.error;
        if (typeof err === 'string') {
          this.errorMessage = err;
        } else if (Array.isArray(err)) {
          this.errorMessage = err.join(' ');
        } else if (err?.non_field_errors?.length) {
          this.errorMessage = err.non_field_errors.join(' ');
        } else if (err?.username?.length) {
          this.errorMessage = Array.isArray(err.username) ? err.username[0] : String(err.username);
        } else if (err?.detail) {
          this.errorMessage = String(err.detail);
        } else {
          this.errorMessage = 'No se pudo enviar el correo. Comprueba el email e inténtalo de nuevo.';
        }
        this.notificationService.showNotification('top', 'right', 'Ha surgido un error', 4);
      });

  }

  onSlideRangeChange(indexes: number[]|void): void {
    if (indexes && indexes.length > 0) {
      // Verificar si los índices incluyen 0, 1 y 2
      if (indexes.includes(0) && indexes.includes(1) && indexes.includes(2)) {
        this.slidesTitle = 'Funding Program';
      } else {
        this.slidesTitle = 'Academia';
      }
    }
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("lock-page");
    this.onSlideRangeChange();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("lock-page");
  }


}
