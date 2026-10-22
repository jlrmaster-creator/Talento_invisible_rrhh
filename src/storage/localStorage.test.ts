import { describe, expect, it } from 'vitest';
import {
  addToHistory,
  clearAllData,
  clearConsent,
  clearCurrentAssessment,
  clearProgress,
  estimateStorageBytes,
  formatBytes,
  loadConsent,
  loadCurrentAssessment,
  loadHistory,
  loadProfile,
  loadProgress,
  removeFromHistory,
  saveConsent,
  saveCurrentAssessment,
  saveProfile,
  saveProgress,
  type StoredAssessment,
} from './localStorage';
import { bestAnswers } from '../test/fixtures';

const entry: StoredAssessment = {
  id: 'eval-test',
  completedAt: '2026-01-15T10:30:00.000Z',
  answers: bestAnswers(),
  questionnaireVersion: '1.0.0',
};

describe('persistencia local', () => {
  it('guarda y recupera la evaluacion actual', () => {
    saveCurrentAssessment(entry);
    expect(loadCurrentAssessment()?.id).toBe('eval-test');
    clearCurrentAssessment();
    expect(loadCurrentAssessment()).toBeNull();
  });

  it('guarda y recupera el progreso en curso', () => {
    saveProgress(bestAnswers().slice(0, 4));
    expect(loadProgress()).toHaveLength(4);
    clearProgress();
    expect(loadProgress()).toHaveLength(0);
  });

  it('añade al historial y lo limita a 10 entradas', () => {
    for (let index = 0; index < 12; index++) {
      addToHistory({ ...entry, id: `eval-${index}` });
    }
    const history = loadHistory();
    expect(history).toHaveLength(10);
    expect(history[0].id).toBe('eval-11');
  });

  it('elimina una entrada del historial', () => {
    addToHistory(entry);
    expect(loadHistory()).toHaveLength(1);
    removeFromHistory('eval-test');
    expect(loadHistory()).toHaveLength(0);
  });

  it('guarda el perfil con fecha de actualizacion', () => {
    const stored = saveProfile({ displayName: 'Ana', yearsExperience: 5 });
    expect(stored.displayName).toBe('Ana');
    expect(stored.updatedAt).toBeTruthy();
    expect(loadProfile()?.displayName).toBe('Ana');
  });

  it('guarda y revoca el consentimiento', () => {
    expect(loadConsent().granted).toBe(false);
    saveConsent({ granted: true, grantedAt: new Date().toISOString(), version: '1.0.0' });
    expect(loadConsent().granted).toBe(true);
    clearConsent();
    expect(loadConsent().granted).toBe(false);
  });

  it('borra todos los datos de la aplicacion', () => {
    saveCurrentAssessment(entry);
    saveProgress(bestAnswers().slice(0, 3));
    addToHistory(entry);
    saveProfile({ displayName: 'Ana' });
    saveConsent({ granted: true });
    clearAllData();
    expect(loadCurrentAssessment()).toBeNull();
    expect(loadProgress()).toHaveLength(0);
    expect(loadHistory()).toHaveLength(0);
    expect(loadProfile()).toBeNull();
    expect(loadConsent().granted).toBe(false);
  });

  it('estima el tamaño de los datos guardados', () => {
    saveProfile({ displayName: 'Ana Pérez' });
    expect(estimateStorageBytes()).toBeGreaterThan(0);
  });

  it('formatea los bytes de forma legible', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});
