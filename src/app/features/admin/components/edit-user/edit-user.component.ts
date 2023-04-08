import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { RegisterService } from '../../../auth/services/register.service';

const ROLES = ROLES_ENUM;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  roles = [
    {
      name: 'administrador',
      role: ROLES.ADMIN
    },
    {
      name: 'PROFESOR',
      role: ROLES.TEACHER
    }
  ];


  courses = [];

  @Input() user = null;

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
      ])),
    }
    );

  }


  editUser(dataFrom: any) {

    let data = {
      username: dataFrom.email,
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      rol: dataFrom.role,
      subscription: dataFrom.subscription,
      email: dataFrom.email
    };

    this.registerService.editUser(data, this.user.id).subscribe(res => {
      this.showEvent.emit(false);
      this.notificationService.showNotification('bottom', 'center', 'Usuario editado correctamente', 2);
      this.createUserForm.reset();
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al editar', 4);
      });

  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

}
