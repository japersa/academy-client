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

  registerForm: FormGroup;
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

    this.registerForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]))
    }
    );

  }



  recoverUser(dataFrom: any) {

    const data = {
      username: dataFrom.email
    }

    this.subscription$ = this.forgetPasswordService.register(data).pipe(take(1)).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Se ha enviado la solicitud de cambio de clave correctamente', 2);
      this.registerForm.reset();
      this.router.navigate(['/sign-in'])

    },
      error => {
        this.errorMessage = error.error;
        this.notificationService.showNotification('bottom', 'center', 'Ha surgido un error', 4);
        console.log(error.error);
      });

  }


  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("lock-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("lock-page");
  }


}
