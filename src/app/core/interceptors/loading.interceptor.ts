import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private spinner: NgxSpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.activeRequests += 1;
    if (this.activeRequests === 1) {
      this.spinner.show();
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests -= 1;
        if (this.activeRequests <= 0) {
          this.activeRequests = 0;
          this.spinner.hide();
        }
      })
    );
  }
}
