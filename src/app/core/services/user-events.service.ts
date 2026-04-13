import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserDataService } from './user-data.service';
import { buildWebSocketUrl } from 'src/app/shared/utils/ws-base-url';

/** Eventos del servidor para el usuario (referidos, notificaciones). */
@Injectable({ providedIn: 'root' })
export class UserEventsService {
  readonly referralUpdated$ = new Subject<void>();
  readonly notificationNew$ = new Subject<{ id: number }>();

  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private started = false;
  private tokenSub: Subscription | null = null;

  constructor(private userDataService: UserDataService) {}

  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.tokenSub = this.userDataService.accessToken$
      .pipe(distinctUntilChanged())
      .subscribe(() => this.reconnect());
    this.reconnect();
  }

  private reconnect(): void {
    this.clearReconnectTimer();
    this.detachSocket();
    const token = this.normalizeToken(this.userDataService.getAccessToken());
    if (!token) {
      this.reconnectAttempt = 0;
      return;
    }
    const url = `${buildWebSocketUrl('/ws/user-events/')}?token=${encodeURIComponent(token)}`;
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
        const data = JSON.parse(ev.data as string) as { type?: string; id?: number };
        if (data.type === 'referral_updated') {
          this.referralUpdated$.next();
        } else if (data.type === 'notification_new' && data.id != null) {
          this.notificationNew$.next({ id: data.id });
        }
      } catch {
        /* ignore */
      }
    };
    socket.onclose = () => {
      if (this.ws === socket) {
        this.ws = null;
      }
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (!this.started) {
      return;
    }
    const token = this.normalizeToken(this.userDataService.getAccessToken());
    if (!token) {
      return;
    }
    const delay = Math.min(30_000, 1000 * Math.pow(2, this.reconnectAttempt));
    this.reconnectAttempt += 1;
    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => this.reconnect(), delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer != null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private detachSocket(): void {
    if (!this.ws) {
      return;
    }
    const w = this.ws;
    this.ws = null;
    w.onopen = null;
    w.onmessage = null;
    w.onclose = null;
    w.close();
  }

  private normalizeToken(raw: unknown): string | null {
    if (raw == null || raw === 'null') {
      return null;
    }
    const s = String(raw).replace(/"/g, '').trim();
    return s.length ? s : null;
  }
}
