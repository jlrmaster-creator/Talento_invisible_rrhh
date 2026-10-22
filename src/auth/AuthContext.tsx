/**
 * Contexto de autenticacion.
 *
 * Envuelve Firebase Authentication y expone un estado simple para la interfaz.
 * Cuando Firebase no esta configurado, `mode` vale 'local' y todas las
 * acciones de sesion devuelven un error explicito en lugar de fallar.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';

export type AuthMode = 'firebase' | 'local';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  mode: AuthMode;
  error: string | null;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const translateError = (error: unknown): string => {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'El correo electronico no tiene un formato valido.';
    case 'auth/missing-password':
      return 'Introduce una contrasena.';
    case 'auth/weak-password':
      return 'La contrasena debe tener al menos 6 caracteres.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo electronico.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'El correo electronico o la contrasena no son correctos.';
    case 'auth/popup-closed-by-user':
      return 'Has cerrado la ventana de inicio de sesion sin completar.';
    case 'auth/popup-blocked':
      return 'El navegador ha bloqueado la ventana emergente. Permite las ventanas emergentes e intentalo de nuevo.';
    case 'auth/network-request-failed':
      return 'No se ha podido conectar con el servicio de identificacion. Revisa tu conexion.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos antes de reintentar.';
    case 'auth/operation-not-allowed':
      return 'El proveedor de correo y contrasena no esta habilitado en la consola de Firebase.';
    default:
      return (error as { message?: string })?.message ?? 'Ha ocurrido un error inesperado.';
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        setUser(null);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const requireAuth = useCallback(() => {
    if (!auth) {
      throw new Error(
        'Firebase Authentication no esta configurado en este entorno. Anade las variables VITE_FIREBASE_* al archivo .env.local.',
      );
    }
    return auth;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setError(null);
      try {
        const instance = requireAuth();
        const credential = await createUserWithEmailAndPassword(instance, email, password);
        if (displayName) {
          await updateProfile(credential.user, { displayName });
        }
      } catch (err) {
        setError(translateError(err));
        throw err;
      }
    },
    [requireAuth],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const instance = requireAuth();
        await signInWithEmailAndPassword(instance, email, password);
      } catch (err) {
        setError(translateError(err));
        throw err;
      }
    },
    [requireAuth],
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const instance = requireAuth();
      await signInWithPopup(instance, googleProvider);
    } catch (err) {
      setError(translateError(err));
      throw err;
    }
  }, [requireAuth]);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const instance = requireAuth();
      await firebaseSignOut(instance);
    } catch (err) {
      setError(translateError(err));
      throw err;
    }
  }, [requireAuth]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      mode: isFirebaseConfigured ? 'firebase' : 'local',
      error,
      isAuthenticated: Boolean(user),
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      clearError,
    }),
    [user, loading, error, signUp, signIn, signInWithGoogle, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
