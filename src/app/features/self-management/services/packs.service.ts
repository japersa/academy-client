import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PacksService {

  constructor(private http: HttpClient) { }

  createPack(data: any): Observable<any> {
    const route = `/create/package-self-management/`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

  getMyPacks(): Observable<any> {
    const route = `/list/my/package-self-management/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

  getPackById(id) {
    const route = `/retrive/package-self-management/`;
    return this.http.get<any>(`${apiURL}${route}${id}`);
  }


  payPackStripe(data: any): Observable<any> {
    const route = `/payment/package-self-management/stripe`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

} 
