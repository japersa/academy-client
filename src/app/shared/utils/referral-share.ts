const BRAND = 'Start Academy';

/**
 * Enlace wa.me con texto prellenado para compartir el código de referido.
 * Usa el origen actual (dev/prod) para el enlace de registro.
 */
export function buildWhatsAppReferralShareUrl(referralCode: string): string {
  const code = (referralCode || '').trim();
  if (!code) {
    return 'https://wa.me/';
  }
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://ultramarkets-prd.web.app';
  const signUpUrl = `${origin}/sign-up`;
  const text =
    `¡Hola! Te invito a ${BRAND}.\n\n` +
    `Mi código de referido es: *${code}*\n\n` +
    `Puedes registrarte aquí:\n${signUpUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
