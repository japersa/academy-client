import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  @Input() course = null;

  courseForm: FormGroup;
  validationMessages: any;

  event;

  @Output() showEvent = new EventEmitter<boolean>();

  errorMessage: string | null;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public firebaseStorageService: FirebaseStorageService,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.courseForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(500)
      ])),
      price: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('[0-9]+,?[0-9]{2}')]
      )),
      path_preview_image: new FormControl('', Validators.compose([
      ]))
    });

  }

  createCourse(dataForm: any) {
    this.firebaseStorageService.updateCourseCover(this.event, dataForm, this.course.id);
    this.showEvent.emit(false);
  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  handleImageChange(event) {
    this.event = event;
  }

  ngOnInit(): void {
  }

}
