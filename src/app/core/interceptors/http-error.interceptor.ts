import { Injectable, Injector } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { RollbarService } from '../utils/rollbar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor {
  constructor(private injector: Injector, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          const rollbar = this.injector.get(RollbarService);
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            console.log(error.error);

            if (error.status === 401) {
              //   this.notificationsService.presentToast('Your login token has expired');
              this.goToLogin();
            }
          }
          console.log(errorMessage);
          rollbar.error(error);
          return throwError(error);
        })
      );
  }

  goToLogin() {
    this.router.navigate(['/sign-in']);
  }
}
