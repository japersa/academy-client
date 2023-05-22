import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;


@Injectable({
  providedIn: 'root'
})
export class PackagesService {

  headers = new HttpHeaders();  

  constructor(private http: HttpClient) { }
 
  getPackages(status?: any): Observable<any> {
    const route = `/list/packages/`;
    let params = new HttpParams().set('status', status );
    return this.http.get<any>(`${apiURL}${route}`, { params: params });
  }

  getPackagesById(id: string): Observable<any> {
    const route = `/retrieve/package/`;
    return this.http.get<any>(`${apiURL}${route}${id}`);
  }

  updatePackage(data: any, id: any): Observable<any> {    
    const route = `/update/package/`;
    return this.http.patch<any>(`${apiURL}${route}${id}/`, data, { headers: this.headers });
  }
}
