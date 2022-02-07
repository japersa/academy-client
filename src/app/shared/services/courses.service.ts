import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;



@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  createCourse(data: any): Observable<any> {
    const route = '/create/course/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  getCourses(): Observable<any> {
    const route = '/my/courses/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createModule(data: any): Observable<any> {
    const route = '/create/module/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  getModules(): Observable<any> {
    const route = '/my/courses/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

}
