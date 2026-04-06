import { UpdatePasswordService } from './../../services/update-password.service';
import { UserDataService } from './../../../core/services/user-data.service';
import { NotificationsService } from './../../../core/services/notifications.service';
import { UtilsService } from './../../../core/services/utils.service';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditUserService } from '../../services/edit-user.service';
import { StorageService } from '../../../core/services/storage.service';
import { CoursesService } from '../../services/courses.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  user = {};
  approvedCourses = [];

  public rol = '';
  public first_name = '';
  public last_name = '';
  public username = '';

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
    private coursesService: CoursesService,
    private userService: UserService
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
  setRol(rolLocal: string = this.userDataService.userData$.value?.rol) {
    if (rolLocal === 'student') {
      this.rol = 'Estudiante';
    } else if (rolLocal === 'teacher') {
      this.rol = 'Profesor';
    } else if (rolLocal === 'admin') {
      this.rol = 'Administrador';
    } else {
      this.rol = 'Usuario';
    }
    return this.rol;
  }

  /** Etiqueta en español; evita mostrar "None" por titlecase sobre el valor `none`. */
  get subscriptionLabelText(): string {
    const s = this.userDataService?.userData$?.value?.subscription;
    if (s === 'full') {
      return 'Start Academy';
    }
    if (s === 'basic') {
      return 'Básico';
    }
    if (s === 'none' || !s) {
      return 'Sin suscripción';
    }
    return String(s);
  }

  // Actualizar info del usuario
  updateUser(dataFrom: any) {

    dataFrom.username = dataFrom.email

    this.editUserService.updateUser(dataFrom).subscribe(res => {
      this.userDataService.userData$.next(res);
      void this.storageService.set('userData', res);

      this.notificationService.showNotification('bottom', 'center', 'Has actualizado los datos correctamente', 2);
      this.patchProfileForm(res);
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

  getUser() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.userDataService.userData$.next(user);
        void this.storageService.set('userData', user);
        this.patchProfileForm(user);
      },
      error: (err) => console.error(err),
    });
  }

  /** Rellena el formulario; evita ngModel sobre userData$.value nulo o incompleto. */
  private patchProfileForm(user: Record<string, unknown> | null | undefined): void {
    if (!user || typeof user !== 'object') {
      return;
    }
    const u = user;
    this.updateForm.patchValue({
      first_name: (u['first_name'] as string) ?? '',
      last_name: (u['last_name'] as string) ?? '',
      email: (u['username'] as string) ?? (u['email'] as string) ?? '',
      phone_number: (u['phone_number'] as string) ?? '',
      birth_date: this.normalizeDateInput(u['birth_date']),
      identity_card: (u['identity_card'] as string) ?? '',
    });
    this.first_name = String(u['first_name'] ?? '');
    this.last_name = String(u['last_name'] ?? '');
    this.username = String(u['username'] ?? '');
    this.setRol((u['rol'] as string) ?? undefined);
  }

  private normalizeDateInput(value: unknown): string {
    if (value == null || value === '') {
      return '';
    }
    const s = String(value);
    return s.length >= 10 ? s.slice(0, 10) : s;
  }

  ngOnInit() {

    this.getUser();

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
