import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;
const route = '/login/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  doLogin(credentials: any): Observable<any> {
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(`${apiURL}${route}`, credentials, { headers: this.headers });
  }

}
