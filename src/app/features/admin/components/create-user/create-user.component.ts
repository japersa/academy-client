import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ROLES_ENUM } from 'src/app/shared/enum/roles.enum';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { RegisterService } from '../../../auth/services/register.service';
import { take } from 'rxjs/operators';
import { CoursesService } from '../../../../shared/services/courses.service';
import { SUBS_ENUM } from '../../../../shared/enum/subcriptions.enum';

const ROLES = ROLES_ENUM;
const SUBS = SUBS_ENUM;

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

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

  subscriptions = [
    {
      name: 'Ninguna',
      sub: SUBS.NONE
    },
    {
      name: 'Básica',
      sub: SUBS.BASIC
    },
    {
      name: 'Full',
      sub: SUBS.FULL
    }
  ]

  courses = [];

  createUserForm: FormGroup;
  validationMessages: any;
  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private coursesService: CoursesService,
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
      courses_ids: new FormControl('', Validators.compose([
      ])),
      subscription: new FormControl('', Validators.compose([
      ])),
    }
    );

  }

  createUser(dataFrom: any) {

    let data = {}

    if (dataFrom.subscription === SUBS.BASIC) {
      data = {
        username: dataFrom.email,
        first_name: dataFrom.first_name,
        last_name: dataFrom.last_name,
        rol: dataFrom.role,
        subscription: dataFrom.subscription,
        courses_ids: dataFrom.courses_ids,
        email: dataFrom.email
      }
    } else {
      data = {
        username: dataFrom.email,
        first_name: dataFrom.first_name,
        last_name: dataFrom.last_name,
        rol: dataFrom.role,
        subscription: dataFrom.subscription,
        email: dataFrom.email
      }
    }

    this.registerService.registerByRole(data).pipe(take(1)).subscribe(res => {
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


  ngOnInit(): void {

    this.coursesService.getCourses().pipe(take(1)).subscribe(res => {
      this.courses = res.my_courses_created;
    },
      error => {
        console.log(error.error);
      });


  }

  ngOnDestroy(): void {

  }


}
