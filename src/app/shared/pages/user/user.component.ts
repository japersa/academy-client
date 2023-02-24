import { UpdatePasswordService } from './../../services/update-password.service';
import { UserDataService } from './../../../core/services/user-data.service';
import { take } from 'rxjs/operators';
import { NotificationsService } from './../../../core/services/notifications.service';
import { UtilsService } from './../../../core/services/utils.service';
import { Subscription } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditUserService } from '../../services/edit-user.service';
import { StorageService } from '../../../core/services/storage.service';
import { CoursesService } from '../../services/courses.service';


@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  approvedCourses = [];

  public rol = '';
  public first_name = this.userDataService.userData$.value.first_name;
  public last_name = this.userDataService.userData$.value.last_name;
  public username = this.userDataService.userData$.value.username;

  showPasswordField = false;
  showButtonPassword = true;

  updateForm: UntypedFormGroup;
  updatePasswordForm: UntypedFormGroup;
  validationMessages: any;
  errorPassMessage: any;
  errorMessage: string | null;

  focus;
  focus1;
  focus2;
  focus4;

  constructor(private formBuilder: UntypedFormBuilder,
    private utilsService: UtilsService,
    public notificationService: NotificationsService,
    private storageService: StorageService,
    private editUserService: EditUserService,
    public userDataService: UserDataService,
    public updatePasswordService: UpdatePasswordService,
    private coursesService: CoursesService
  ) {
    this.validationMessages = utilsService.getValidationMessages();

    this.updateForm = this.formBuilder.group({
      first_name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      last_name: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)])),
      email: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      phone_number: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)])),
      birth_date: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      identity_card: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),

    });
    this.updatePasswordForm = this.formBuilder.group({
      old_password: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)])),
      password: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8)])),
    });
  }

  showUpdatePassword() {
    if (this.showPasswordField) {
      this.showPasswordField = false;
      this.showButtonPassword = true;
      this.updatePasswordForm.reset();
    } else if (this.showPasswordField == false) {
      this.showPasswordField = true;
      this.showButtonPassword = false;
    }
  }

  // Asignar valor al rol del usuario
  setRol(rolLocal: string = this.userDataService.userData$.value.rol) {
    if (rolLocal == 'student') {
      this.rol = 'Estudiante';
    } else if (rolLocal == 'teacher') {
      this.rol = 'Profesor';
    } else if (rolLocal == 'admin') {
      this.rol = 'Administrador'
    } else { this.rol = 'Que putas pasa con el rol' }
    return this.rol;
  }

  // Actualizar info del usuario
  updateUser(dataFrom: any) {

    dataFrom.username = dataFrom.email

    this.editUserService.updateUser(dataFrom).subscribe(res => {
      this.userDataService.userData$.next(res);
      this.storageService.set('userData', res);

      this.notificationService.showNotification('bottom', 'center', 'Has actualizado los datos correctamente', 2);
      this.updateForm.reset();
    },
      error => {
        this.errorMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al actualizar usuario', 4);
      });
  }

  // Actualizar contraseña del usuario
  updatePassword(dataFrom: any) {
    const data = {
      old_password: dataFrom.old_password,
      password: dataFrom.password,
    }
    this.updatePasswordService.updatePassword(data).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Has actualizado los datos correctamente', 2);
      this.updatePasswordForm.reset();
      this.showUpdatePassword();
    },
      error => {
        this.errorPassMessage = error.error;
        console.log(error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al actualizar contraseña', 4);
      });
  }

  getApprovedCourses() {
    this.coursesService.myApprovedCourse().subscribe(
      {
        next: (r) => {
          this.approvedCourses = r; console.log(r);
        },
        error: (e) => console.log(e.error)
      }
    );
  }

  generateCertificate(courseId: string) {
    console.log(courseId);

    this.coursesService.getCertificate(courseId).subscribe(
      {
        next: (response) => {

          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob([response.body], { type: response.body.type }));

          // const contentDisposition = response.headers.get('content-disposition');
          const fileName = `${crypto.randomUUID()}.pdf`;
          downloadLink.download = fileName;

          downloadLink.click();
        },
        error: (e) => console.log(e),
        complete: () => console.log('complete')
      }
    );
  }

  ngOnInit() {

    this.getApprovedCourses();

    this.setRol();

    var body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
  }
}
