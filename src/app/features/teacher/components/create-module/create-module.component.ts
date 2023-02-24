import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils.service';
import { UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrls: ['./create-module.component.scss']
})
export class CreateModuleComponent implements OnInit, OnDestroy {

  courses = []

  moduleForm: UntypedFormGroup;
  validationMessages: any;

  errorMessage: string | null;

  @Output() showEvent = new EventEmitter<boolean>();


  constructor(
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService,
    private userDataService: UserDataService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.moduleForm = this.formBuilder.group({
      name: new UntypedFormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      course: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
    });

  }

  createModule(dataForm: any) {
    this.coursesService.createModule(dataForm).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Módulo creado con éxito', 2);
      this.errorMessage = '';
      this.moduleForm.reset();
      this.showEvent.emit(false);
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear módulo', 4);
      }
    );
  }

  cancelCreate() {
    this.showEvent.emit(false);
  }


  loadCourses() {

    this.coursesService.getCourses().subscribe(res => {
      if (this.userDataService.userData$.value.rol === 'admin') {
        this.courses = res.all;
      }
      if (this.userDataService.userData$.value.rol === 'teacher') {
        this.courses = res.my_courses_created;
      }
    },
      error => {
        console.log(error.error);
      }
    );

  }

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
  }

}
