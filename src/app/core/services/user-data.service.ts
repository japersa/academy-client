import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  public userData$ = new BehaviorSubject(null);
  public accessToken$ = new BehaviorSubject('null');
  public isUserLoggedIn$ = new BehaviorSubject(false);

  constructor(private storageService: StorageService) { }

  async loadStorageUserData() {
    await this.setUserData();
    await this.setToken();
    await this.setLoggedIn();
  }

  async setUserData() {

    try {
      const data = await this.storageService.get('userData');
      this.userData$.next(JSON.parse(data));
    } catch (error) {
      console.log(error);
    }

  }
  async setLoggedIn() {

    try {
      const data = await this.storageService.get('isUserLoggedIn');
      this.isUserLoggedIn$.next(JSON.parse(data));
    } catch (error) {
      console.log(error);
    }

  }
  async setToken() {

    try {
      const token = await this.storageService.get('accessToken');
      this.accessToken$.next(JSON.parse(token));
    } catch (error) {
      console.log(error);
    }

  }

  getUsername() {
    return this.userData$.value.username;
  }

  getLoggedIn() {
    return this.isUserLoggedIn$.value;
  }

  getAccessToken() {
    return this.accessToken$.value;
  }
}
