import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDataService } from 'src/app/core/services/user-data.service';
import { buildWebSocketBaseUrl } from 'src/app/shared/utils/ws-base-url';

/** Ticks del servidor para renovar URLs firmadas del tema (sustituye setInterval en el cliente). */
@Injectable({ providedIn: 'root' })
export class TopicMediaSocketService {
  readonly tick$ = new Subject<void>();

  private ws: WebSocket | null = null;

  constructor(private userDataService: UserDataService) {}

  connect(topicId: string): void {
    this.disconnect();
    const token = this.normalizeToken(this.userDataService.getAccessToken());
    if (!token) {
      return;
    }
    const url = `${buildWebSocketBaseUrl()}/ws/topic-media/?token=${encodeURIComponent(
      token,
    )}&topic_id=${encodeURIComponent(topicId)}`;
    let socket: WebSocket;
    try {
      socket = new WebSocket(url);
    } catch {
      return;
    }
    this.ws = socket;
    socket.onmessage = (ev: MessageEvent) => {
      try {
        const data = JSON.parse(ev.data as string) as { type?: string; topic_id?: number };
        if (data.type === 'topic_media_tick') {
          this.tick$.next();
        }
      } catch {
        /* ignore */
      }
    };
    socket.onclose = () => {
      if (this.ws === socket) {
        this.ws = null;
      }
    };
  }

  disconnect(): void {
    if (!this.ws) {
      return;
    }
    const w = this.ws;
    this.ws = null;
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
