import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { EditUserService } from './edit-user.service';
import { UserDataService } from '../../core/services/user-data.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationsService } from '../../core/services/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  uploadPercent: Observable<number>;


  constructor(private storage: AngularFireStorage,
    private editUserService: EditUserService,
    private storageService: StorageService,
    private userDataService: UserDataService,
    public notificationService: NotificationsService) { }

  uploadAvatar(event) {
    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];
    const filePath = `/mistrades/uploads/avatares/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(take(1)).subscribe(imgUrl => {
          this.editUserService.updateUser({ image_profile: imgUrl }).pipe(take(1))
            .subscribe(res => {

              // save data in local storage
              this.storageService.set('userData', res);
              this.userDataService.loadStorageUserData();
              this.userDataService.userData$.next(res);

            },
              error => {
                console.log('Error: ', error.error);
                this.notificationService.showNotification('bottom', 'center', 'Error al actualizar avatar', 4);
              })
        })
      }))
      .subscribe(res => console.log(res))

  }
}
