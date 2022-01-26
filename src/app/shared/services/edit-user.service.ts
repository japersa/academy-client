import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const apiURL = environment.apiURL;
const route = '/update/profile/';

@Injectable({
  providedIn: 'root'
})
export class EditUserService {

  headers = new HttpHeaders();
  constructor(private http: HttpClient) { }

  updateUser(data: any): Observable<any>{
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }
}
