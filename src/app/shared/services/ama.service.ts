import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AmaService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  getUnansweredQuestions(): Observable<any> {
    const route = '/list/unanswered/comments/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

}
