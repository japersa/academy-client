import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ROLES_ENUM } from '../../../shared/enum/roles.enum';

const apiURL = environment.apiURL;

interface IUsersParams {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  rol?: ROLES_ENUM;
  subscription?: string;
  identity_card?: string;
  phone_number?: string,
  username?: string;
  deferred_name?: string;
  deferred_document_number?: string;
  referral_code?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUsersByRole(options?: Partial<IUsersParams>): Observable<any> {

    // const params = new HttpParams()
    console.log(options);
    

    const route = `/list/users/`;
    return this.http.get<any>(`${apiURL}${route}`, { params: options });
  }

  deleteUser(userId: string): Observable<any> {
    const route = `/delete/user/${userId}/`;
    return this.http.delete<any>(`${apiURL}${route}`);
  }

  getUsersByCount(): Observable<any> {
    const route = `/list/admin/statistics/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

  getAdminCourses(): Observable<any> {
    const route = `/list/admin/courses/`;
    return this.http.get<any>(`${apiURL}${route}`);
  }

}
