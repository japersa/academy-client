import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../../core/services/utils.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrls: ['./create-module.component.scss']
})
export class CreateModuleComponent implements OnInit {

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

  createModule(dataForm: any) {
    this.subscription2$ = this.coursesService.createModule(dataForm).subscribe(res => {
      this.notificationsService.showNotification('bottom', 'center', 'Módulo creado con éxito', 2);
      this.errorMessage = '';
      this.moduleForm.reset();
    },
      error => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.notificationsService.showNotification('bottom', 'center', 'Error al crear módulo', 4);
      }
    );
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
  }


}
