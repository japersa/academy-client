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

    const data = {
      username: dataFrom.email
    }

    this.subscription$ = this.forgetPasswordService.register(data).pipe(take(1)).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Se ha enviado la solicitud de cambio de clave correctamente', 2);
      this.form.reset();
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
