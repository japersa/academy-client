
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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

  form!: FormGroup; 
 /*  loginForm: FormGroup; */
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

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      password: ['', Validators.compose([
        Validators.required, Validators.minLength(8)
      ])] 
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
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

