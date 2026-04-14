export const environment = {
  production: true,
  environmentName: 'Production',
  apiURL: '/api',
  /**
   * Vercel (`vercel.json`) reescribe `/api/*` → Heroku para HTTP, pero el edge **no proxifica
   * bien WebSocket** hacia el destino externo. Los WS deben ir directos al backend.
   * Misma base que en `vercel.json` → `destination` (sin path, solo origen https).
   */
  websocketPublicOrigin: 'https://ultra-back-98fc6bf42dce.herokuapp.com' as string,
  /** Sitio público (marketing) */
  publicWebsiteUrl: 'https://startacademy.digital/',
  rollbarConfig: {
    accessToken: '748115ffc5b04e71ba4d73da8ca51159',
    captureUncaught: true,
    captureUnhandledRejections: true,
  },
  firebaseConfig: {
    apiKey: 'AIzaSyCdXRtZsU3WOw2swFXH0nzwng_uGRa-yAo',
    authDomain: 'ultramarkets-prd.firebaseapp.com',
    projectId: 'ultramarkets-prd',
    storageBucket: 'ultramarkets-prd.appspot.com',
    messagingSenderId: '910504303916',
    appId: '1:910504303916:web:28db84a81b6d03ce312089',
    measurementId: 'G-V00BF9JB6X',
  },

  stripePK: 'pk_live_51Mok6LKim0A5yCrrqPttq7ccd8x9chqLWb2Kft2CUUWSUt3CWhpAOAR6vruVw0cf2OShadhQs1AMCRplMbAyofHx00f4E36Hg0',
};
