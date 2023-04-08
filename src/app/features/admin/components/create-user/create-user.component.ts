import { Component, Output, EventEmitter } from '@angular/core';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { RegisterService } from '../../../auth/services/register.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { SUBS_ENUM } from '../../../../shared/enum/subcriptions.enum';
import { UserDataService } from '../../../../core/services/user-data.service';

const ROLES = ROLES_ENUM;

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  roles = [
    {
      name: 'administrador',
      role: ROLES.ADMIN
    },
    {
      name: 'PROFESOR',
      role: ROLES.TEACHER
    },
  ];

  courses = [];

  createUserForm: UntypedFormGroup;
  validationMessages: any;
  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: UntypedFormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private registerService: RegisterService) {
    this.validationMessages = utilsService.getValidationMessages();

    this.createUserForm = this.formBuilder.group({
      first_name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      last_name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      role: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ]))
    }
    );

  }

  createUser(dataFrom: any) {

    let data = {
      username: dataFrom.email,
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      rol: dataFrom.role,
      email: dataFrom.email
    };

    this.registerService.registerByRole(data).subscribe(res => {
      this.showEvent.emit(false);
      this.notificationService.showNotification('bottom', 'center', 'Usuario registrado correctamente', 2);
      this.createUserForm.reset();
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al registrarse', 4);
      });

  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

}
