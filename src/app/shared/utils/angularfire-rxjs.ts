import { Observable } from 'rxjs';

/**
 * AngularFire bundles a nested rxjs; cast to the app Observable type for pipe/operators.
 */
export function af$<T>(source: unknown): Observable<T> {
  return source as Observable<T>;
}
