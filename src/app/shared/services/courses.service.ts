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

  // Courses

  createCourse(data: any): Observable<any> {
    const route = '/create/course/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  getCourses(): Observable<any> {
    const route = '/my/courses/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  updateCourse(data: any, id: any): Observable<any> {
    const route = `/update/course/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteCourse(id: string) {
    const route = `/delete/course/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  // Modules
  getModules(): Observable<any> {
    const route = '/my/modules/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createModule(data: any): Observable<any> {
    const route = '/create/module/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  updateModule(data: any, id: any): Observable<any> {
    const route = `/update/module/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteModule(id: string) {
    const route = `/delete/module/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  // Topics
  getTopics(): Observable<any> {
    const route = '/my/topics/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  createTopic(data: any): Observable<any> {
    const route = '/create/topic/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  updateTopic(data: any, id: any): Observable<any> {
    const route = `/update/module/${id}/`;
    return this.http.patch<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  deleteTopic(id: string) {
    const route = `/delete/module/${id}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

}
