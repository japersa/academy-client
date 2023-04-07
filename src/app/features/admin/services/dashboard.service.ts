import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ROLES_ENUM } from '../../../shared/enum/roles.enum';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUsersByRole(userRole: ROLES_ENUM): Observable<any> {

    const params = new HttpParams()
      .set('page', PageNo)
      .set('sort', SortOn);

    const route = `/list/users/`;
    return this.http.get<any>(`${apiURL}${route}`);
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
