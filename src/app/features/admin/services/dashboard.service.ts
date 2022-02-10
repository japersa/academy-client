import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ROLES_ENUM } from '../../../shared/enum/roles.enum';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  headers = new HttpHeaders();

  constructor(private http: HttpClient) { }

  getUsersByRole(userRole: ROLES_ENUM): Observable<any> {
    const route = `/list/${userRole}s/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  deleteUser(userId: string): Observable<any> {
    const route = `/delete/user/${userId}/`;
    return this.http.delete<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getUsersByCount():Observable<any> {
    const route = `/list/admin/statistics/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

  getAdminCourses(): Observable<any>{
    const route = `/list/admin/courses/`;
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }

}
