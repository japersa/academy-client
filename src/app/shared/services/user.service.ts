import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get<any>(`${apiURL}/profile/me`);
  }
}

export interface ReferredUserRow {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  date_joined: string;
}
