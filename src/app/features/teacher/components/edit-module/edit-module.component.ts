import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.scss']
})
export class EditModuleComponent implements OnInit, OnDestroy {

  @Input() module = null;
  @Output() showEvent = new EventEmitter<boolean>();

  courses = []

  moduleForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;

  subscription1$: Subscription;
  subscription2$: Subscription;
  subscriptions: Subscription[] = [];

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.moduleForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      course: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1), Validators.maxLength(100)
      ])),
    });

  }

  editarModule(dataForm: any) {
    this.subscription2$ = this.coursesService.updateModule(dataForm, this.module.id).subscribe(res => {
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

    this.subscription1$ = this.coursesService.getCourses().subscribe(res => {
      Object.assign(this.courses, res);
    },
      error => {
        console.log(error.error);
      }
    );

  }

  ngOnInit(): void {
    this.loadCourses()
    this.subscriptions.push(this.subscription1$);
    this.subscriptions.push(this.subscription2$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    })
  }


}
