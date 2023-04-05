
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

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
 
  focus;
  focus1;

  errorMessage: string | null;

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
      email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberPassword:[false]
    });
  }

  loginUser(data: any) {

    const CREDENTIALS = {
      username: data.email,
      password: data.password
    }

    this.authenticationService.doLogin(CREDENTIALS).subscribe(res => {

      this.notificationService.showNotification('bottom', 'center', 'Has iniciado sesión correctamente', 2);
      this.errorMessage = '';

      this.form.reset();

      setTimeout(() => {
        this.router.navigate(['/home'])
      }, 300);

    },
      error => {
        this.errorMessage = error.error;
        this.notificationService.showNotification('bottom', 'center', 'Error al iniciar sesión', 4);
      });

  }

  ngOnInit() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
  }
}

