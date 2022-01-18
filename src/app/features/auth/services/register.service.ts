import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const apiURL = environment.apiURL;
const route = '/signup/';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    this.headers = this.headers.set('skip-auth', 'true');
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

}
