import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataService } from '../../../core/services/user-data.service';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const apiURL = environment.apiURL;
const route = '/login/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient, private router: Router,
    private storageService: StorageService, private userDataService: UserDataService) { }

  doLogin(credentials: any): Observable<any> {
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(`${apiURL}${route}`, credentials, { headers: this.headers }).pipe(tap(res => {
      // save data in local storage
      this.storageService.set('isUserLoggedIn', true);
      this.storageService.set('accessToken', res.token);
      this.storageService.set('userData', res.user);

      // load data at memory
      this.userDataService.loadStorageUserData();
      this.userDataService.isUserLoggedIn$.next(true);

      this.router.navigate(['/referrals']);
    })

    )
  }

  doLogout() {
    this.storageService.clear();
    this.userDataService.userData$.next(null);
    this.userDataService.accessToken$.next(null);
    this.userDataService.isUserLoggedIn$.next(null);
    this.router.navigate(['/sign-in']);
  }

}
