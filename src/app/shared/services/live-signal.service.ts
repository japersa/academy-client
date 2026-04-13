import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, fromEvent, Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { buildWebSocketBaseUrl } from 'src/app/shared/utils/ws-base-url';

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

  /** Último estado (menú, pulso y pantalla /live-signals). */
  private readonly statusSubject = new BehaviorSubject<LiveSignalStatus | null>(null);

  private streamStarted = false;

  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private tokenSub: Subscription | null = null;
  private visibilitySub: Subscription | null = null;

  /** True si la API indica sesión activa y el usuario puede ver el embed. */
  readonly livePulseActive$ = this.pulse$.pipe(distinctUntilChanged(), shareReplay(1));

  /**
   * Emite en cada actualización (WebSocket o GET). `null` = aún no hubo primera respuesta.
   * La pantalla de señal en vivo se suscribe aquí para quitar el iframe al desactivar.
   */
  readonly liveSignalStatus$ = this.statusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userDataService: UserDataService,
  ) {}

  getStatus(): Observable<LiveSignalStatus> {
    return this.http.get<LiveSignalStatus>(`${this.api}/status/`).pipe(
      tap((s) => {
        this.pulse$.next(!!s.active);
        this.statusSubject.next(s);
      }),
      catchError(() => {
        this.pulse$.next(false);
        this.statusSubject.next({ active: false });
        return of({ active: false });
      }),
    );
  }

  /**
   * WebSocket con token Knox; reconexión con backoff y GET al volver a la pestaña.
   */
  startPolling(): void {
    if (this.streamStarted) {
      return;
    }
    this.streamStarted = true;

    this.tokenSub = this.userDataService.accessToken$
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.reconnectWebSocket();
      });

    const onTabVisible$ = fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.visibilityState === 'visible'),
    );
    this.visibilitySub = onTabVisible$.subscribe(() => {
      this.getStatus().subscribe();
    });

    this.reconnectWebSocket();
  }

  private reconnectWebSocket(): void {
    this.clearReconnectTimer();
    this.detachWebSocket();
    const token = this.normalizeToken(this.userDataService.getAccessToken());
    if (!token) {
      this.reconnectAttempt = 0;
      this.pulse$.next(false);
      this.statusSubject.next({ active: false });
      return;
    }
    this.openWebSocket(token);
  }

  private openWebSocket(token: string): void {
    const url = this.buildWsUrl(token);
    let socket: WebSocket;
    try {
      socket = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.ws = socket;

    socket.onopen = () => {
      this.reconnectAttempt = 0;
    };

    socket.onmessage = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data as string) as LiveSignalStatus;
        this.pulse$.next(!!data.active);
        this.statusSubject.next(data);
      } catch {
        /* ignore */
      }
    };

    socket.onerror = () => {
      /* onclose encola reconexión */
    };

    socket.onclose = () => {
      if (this.ws === socket) {
        this.ws = null;
      }
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (!this.streamStarted) {
      return;
    }
    const token = this.normalizeToken(this.userDataService.getAccessToken());
    if (!token) {
      return;
    }
    const delay = Math.min(30_000, 1000 * Math.pow(2, this.reconnectAttempt));
    this.reconnectAttempt += 1;
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectWebSocket();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer != null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private detachWebSocket(): void {
    if (!this.ws) {
      return;
    }
    const w = this.ws;
    this.ws = null;
    w.onopen = null;
    w.onmessage = null;
    w.onerror = null;
    w.onclose = null;
    w.close();
  }

  private buildWsUrl(token: string): string {
    const q = encodeURIComponent(token);
    return `${buildWebSocketBaseUrl()}/ws/live-signal/?token=${q}`;
  }

  private normalizeToken(raw: unknown): string | null {
    if (raw == null || raw === 'null') {
      return null;
    }
    const s = String(raw).replace(/"/g, '').trim();
    return s.length ? s : null;
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
