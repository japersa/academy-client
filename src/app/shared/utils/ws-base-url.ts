import { environment } from 'src/environments/environment';

/** Origen `ws:` / `wss:` para el API (absoluto o mismo host que el SPA con `/api`). */
export function buildWebSocketBaseUrl(): string {
  const u = environment.apiURL.replace(/\/$/, '');
  if (u.startsWith('http://') || u.startsWith('https://')) {
    const parsed = new URL(u);
    const wsProto = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${parsed.host}`;
  }
  const wsProto =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  return `${wsProto}//${host}`;
}

/**
 * URL completa del WebSocket. Si `apiURL` es relativo (`/api`), antepone ese prefijo
 * (`wss://host/api/ws/...`) para que Nginx enrute al mismo upstream que el REST.
 * En local con `http://localhost:8000` se mantiene `ws://localhost:8000/ws/...`.
 */
export function buildWebSocketUrl(path: string): string {
  const origin = buildWebSocketBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const u = environment.apiURL.replace(/\/$/, '');
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return `${origin}${normalizedPath}`;
  }
  const prefix = u.startsWith('/') ? u : `/${u}`;
  return `${origin}${prefix}${normalizedPath}`;
}
