import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.scss']
})
export class EditModuleComponent implements OnInit, OnDestroy {

  @Input() module = null;
  @Output() showEvent = new EventEmitter<boolean>();

  courses = []

  currentCourse = '';

  moduleForm: UntypedFormGroup;
  validationMessages: any;

  errorMessage: string | null;

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

  editarModule(dataForm: any) {
    this.coursesService.updateModule(dataForm, this.module.id).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Módulo editado con éxito', 2);
      this.errorMessage = '';
      this.moduleForm.reset();
      this.showEvent.emit(false);
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al editar módulo', 4);
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

  setValues() {
    this.moduleForm.patchValue({ name: this.module.name })
  }

  getCourseName() {
    this.coursesService.getCourseById(this.module.course).subscribe(res => {
      this.currentCourse = res.title
    },
      error => {
        console.log(error.error);
      }
    );
  }

  ngOnInit(): void {
    this.loadCourses();
    this.setValues();
    this.getCourseName();

  }

  ngOnDestroy(): void {
  }

}
