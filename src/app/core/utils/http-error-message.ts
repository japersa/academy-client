import { HttpErrorResponse } from '@angular/common/http';

const FALLBACK = 'No se pudo completar la operación. Inténtalo de nuevo.';

function extractDetail(obj: Record<string, unknown>): string | null {
  const d = obj['detail'];
  if (typeof d === 'string' && d.trim()) {
    return d.trim();
  }
  if (Array.isArray(d) && d.length) {
    const parts = d
      .map((x) => (typeof x === 'string' ? x : JSON.stringify(x)))
      .filter((s) => s && String(s).trim());
    if (parts.length) {
      return parts.join(' ');
    }
  }
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim()) {
      return v.trim();
    }
    if (Array.isArray(v) && v.length) {
      const joined = v.map(String).join(' ').trim();
      if (joined) {
        return joined;
      }
    }
  }
  return null;
}

/**
 * Mensaje legible para toasts / UI a partir de errores HTTP o desconocidos.
 * Evita cadenas vacías (causan toast “en blanco”).
 */
export function getHttpErrorMessage(err: unknown): string {
  if (err == null) {
    return FALLBACK;
  }
  if (!(err instanceof HttpErrorResponse)) {
    if (err instanceof Error && err.message?.trim()) {
      return err.message.trim();
    }
    return FALLBACK;
  }

  const statusPart = err.status ? ` (${err.status})` : '';
  const e = err.error;

  if (e == null) {
    const m = (err.message || `Error del servidor${statusPart}`).trim();
    return m || FALLBACK;
  }

  if (typeof e === 'string') {
    const t = e.trim();
    if (t.startsWith('{')) {
      try {
        const parsed = JSON.parse(t) as Record<string, unknown>;
        const fromJson = extractDetail(parsed);
        if (fromJson) {
          return fromJson;
        }
      } catch {
        /* seguir */
      }
    }
    return t || FALLBACK;
  }

  if (e instanceof Blob) {
    return `Error del servidor${statusPart}.`;
  }

  if (typeof e === 'object') {
    const fromObj = extractDetail(e as Record<string, unknown>);
    if (fromObj) {
      return fromObj;
    }
  }

  const m = (err.message || FALLBACK).trim();
  return m || FALLBACK;
}
