import { NotificationsService } from 'src/app/core/services/notifications.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from '../../../../core/services/utils.service';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private router: Router,
    private registerService: RegisterService) {

    this.validationMessages = utilsService.getValidationMessages();

    this.registerForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      last_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8)
      ]))
    }
    );

  }

  registerUser(dataFrom: any) {

    const data = {
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      username: dataFrom.email,
      password: dataFrom.password
    }

    this.registerService.register(data).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Te has registrado correctamente', 2);
      this.registerForm.reset();
      this.router.navigate(['/sign-in'])
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al registrarse', 4);
      });

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
