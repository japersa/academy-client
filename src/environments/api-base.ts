import { environment } from './environment';

/**
 * Base pública del API para URLs absolutas (p. ej. CoinPayments IPN).
 * En prod el cliente usa `/api` (mismo origen); se resuelve con el origen del SPA.
 */
export function resolveApiPublicBase(): string {
  const u = environment.apiURL.replace(/\/$/, '');
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${u}`;
  }
  return u;
}
