import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { RegisterService } from '../../../auth/services/register.service';
import { take } from 'rxjs/operators';

const ROLES = ROLES_ENUM;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {


  roles = [
    {
      name: 'administrador',
      role: ROLES.ADMIN
    },
    {
      name: 'PROFESOR',
      role: ROLES.TEACHER
    },
    {
      name: 'estudiante',
      role: ROLES.STUDENT
    }
  ];

  @Input() user = null;

  createUserForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

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


  editUser(dataFrom: any) {
    console.log('edddd');


    let data: any = {
      username: dataFrom.email,
      first_name: dataFrom.first_name,
      last_name: dataFrom.last_name,
      rol: dataFrom.role,
    }

    if (this.user.username === dataFrom.email) {
      data = {
        first_name: dataFrom.first_name,
        last_name: dataFrom.last_name,
        rol: dataFrom.role,
      }
    }

    this.subscription$ = this.registerService.editUser(data, this.user.id).pipe(take(1)).subscribe(res => {
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

  ngOnInit(): void {
  }

}
