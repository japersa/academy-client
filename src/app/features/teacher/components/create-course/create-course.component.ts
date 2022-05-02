import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { take, finalize } from 'rxjs/operators';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit, OnDestroy {

  courseForm: FormGroup;
  validationMessages: any;

  event = null;

  @Output() showEvent = new EventEmitter<boolean>();

  errorMessage: string | null;

  suscription$: Subscription;

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
        Validators.maxLength(2000)
      ])),
      price: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^\\d+\\.?\\d{0,2}$')]
      )),
      path_preview_image: new FormControl('', Validators.compose([
      ])
      )
    });

  }

  createCourse(dataForm: any) {
    this.firebaseStorageService.uploadCourseCover(this.event, dataForm);
    this.suscription$ = this.firebaseStorageService.uploadPercent.pipe(finalize(() => {
      this.showEvent.emit(false);
    })).subscribe();
  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  handleImageChange(event) {
    this.event = event;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.suscription$ !== undefined) {
      this.suscription$.unsubscribe();
    }
  }

}
