import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';
import { CoursesService } from '../../../../shared/services/courses.service';
import { NotificationsService } from '../../../../core/services/notifications.service';

function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj
}

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnChanges {

  @Input() course = null;

  courseForm: UntypedFormGroup;
  validationMessages: any;

  event;

  @Output() showEvent = new EventEmitter<boolean>();

  errorMessage: string | null;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    public firebaseStorageService: FirebaseStorageService,
    private coursesService: CoursesService,
    private notificationsService: NotificationsService
  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.courseForm = this.formBuilder.group({
      title: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ])),
      description: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(500)
      ])),
      price: new UntypedFormControl('0', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('^\\d+\\.?\\d{0,2}$')]
      )),
      path_preview_image: new UntypedFormControl(null, Validators.compose([
      ]))
    });

  }

  createCourse(dataForm: any) {

    dataForm = clean(dataForm)

    if (dataForm.path_preview_image) {
      this.firebaseStorageService.updateCourseCover(this.event, dataForm, this.course.id);
      this.firebaseStorageService.uploadPercent.subscribe(() => {
        this.firebaseStorageService.uploadPercent = null;
        setTimeout(() => this.showEvent.emit(false), 2000);
      }
      );
    } else {

      const data = {
        title: dataForm.title,
        description: dataForm.description,
      }

      this.coursesService.updateCourse(data, this.course.id).subscribe(res => {
        setTimeout(() => this.showEvent.emit(false), 2000);
        this.notificationsService.showNotification('bottom', 'center', 'Curso editado con éxito', 2);

      },
        error => {
          console.log('Error: ', error.error);
          this.notificationsService.showNotification('bottom', 'center', 'Error al editar curso', 4);
        })

    }


  }

  cancelCreate() {
    this.showEvent.emit(false);
  }

  handleImageChange(event) {
    this.event = event;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && this.course) {
      this.courseForm.patchValue({
        title: this.course.title ?? '',
        description: this.course.description ?? '',
        price:
          this.course.price != null && this.course.price !== ''
            ? String(this.course.price)
            : '0',
        path_preview_image: null,
      });
    }
  }

}
