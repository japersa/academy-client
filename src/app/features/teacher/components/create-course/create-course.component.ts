import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../../../core/services/utils.service';
import { FirebaseStorageService } from '../../../../shared/services/firebase-storage.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  courseForm: FormGroup;
  validationMessages: any;

  focus;
  focus1;

  errorMessage: string | null;

  subscription$: Subscription;

  constructor(
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    public firebaseStorageService: FirebaseStorageService

  ) {

    this.validationMessages = utilsService.getValidationMessages();

    this.courseForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(8), Validators.maxLength(100)
      ])),
      price: new FormControl('', Validators.compose([
        Validators.required, Validators.min(1)
      ])),
      path_preview_image: new FormControl('', Validators.compose([
        Validators.required
      ])
      )
    });

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createCourse(s) { console.log(s) }

}
