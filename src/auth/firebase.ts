/**
 * Configuración de Firebase Authentication.
 *
 * Solo se usa Firebase Authentication. No se inicializa ningun otro producto
 * de Firebase (Firestore, Storage, Functions, Analytics, etc.).
 *
 * La configuración se lee de variables de entorno publicas (`VITE_FIREBASE_*`).
 * Nunca se incluyen credenciales privadas en el frontend: la clave de API de
 * Firebase es pública por diseno y la seguridad la proporcionan las Security Rules
 * y los dominios autorizados del proveedor.
 *
 * Si las variables no estan definidas, la aplicacion arranca en "modo local":
 * funciona igual, pero sin identificación. Esto permite desarrollar y
 * demostrar la app antes de conectar Firebase.
 */

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
};

/** Indica si hay configuración suficiente para inicializar Authentication. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  // Persistencia local: la sesión sobrevive a recargas sin enviar nada a un servidor propio.
  void setPersistence(authInstance, browserLocalPersistence).catch(() => undefined);
}

export const auth: Auth | null = authInstance;
export const googleProvider = new GoogleAuthProvider();
export { firebaseConfig };
