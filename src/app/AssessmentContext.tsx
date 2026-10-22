/**
 * Estado de la evaluacion en la aplicacion.
 *
 * Mantiene las respuestas en curso, el resultado calculado y el historial
 * guardado en el dispositivo. La logica de calculo vive en `engine/`, aqui
 * solo se orquestan las llamadas y la persistencia.
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
import { QUESTIONS } from '../config/questions';
import { SCORING_CONFIG } from '../config/scoring';
import { DEMO_ANSWERS, DEMO_PROFILE } from '../config/demo';
import { buildTalentMap } from '../engine/talentMap';
import { scoreAssessment } from '../engine/scoring';
import type { Answer, AssessmentResult, CompetencyScore, TalentMap } from '../engine/types';
import {
  addToHistory,
  clearCurrentAssessment,
  clearHistory,
  loadCurrentAssessment,
  loadHistory,
  removeFromHistory,
  saveCurrentAssessment,
  saveProfile,
  type StoredAssessment,
} from '../storage/localStorage';

interface AssessmentContextValue {
  answers: Answer[];
  setAnswer: (questionId: string, value: number | string) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  scores: CompetencyScore[];
  map: TalentMap | null;
  hasCompleted: boolean;
  completedAt: string | null;
  history: StoredAssessment[];
  saveCurrent: () => void;
  deleteCurrent: () => void;
  deleteFromHistory: (id: string) => void;
  clearAllHistory: () => void;
  startOver: () => void;
  restoreFrom: (entry: StoredAssessment) => void;
  /** Carga un perfil ficticio de demostracion. */
  loadDemo: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const buildResult = (answers: Answer[], createdAt: string): AssessmentResult => {
  const scores = scoreAssessment(answers, { config: SCORING_CONFIG });
  const map = buildTalentMap(scores, SCORING_CONFIG);
  return {
    createdAt,
    answers,
    scores,
    map,
    questionnaireVersion: SCORING_CONFIG.questionnaireVersion,
  };
};

export const AssessmentProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredAssessment[]>(() => loadHistory());

  // Restaura la evaluacion en curso al abrir la aplicacion.
  useEffect(() => {
    const stored = loadCurrentAssessment();
    if (stored && Array.isArray(stored.answers)) {
      setAnswers(stored.answers);
      setCompletedAt(stored.completedAt);
    }
  }, []);

  const setAnswer = useCallback((questionId: string, value: number | string) => {
    setAnswers((current) => {
      const existing = current.find((answer) => answer.questionId === questionId);
      if (existing && existing.value === value) return current;
      if (existing) {
        return current.map((answer) =>
          answer.questionId === questionId ? { ...answer, value } : answer,
        );
      }
      return [...current, { questionId, value }];
    });
  }, []);

  const scores = useMemo(
    () => scoreAssessment(answers, { config: SCORING_CONFIG }),
    [answers],
  );

  const map = useMemo(
    () => (answers.length > 0 ? buildTalentMap(scores, SCORING_CONFIG) : null),
    [answers.length, scores],
  );

  const saveCurrent = useCallback(() => {
    if (answers.length === 0) return;
    const now = new Date().toISOString();
    const entry: StoredAssessment = {
      id: `eval-${now}`,
      completedAt: now,
      answers,
      questionnaireVersion: SCORING_CONFIG.questionnaireVersion,
    };
    saveCurrentAssessment(entry);
    setHistory(addToHistory(entry));
    setCompletedAt(now);
  }, [answers]);

  const deleteCurrent = useCallback(() => {
    clearCurrentAssessment();
    setAnswers([]);
    setCompletedAt(null);
    setCurrentIndex(0);
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(removeFromHistory(id));
    const stored = loadCurrentAssessment();
    if (stored?.id === id) clearCurrentAssessment();
  }, []);

  const clearAllHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const startOver = useCallback(() => {
    setAnswers([]);
    setCompletedAt(null);
    setCurrentIndex(0);
  }, []);

  const restoreFrom = useCallback((entry: StoredAssessment) => {
    setAnswers(entry.answers);
    setCompletedAt(entry.completedAt);
  }, []);

  const loadDemo = useCallback(() => {
    const now = new Date().toISOString();
    setAnswers(DEMO_ANSWERS);
    setCompletedAt(now);
    setCurrentIndex(0);
    saveProfile({
      displayName: DEMO_PROFILE.displayName,
      headline: DEMO_PROFILE.headline,
      sector: DEMO_PROFILE.sector,
      yearsExperience: DEMO_PROFILE.yearsExperience,
    });
    const entry: StoredAssessment = {
      id: `demo-${now}`,
      completedAt: now,
      answers: DEMO_ANSWERS,
      questionnaireVersion: SCORING_CONFIG.questionnaireVersion,
    };
    saveCurrentAssessment(entry);
    setHistory(addToHistory(entry));
  }, []);

  const value = useMemo<AssessmentContextValue>(
    () => ({
      answers,
      setAnswer,
      currentIndex,
      setCurrentIndex,
      scores,
      map,
      hasCompleted: answers.length >= QUESTIONS.length && answers.length > 0,
      completedAt,
      history,
      saveCurrent,
      deleteCurrent,
      deleteFromHistory,
      clearAllHistory,
      startOver,
      restoreFrom,
      loadDemo,
    }),
    [
      answers,
      setAnswer,
      currentIndex,
      scores,
      map,
      completedAt,
      history,
      saveCurrent,
      deleteCurrent,
      deleteFromHistory,
      clearAllHistory,
      startOver,
      restoreFrom,
      loadDemo,
    ],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};

export const useAssessment = (): AssessmentContextValue => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment debe usarse dentro de AssessmentProvider');
  }
  return context;
};

/** Reconstruye un resultado completo a partir de una entrada guardada. */
export const resultFromStored = (entry: StoredAssessment): AssessmentResult =>
  buildResult(entry.answers, entry.completedAt);
