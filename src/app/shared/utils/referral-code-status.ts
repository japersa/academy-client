import { isTeacherOrAdminRole } from './staff-role';

/** Mismo criterio que el API / perfil: staff siempre «activo» para el código. */
export type ReferralCodePillKind = 'on' | 'off' | 'empty';

function normalizeSubscription(sub: string | null | undefined): string {
  const s = (sub ?? '').toString().trim().toLowerCase();
  return s || 'none';
}

/** Plan Academia que permite considerar el código «activo» en UI admin (no `referral_active`). */
function hasSubscriptionForReferralState(row: {
  rol?: string;
  subscription?: string | null;
}): boolean {
  if (isTeacherOrAdminRole(row?.rol)) {
    return true;
  }
  const s = normalizeSubscription(row?.subscription);
  return s === 'basic' || s === 'full';
}

export function referralCodePillKind(
  row: {
    referral_code?: string;
    rol?: string;
    subscription?: string | null;
  } | null | undefined,
): ReferralCodePillKind {
  const code = (row?.referral_code ?? '').trim();
  if (!code) {
    return 'empty';
  }
  return hasSubscriptionForReferralState(row) ? 'on' : 'off';
}

/** Etiquetas para el código de referidos (no confundir con 2FA: Activado/Desactivado). */
export function referralCodePillLabel(kind: ReferralCodePillKind): string {
  if (kind === 'empty') {
    return 'Sin código';
  }
  return kind === 'on' ? 'Activo' : 'Inactivo';
}
