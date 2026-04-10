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
const route2fa = '/login/2fa/';

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
      if (res?.two_factor_required) {
        return;
      }
      this.storageService.set('isUserLoggedIn', true);
      this.storageService.set('accessToken', res.token);
      this.storageService.set('userData', res.user);

      this.userDataService.loadStorageUserData();
      this.userDataService.isUserLoggedIn$.next(true);

      this.router.navigate(['/referrals']);
    })

    )
  }

  /** Segundo paso cuando el usuario tiene 2FA activo (TOTP). */
  completeLogin2fa(pre_auth_token: string, otp: string): Observable<any> {
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(
      `${apiURL}${route2fa}`,
      { pre_auth_token, otp: String(otp).trim() },
      { headers: this.headers }
    ).pipe(tap(res => {
      this.storageService.set('isUserLoggedIn', true);
      this.storageService.set('accessToken', res.token);
      this.storageService.set('userData', res.user);

      this.userDataService.loadStorageUserData();
      this.userDataService.isUserLoggedIn$.next(true);

      this.router.navigate(['/referrals']);
    }));
  }

  doLogout() {
    this.storageService.clear();
    this.userDataService.userData$.next(null);
    this.userDataService.accessToken$.next(null);
    this.userDataService.isUserLoggedIn$.next(null);
    this.router.navigate(['/sign-in']);
  }

}
