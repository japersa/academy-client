import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDataService } from '../services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private userDataService: UserDataService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipIntercept = request.headers.has('skip-auth');

    if (skipIntercept) {

      request = request.clone({
        headers: request.headers.delete('skip-auth'),
        setHeaders: {
          'Content-Type': 'application/json',
        }
      });

      return next.handle(request);

    } else {
      const token = this.userDataService.getAccessToken();

      if (token) {
        request = request.clone({
          headers: request.headers.delete('skip-auth'),
          setHeaders: {
            'Content-Type': 'application/json',
            authorization: `Token ${token.replace('"', '')}`,
          }
        });
        return next.handle(request);
      }

    }
  }

}
