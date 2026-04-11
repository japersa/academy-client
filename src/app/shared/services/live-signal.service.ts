import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, merge, Observable, timer } from 'rxjs';
import { distinctUntilChanged, filter, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/** Cada cuánto se pregunta al API si hay señal en vivo (menú + pulso). */
const LIVE_SIGNAL_POLL_MS = 5_000;

export interface LiveSignalStatus {
  active: boolean;
  title?: string;
  embed_url?: string;
}

export interface LiveSignalAdminPayload {
  is_live: boolean;
  title: string;
  stream_url: string;
  min_subscription: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class LiveSignalService {
  private readonly api = `${environment.apiURL}/live-signal`;

  private readonly pulse$ = new BehaviorSubject<boolean>(false);

  private pollStarted = false;

  /** True si la API indica sesión activa y el usuario puede ver el embed. */
  readonly livePulseActive$ = this.pulse$.pipe(distinctUntilChanged(), shareReplay(1));

  constructor(private http: HttpClient) {}

  getStatus(): Observable<LiveSignalStatus> {
    return this.http.get<LiveSignalStatus>(`${this.api}/status/`).pipe(
      tap((s) => this.pulse$.next(!!s.active)),
    );
  }

  /**
   * Refresco para el punto del menú: cada LIVE_SIGNAL_POLL_MS y al volver a la pestaña
   * (así no hay que esperar medio minuto cuando el admin acaba de activar la señal).
   */
  startPolling(): void {
    if (this.pollStarted) {
      return;
    }
    this.pollStarted = true;

    const onInterval$ = timer(0, LIVE_SIGNAL_POLL_MS);
    const onTabVisible$ = fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.visibilityState === 'visible'),
    );

    merge(onInterval$, onTabVisible$)
      .pipe(switchMap(() => this.getStatus()))
      .subscribe({
        error: () => this.pulse$.next(false),
      });
  }

  getAdmin(): Observable<LiveSignalAdminPayload> {
    return this.http.get<LiveSignalAdminPayload>(`${this.api}/admin/`);
  }

  saveAdmin(body: Partial<LiveSignalAdminPayload>): Observable<LiveSignalAdminPayload> {
    return this.http.put<LiveSignalAdminPayload>(`${this.api}/admin/`, body).pipe(
      tap(() => {
        this.getStatus().subscribe();
      }),
    );
  }
}
