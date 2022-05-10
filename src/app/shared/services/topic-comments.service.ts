import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const apiURL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class TopicCommentsService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  createTopicComment(data): Observable<any> {
    const route = '/create/comment/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

  createReplyComment(data): Observable<any> {
    const route = '/create/reply/comment/';
    return this.http.post<any>(`${apiURL}${route}`, data, { headers: this.headers });
  }

}
