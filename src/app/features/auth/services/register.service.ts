import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    const route = '/signup/';
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  registerByRole(data: any): Observable<any> {
    const route = '/create/user/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  editUser(data: any, id: string): Observable<any> {
    const route = `/update/user/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  getUser(): Observable<any> {
    // const route = '/profile/me/';
    // return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
    const HEADERS = new HttpHeaders();
    const route = '/profile/me/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: HEADERS });
  }

}
