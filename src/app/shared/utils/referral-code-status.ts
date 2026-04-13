import { isTeacherOrAdminRole } from './staff-role';

/** Mismo criterio que el API / perfil: staff siempre «activo» para el código. */
export type ReferralCodePillKind = 'on' | 'off' | 'empty';

export function referralCodePillKind(
  row: { referral_code?: string; rol?: string; referral_active?: boolean } | null | undefined,
): ReferralCodePillKind {
  const code = (row?.referral_code ?? '').trim();
  if (!code) {
    return 'empty';
  }
  return isTeacherOrAdminRole(row?.rol) || row?.referral_active === true ? 'on' : 'off';
}

/** Textos alineados con 2FA (Activado / Desactivado). */
export function referralCodePillLabel(kind: ReferralCodePillKind): string {
  if (kind === 'empty') {
    return 'Sin código';
  }
  return kind === 'on' ? 'Activado' : 'Desactivado';
}
