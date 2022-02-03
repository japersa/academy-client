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
    console.log(data);
    
    const route = '/create/course/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }
}
