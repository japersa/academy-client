import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

const apiURL = environment.apiURL;
const route = '/change/password/';

@Injectable({
  providedIn: 'root'
})
export class UpdatePasswordService {

  headers = new HttpHeaders();
  constructor(private http: HttpClient) { }

  updatePassword(data: any): Observable<any>{
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }
}
