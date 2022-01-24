import { Component, OnInit } from '@angular/core';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { RegisterService } from '../../../auth/services/register.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  roles = [
    {
      name: 'administrador',
      role: ROLES_ENUM.ADMIN
    },
    {
      name: 'PROFESOR',
      role: ROLES_ENUM.TEACHER
    },
    {
      name: 'estudiante',
      role: ROLES_ENUM.STUDENT
    }
  ];

  createUserForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  subscription$: Subscription;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private registerService: RegisterService) {
    this.validationMessages = utilsService.getValidationMessages();

    this.createUserForm = this.formBuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      last_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      role: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    }
    );

  }


  createUser(dataFrom: any) {

    const data = {
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      role: dataFrom.role,
  }

    this.subscription$ = this.registerService.register(data).pipe(take(1)).subscribe(res => {
      console.log(res);
      this.notificationService.showNotification('bottom','center','Usuario registrado correctamente',2);
      this.createUserForm.reset();

    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom','center','Error al registrarse',4);
      });

  }

  ngOnInit(): void {
  }

}
