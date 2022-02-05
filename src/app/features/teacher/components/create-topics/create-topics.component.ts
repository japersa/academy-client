import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-create-topics',
  templateUrl: './create-topics.component.html',
  styleUrls: ['./create-topics.component.scss']
})
export class CreateTopicsComponent implements OnInit {

  modules = [];

  topicForm: FormGroup;
  validationMessages: any;

  errorMessage: string | null;


  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.topicForm = this.formBuilder.group({
      course: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      video: new FormControl('', Validators.compose([
      ])),
      files: new FormControl('', Validators.compose([
      ]))
    });

  }

  createTopic(dataForm: any) {
    console.log(dataForm);
  }

  ngOnInit(): void {
  }


}
