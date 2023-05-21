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
    const route = `/create/package/`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

  createPackDemo(data: any): Observable<any> {
    const route = `/create/demo/package/`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

  getMyPacks(): Observable<any> {
    const route = `/list/my/packages/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

  getMyOrders() {
    const route = `/list/my/packages/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

  payPackStripe(data) {
    const route = `/payment/package/stripe`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

  payPackCoinpayents(data) {
    const route = `/payment/package-self-management/coinpayments`;
    return this.http.post<any>(`${apiURL}${route}`, data);
  }

  getPacksDemo() {
    const route = `/list/my/packages-demo/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

  getPackageDemoById(id: string): Observable<any> {
    const route = `/retrieve/package-demo/`;
    return this.http.get<any>(`${apiURL}${route}${id}`);
  }

  getPackageById(id: string): Observable<any> {
    const route = `/retrieve/package/`;
    return this.http.get<any>(`${apiURL}${route}${id}`);
  }

}
