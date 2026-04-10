
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../core/services/user-data.service';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  noWrap = false;

  slidesTitle = '';

  itemsPerSlide = 3;
  slides = [
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/fondeo-icon_imbdsw.svg',
      message: 'Fondeo con un broker 100% Real!'
    },
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/capital-icon_pihmxz.svg',
      message: 'Obten capital prestado para operar en el mercado'
    },
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/retiro-beneficios-icon_uobwhd.svg',
      message: 'Retiros de Beneficios'
    },
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/iniciar-mundo-trading_nmbcgy.svg',
      message: 'Te ayudaremos a iniciar en el mundo del trading'
    },
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/multiplicar-capital_rgiv62.svg',
      message: 'Multiplicar tu capital ahora es mucho más seguro y efectivo!'
    },
    {
      image: 'https://res.cloudinary.com/app-intcapex-com/image/upload/v1680689896/invita-amigos-icon_rsljpm.svg',
      message: 'Comiciona invitando a tus amigos'
    }
  ];

  form!: FormGroup;
  validationMessages: any;

  focus;
  focus1;

  errorMessage: string | null;
  loginPending = false;

  /** Paso 2: TOTP tras contraseña correcta con 2FA activo. */
  awaiting2fa = false;
  preAuthToken: string | null = null;
  twoFactorCode = '';

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private authenticationService: AuthService,
    private storageService: StorageService,
    private userDataService: UserDataService,
    public notificationService: NotificationsService,
    private router: Router) {

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

  get passwordField() {
    return this.form?.get('password');
  }

  get rememberPasswordField() {
    return this.form?.get('rememberPassword');
  }

  get passwordFieldDirty() {
    return this.passwordField?.dirty || this.passwordField?.touched;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberPassword: [false]
    });
  }

  loginUser(data: any) {
    if (this.loginPending) {
      return;
    }
    if (this.awaiting2fa) {
      this.verify2fa();
      return;
    }
    const username = String(data?.email ?? '').trim();
    const password = String(data?.password ?? '');
    const CREDENTIALS = { username, password };

    this.loginPending = true;
    this.errorMessage = null;
    this.authenticationService.doLogin(CREDENTIALS).pipe(
      take(1),
      finalize(() => { this.loginPending = false; })
    ).subscribe({
      next: (res: any) => {
        if (res?.two_factor_required && res?.pre_auth_token) {
          this.awaiting2fa = true;
          this.preAuthToken = res.pre_auth_token;
          this.twoFactorCode = '';
          this.errorMessage = null;
          return;
        }
        this.notificationService.showNotification('top', 'right', 'Has iniciado sesión correctamente', 2);
        this.errorMessage = null;
        this.form.reset();
      },
      error: (e) => {
        const err = e?.error;
        if (typeof err === 'string') {
          this.errorMessage = err;
        } else if (Array.isArray(err)) {
          this.errorMessage = err.join(' ');
        } else if (err?.non_field_errors?.length) {
          this.errorMessage = err.non_field_errors.join(' ');
        } else if (err?.detail) {
          this.errorMessage = String(err.detail);
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos. Comprueba que el usuario exista en la plataforma.';
        }
        this.notificationService.showNotification('top', 'right', 'Error al iniciar sesión', 4);
      }
    });
  }

  verify2fa() {
    if (!this.preAuthToken || !String(this.twoFactorCode ?? '').trim()) {
      this.errorMessage = 'Introduce el código de 6 dígitos de tu app de autenticación.';
      return;
    }
    this.loginPending = true;
    this.errorMessage = null;
    this.authenticationService.completeLogin2fa(this.preAuthToken, this.twoFactorCode).pipe(
      take(1),
      finalize(() => { this.loginPending = false; })
    ).subscribe({
      next: () => {
        this.notificationService.showNotification('top', 'right', 'Has iniciado sesión correctamente', 2);
        this.errorMessage = null;
        this.awaiting2fa = false;
        this.preAuthToken = null;
        this.twoFactorCode = '';
        this.form.reset();
      },
      error: (e) => {
        const err = e?.error;
        if (typeof err === 'string') {
          this.errorMessage = err;
        } else if (err?.detail) {
          this.errorMessage = String(err.detail);
        } else {
          this.errorMessage = 'Código incorrecto o sesión expirada. Vuelve a iniciar sesión.';
        }
        this.notificationService.showNotification('top', 'right', 'Error al verificar el código', 4);
      }
    });
  }

  cancel2fa() {
    this.awaiting2fa = false;
    this.preAuthToken = null;
    this.twoFactorCode = '';
    this.errorMessage = null;
  }

  onSlideRangeChange(indexes: number[] | void): void {
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
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    this.onSlideRangeChange();
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
  }
}

