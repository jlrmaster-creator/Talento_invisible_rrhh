/**
 * Persistencia local (localStorage).
 *
 * No hay base de datos remota. Todo lo que guarda la aplicacion vive en el
 * dispositivo de la persona usuaria y puede borrarse desde la propia
 * aplicacion. Se aplica minimizacion de datos: solo se guarda lo
 * estrictamente necesario para poder mostrar resultados y generar informes.
 */

import type { Answer } from '../engine/types';

const STORAGE_PREFIX = 'ti.v1';

const KEYS = {
  assessment: `${STORAGE_PREFIX}.assessment`,
  history: `${STORAGE_PREFIX}.history`,
  profile: `${STORAGE_PREFIX}.profile`,
  consent: `${STORAGE_PREFIX}.consent`,
  meta: `${STORAGE_PREFIX}.meta`,
} as const;

export interface StoredAssessment {
  id: string;
  completedAt: string;
  answers: Answer[];
  questionnaireVersion: string;
}

export interface StoredProfile {
  displayName?: string;
  headline?: string;
  yearsExperience?: number;
  /** Sector o area de interes, opcional. */
  sector?: string;
  updatedAt: string;
}

export interface StoredConsent {
  /** Consentimiento explicito para elaborar el informe profesional. */
  granted: boolean;
  grantedAt?: string;
  /** Version del texto de consentimiento acceptance. */
  version?: string;
}

export interface StorageMeta {
  createdAt: string;
  lastUpdated: string;
}

const canUseStorage = (): boolean => {
  try {
    const probe = '__ti_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

export const isStorageAvailable = canUseStorage;

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): boolean => {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    touchMeta();
    return true;
  } catch {
    return false;
  }
};

const removeKey = (key: string) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* sin accion */
  }
};

const touchMeta = () => {
  if (!canUseStorage()) return;
  const now = new Date().toISOString();
  const meta = readJson<StorageMeta>(KEYS.meta, { createdAt: now, lastUpdated: now });
  window.localStorage.setItem(
    KEYS.meta,
    JSON.stringify({ ...meta, lastUpdated: now } satisfies StorageMeta),
  );
};

// --- Evaluacion actual ---

export const saveCurrentAssessment = (assessment: StoredAssessment): boolean =>
  writeJson(KEYS.assessment, assessment);

export const loadCurrentAssessment = (): StoredAssessment | null =>
  readJson<StoredAssessment | null>(KEYS.assessment, null);

export const clearCurrentAssessment = () => removeKey(KEYS.assessment);

// --- Historial ---

export const loadHistory = (): StoredAssessment[] =>
  readJson<StoredAssessment[]>(KEYS.history, []);

export const addToHistory = (assessment: StoredAssessment): StoredAssessment[] => {
  const history = loadHistory().filter((item) => item.id !== assessment.id);
  history.unshift(assessment);
  const trimmed = history.slice(0, 10);
  writeJson(KEYS.history, trimmed);
  return trimmed;
};

export const removeFromHistory = (id: string): StoredAssessment[] => {
  const history = loadHistory().filter((item) => item.id !== id);
  writeJson(KEYS.history, history);
  return history;
};

export const clearHistory = () => removeKey(KEYS.history);

// --- Perfil ---

export const saveProfile = (profile: Omit<StoredProfile, 'updatedAt'>): StoredProfile => {
  const stored: StoredProfile = { ...profile, updatedAt: new Date().toISOString() };
  writeJson(KEYS.profile, stored);
  return stored;
};

export const loadProfile = (): StoredProfile | null => readJson<StoredProfile | null>(KEYS.profile, null);

export const clearProfile = () => removeKey(KEYS.profile);

// --- Consentimiento ---

export const saveConsent = (consent: StoredConsent): StoredConsent => {
  writeJson(KEYS.consent, consent);
  return consent;
};

export const loadConsent = (): StoredConsent =>
  readJson<StoredConsent>(KEYS.consent, { granted: false });

export const clearConsent = () => removeKey(KEYS.consent);

// --- Borrado completo ---

/**
 * Borra todos los datos de la aplicacion del dispositivo.
 * Es la accion de "derecho al borrado" que describe la politica de privacidad.
 */
export const clearAllData = (): void => {
  Object.values(KEYS).forEach(removeKey);
};

/** Tamano aproximado de los datos guardados, en bytes. */
export const estimateStorageBytes = (): number => {
  if (!canUseStorage()) return 0;
  let total = 0;
  for (const key of Object.values(KEYS)) {
    const value = window.localStorage.getItem(key);
    if (value) total += key.length + value.length;
  }
  return total * 2; // UTF-16
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
