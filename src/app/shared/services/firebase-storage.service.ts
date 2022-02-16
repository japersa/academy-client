import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { EditUserService } from './edit-user.service';
import { UserDataService } from '../../core/services/user-data.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { CoursesService } from './courses.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  uploadPercent: Observable<number>;

  constructor(private storage: AngularFireStorage,
    private editUserService: EditUserService,
    private storageService: StorageService,
    private userDataService: UserDataService,
    private coursesService: CoursesService,
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

  uploadCourseCover(event, dataForm) {
    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/mistrades/uploads/courses/covers/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(take(1)).subscribe(imgUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            price: dataForm.price,
            path_preview_image: imgUrl
          }

          this.coursesService.createCourse(data).pipe(take(1)).subscribe(res => {
            console.log(res);

            this.notificationService.showNotification('bottom', 'center', 'Curso creado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al crear curso', 4);
            })
        })
      }))
      .subscribe(res => console.log(res))

  }

  updateCourseCover(event: any, dataForm: any, id: string) {

    if (event === undefined) {
      this.updateCourse(dataForm, id)
      return
    }

    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/mistrades/uploads/courses/covers/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(take(1)).subscribe(imgUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            price: dataForm.price,
            path_preview_image: imgUrl
          }

          this.coursesService.updateCourse(data, id).pipe(take(1)).subscribe(res => {
            console.log(res);

            this.notificationService.showNotification('bottom', 'center', 'Curso editado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al editar curso', 4);
            })
        })
      }))
      .subscribe(res => console.log(res))

  }

  updateCourse(dataForm, id: string) {
    const data = {
      title: dataForm.title,
      description: dataForm.description,
      price: dataForm.price,
    }

    this.coursesService.updateCourse(data, id).pipe(take(1)).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Curso editado con éxito', 2);
    },
      error => {
        console.log('Error: ', error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al editar curso', 4);
      })
  }


  uploadCourseVideo(event, dataForm) {

    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/mistrades/uploads/courses/videos/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(take(1)).subscribe(videoUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            video: videoUrl,
            module: dataForm.module
          }

          this.coursesService.createTopic(data).pipe(take(1)).subscribe(res => {
            this.notificationService.showNotification('bottom', 'center', 'Temario creado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al crear temario', 4);
            })
        })
      }))
      .subscribe(res => console.log(res))

  }
  updateCourseVideo(event, dataForm, id: string) {

    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/mistrades/uploads/courses/videos/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().pipe(take(1)).subscribe(videoUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            video: videoUrl,
            module: dataForm.module
          }

          this.coursesService.updateTopic(data, id).pipe(take(1)).subscribe(res => {
            this.notificationService.showNotification('bottom', 'center', 'Temario creado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al crear temario', 4);
            })
        })
      }))
      .subscribe(res => console.log(res))

  }


}
