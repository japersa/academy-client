import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';
import { take } from 'rxjs/operators';
import { af$ } from '../utils/angularfire-rxjs';
import { EditUserService } from './edit-user.service';
import { UserDataService } from '../../core/services/user-data.service';
import { StorageService } from '../../core/services/storage.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { CoursesService } from './courses.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  course: any = {};

  downloadURLsFiles = [];

  uploadPercent: Observable<number | undefined>;
  uploadPercentFiles: Observable<number | undefined>;

  constructor(private storage: AngularFireStorage,
    private editUserService: EditUserService,
    private storageService: StorageService,
    private userDataService: UserDataService,
    private coursesService: CoursesService,
    public notificationService: NotificationsService) { }

  uploadAvatar(event) {

    const file = event.target.files[0];
    const filePath = `/ultra/uploads/avatares/${this.userDataService.getUsername()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = af$(task.percentageChanges());

    // get notified when the download URL is available
    af$(task.snapshotChanges()).pipe(
      finalize(() => {
        af$(fileRef.getDownloadURL()).pipe(take(1)).subscribe(imgUrl => {
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
      .subscribe()

  }

  uploadCourseCover(event, dataForm) {
    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/ultra/uploads/courses/covers/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = af$(task.percentageChanges());

    // get notified when the download URL is available
    af$(task.snapshotChanges()).pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(imgUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            price: dataForm.price,
            path_preview_image: imgUrl
          }

          this.coursesService.createCourse(data).subscribe(res => {
            Object.assign(this.course, res)
            this.notificationService.showNotification('bottom', 'center', 'Curso creado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al crear curso', 4);
            })
        })
      }))
      .subscribe()

  }

  updateCourseCover(event: any, dataForm: any, id: string) {

    if (event === (undefined || null)) {
      this.updateCourse(dataForm, id)
      return
    }

    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/ultra/uploads/courses/covers/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = af$(task.percentageChanges());

    // get notified when the download URL is available
    af$(task.snapshotChanges()).pipe(
      finalize(() => {
        af$(fileRef.getDownloadURL()).pipe(take(1)).subscribe(imgUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            price: dataForm.price,
            path_preview_image: imgUrl
          }

          this.coursesService.updateCourse(data, id).pipe(take(1)).subscribe(res => {
            this.notificationService.showNotification('bottom', 'center', 'Curso editado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al editar curso', 4);
            })
        })
      }))
      .subscribe()

  }

  updateCourse(dataForm, id: string) {
    const data = {
      title: dataForm.title,
      description: dataForm.description,
      price: dataForm.price,
    }

    this.coursesService.updateCourse(data, id).subscribe(res => {
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

    const filePath = `/ultra/uploads/courses/videos/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = af$(task.percentageChanges());

    // get notified when the download URL is available
    af$(task.snapshotChanges()).pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(videoUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            video: filePath,
            module: dataForm.module,
            files: this.downloadURLsFiles,
            links: dataForm.links
          }

          this.coursesService.createTopic(data).subscribe(res => {
            this.notificationService.showNotification('bottom', 'center', 'Temario creado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al crear temario', 4);
            })
        })
      }))
      .subscribe()

  }

  uploadCourseFiles(event) {

    const files = event.target.files;

    for (const file of files) {
      const randomId = Math.random().toString(36).substring(2);

      const filePath = `/ultra/uploads/courses/files/${randomId + '-' + Date.now()}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      this.downloadURLsFiles = [];

      // observe percentage changes
      this.uploadPercentFiles = af$(task.percentageChanges());

      // get notified when the download URL is available
      af$(task.snapshotChanges()).pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.downloadURLsFiles.push({ name: file.name, path: filePath, url })
          });
        })
      ).subscribe();

    }

  }

  updateCourseVideo(event, dataForm, id: string) {

    if (event === (undefined || null)) {
      this.updateVideo(dataForm, id)
      return
    }

    const randomId = Math.random().toString(36).substring(2);

    const file = event.target.files[0];

    const filePath = `/ultra/uploads/courses/videos/${randomId}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = af$(task.percentageChanges());

    // get notified when the download URL is available
    af$(task.snapshotChanges()).pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(videoUrl => {

          const data = {
            title: dataForm.title,
            description: dataForm.description,
            video: filePath,
            module: dataForm.module,
            links: dataForm.links
          }

          this.coursesService.updateTopic(data, id).subscribe(res => {
            this.notificationService.showNotification('bottom', 'center', 'Temario editado con éxito', 2);

          },
            error => {
              console.log('Error: ', error.error);
              this.notificationService.showNotification('bottom', 'center', 'Error al editar temario', 4);
            })
        })
      }))
      .subscribe()

  }

  updateVideo(dataForm, id: string) {
    const data: any = {
      title: dataForm.title,
      description: dataForm.description,
      module: dataForm.module
    }

    if (this.downloadURLsFiles.length > 0) {
      data.files = this.downloadURLsFiles
    }

    this.coursesService.updateTopic(data, id).subscribe(res => {
      this.notificationService.showNotification('bottom', 'center', 'Temario creado con éxito', 2);
    },
      error => {
        console.log('Error: ', error.error);
        this.notificationService.showNotification('bottom', 'center', 'Error al crear temario', 4);
      })
  }

}
