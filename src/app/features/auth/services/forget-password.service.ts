import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';

const apiURL = environment.apiURL;
const route = '/reset/password/';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }
}
