import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { UserEventsService } from './user-events.service';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  /** Emite cuando llega una notificación nueva por WebSocket (refrescar lista / badge). */
  readonly notificationIncoming$ = new Subject<void>();

  headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
    public toastr: ToastrService,
    userEventsService: UserEventsService,
  ) {
    userEventsService.notificationNew$.subscribe(() => {
      this.notificationIncoming$.next();
      this.showNotification('top', 'right', 'Tienes una nueva notificación', 2);
    });
  }

  /** Un solo icono: el SVG que aporta ngx-toastr (no tim-icons en el HTML). */
  showNotification(from: string, align: string, text: string, color: number) {
    const base = {
      timeOut: 8000,
      closeButton: true,
      positionClass: 'toast-' + from + '-' + align,
    };

    switch (color) {
      case 1:
        this.toastr.info(text, '', base);
        break;
      case 2:
        this.toastr.success(text, '', base);
        break;
      case 3:
        this.toastr.warning(text, '', base);
        break;
      case 4:
        this.toastr.error(text, '', base);
        break;
      case 5:
        this.toastr.show(text, '', base, 'toast-info');
        break;
      default:
        break;
    }
  }

  getDBNotifications(): Observable<any> {
    const route = '/list/my/notifications/';
    return this.http.get<any>(`${apiURL}${route}`, { headers: this.headers });
  }


}
