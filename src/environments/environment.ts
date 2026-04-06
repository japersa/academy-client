/**
 * Entorno de `ng serve` / build no productivo.
 * apiURL: backend Django local por defecto (`python manage.py runserver` → :8000).
 * Para probar contra Heroku u otro entorno, cambia solo esta constante.
 */
export const environment = {
  production: false,
  environmentName: 'Development',
  apiURL: 'https://ultra-back-dev-f00d4a68f5ce.herokuapp.com',
  rollbarConfig: {
    accessToken: '748115ffc5b04e71ba4d73da8ca51159',
    captureUncaught: true,
    captureUnhandledRejections: true,
  },
  firebaseConfig: {
    apiKey: "AIzaSyCdXRtZsU3WOw2swFXH0nzwng_uGRa-yAo",
    authDomain: "ultramarkets-prd.firebaseapp.com",
    projectId: "ultramarkets-prd",
    storageBucket: "ultramarkets-prd.appspot.com",
    messagingSenderId: "910504303916",
    appId: "1:910504303916:web:28db84a81b6d03ce312089",
    measurementId: "G-V00BF9JB6X"
  },
  stripePK: 'pk_test_51Mok6LKim0A5yCrrD5U0SiKGYgFpMcVtUc1eDJUE0r7vB0VXXQ3xJGgywdhEdxHU73sIGV3Jahg2CXZkf0NzKLBw00LDYJVWv5'
};


