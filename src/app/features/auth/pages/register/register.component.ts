import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from '../../../../core/services/utils.service';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  subscription$: Subscription;

  focus;
  focus1;
  focus2;
  focus4;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
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
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)])),
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

    this.subscription$ = this.registerService.register(data).pipe(take(1)).subscribe(res => {
      console.log(res);
      this.registerForm.reset();

    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
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
