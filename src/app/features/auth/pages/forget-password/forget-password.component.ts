import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilsService } from '../../../../core/services/utils.service';
import { ForgetPasswordService } from '../../services/forget-password.service';

@Component({
  selector: 'app-register',
  templateUrl: 'forget-password.component.html'
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  subscription$: Subscription;

  focus;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
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
      console.log(res);
      this.registerForm.reset();
    },
      error => {
        this.errorMessage = error.error;
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
