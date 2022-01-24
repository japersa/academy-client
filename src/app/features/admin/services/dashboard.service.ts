import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  getAdmins(): Observable<any> {
    const route = '/list/admins/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getStudents(): Observable<any> {
    const route = '/list/students/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getTeachers(): Observable<any> {
    const route = '/list/teachers/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }
}
