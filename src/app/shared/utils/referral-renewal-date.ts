/**
 * True si hoy (calendario local) es el día de `referral_next_renewal` o ya pasó (vencida).
 * El CTA de recompra no debe mostrarse mientras la fecha sea futura.
 */
export function isReferralRenewalDueOrOverdue(isoDate: string | null | undefined): boolean {
  if (!isoDate) {
    return false;
  }
  const raw = String(isoDate).trim();
  const ymd = raw.includes('T') ? raw.split('T')[0]! : raw.slice(0, 10);
  const parts = ymd.split('-').map((p) => parseInt(p, 10));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) {
    return false;
  }
  const [y, m, d] = parts;
  const renewal = new Date(y, m - 1, d);
  renewal.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime() >= renewal.getTime();
}
