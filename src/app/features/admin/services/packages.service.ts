import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class PackagesService {


  constructor(private http: HttpClient) { }

  getPackages(status?: any): Observable<any> {
    const route = `/list/packages/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }


}
