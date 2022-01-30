import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.css']
})
export class PictureUploadComponent implements OnInit {

  avatar = '';
  imgEvent = null;

  file: any = {};
  imagePreviewUrl: any = {};

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(public userDataService: UserDataService,
    public firebaseStorageService: FirebaseStorageService
  ) {
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  ngOnInit() {

    this.avatar = this.userDataService.userData$?.value?.image_profile
    this.file = null;

    this.imagePreviewUrl =
      this.avatar !== ''
        ? this.userDataService.userData$?.value?.image_profile
        : 'assets/img/placeholder.jpg';
  }

  handleImageChange($event) {
    $event.preventDefault();
    const reader = new FileReader();
    const file = $event.target.files[0];
    this.imgEvent = $event;
    reader.onloadend = () => {
      this.file = file;
      this.imagePreviewUrl = reader.result;
      // this.state.imagePreviewUrl1 = reader.result;
    };
    reader.readAsDataURL(file);
  }

  handleClick() {
    // const uuid = self.crypto.randomUUID();
    this.fileInput.nativeElement.click();
  }

  handleRemove() {
    this.file = null;
    this.imagePreviewUrl =
      this.avatar
        ? 'assets/img/placeholder.jpg'
        : 'assets/img/placeholder.jpg';
    this.fileInput.nativeElement.value = null;
  }

  handleSubmit($event) {
    $event.preventDefault();
    this.firebaseStorageService.uploadAvatar(this.imgEvent);
  }

}
