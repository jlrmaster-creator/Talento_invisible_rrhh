/**
 * Motor de puntuación determinista.
 *
 * No interviene ningun modelo de lenguaje ni ninguna llamada de red: el
 * resultado depende unicamente de las respuestas y de la configuración de
 * `config/questions.ts` + `config/scoring.ts`. Dos ejecuciones con las mismas
 * entradas producen exactamente el mismo resultado.
 */

import { COMPETENCIES, COMPETENCY_IDS, type CompetencyId } from '../config/competencies';
import { QUESTIONS, QUESTION_BY_ID, type Question } from '../config/questions';
import { getLevel, SCORING_CONFIG, type ScoringConfig } from '../config/scoring';
import type { Answer, CompetencyScore, Evidence } from './types';

export interface ScoreOptions {
  /** Permite calcular con una configuración distinta sin tocar la global. */
  config?: ScoringConfig;
  /** Preguntas a usar. Por defecto, el banco completo. */
  questions?: Question[];
}

interface Contribution {
  awarded: number;
  possible: number;
  label: string;
  note?: string;
}

/** Normaliza un valor de escala a 0..1. */
const normalizeScale = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return (clamped - min) / (max - min);
};

/** Devuelve la etiqueta legible de la respuesta elegida. */
export const describeAnswer = (question: Question, value: number | string): string => {
  if (question.type === 'scale') {
    const numeric = Number(value);
    return `${numeric} de ${question.max} - ${numeric <= question.min ? question.minLabel : question.maxLabel}`;
  }
  const option = question.options.find((item) => item.value === value);
  return option ? option.label : String(value);
};

/**
 * Calcula el aporte de una respuesta a una competencia concreta.
 * Devuelve `null` si la respuesta no informa de esa competencia.
 */
const contributionFor = (
  question: Question,
  value: number | string,
  competency: CompetencyId,
): Contribution | null => {
  const importance = question.importance;

  if (question.type === 'scale') {
    const weight = question.weights[competency];
    if (!weight) return null;
    const ratio = normalizeScale(Number(value), question.min, question.max);
    return {
      awarded: weight * ratio * importance,
      possible: weight * importance,
      label: describeAnswer(question, value),
    };
  }

  const option = question.options.find((item) => item.value === value);
  if (!option) return null;
  const weight = option.weights[competency] ?? 0;
  if (!weight) return null;
  return {
    awarded: weight * importance,
    possible: weight * importance,
    label: option.label,
    note: option.note,
  };
};

/**
 * Calcula la puntuación de todas las competencias a partir de las respuestas.
 *
 * @param answers Respuestas del cuestionario. Las respuestas a preguntas
 *                desconocidas o incompletas se ignoran.
 */
export const scoreAssessment = (
  answers: Answer[],
  options: ScoreOptions = {},
): CompetencyScore[] => {
  const config = options.config ?? SCORING_CONFIG;
  const questions = options.questions ?? QUESTIONS;
  const answerByQuestion = new Map(answers.map((answer) => [answer.questionId, answer]));

  return COMPETENCY_IDS.map((id) => {
    const competency = COMPETENCIES[id];
    let points = 0;
    let maxPoints = 0;
    let evidenceCount = 0;
    const evidence: Evidence[] = [];

    for (const question of questions) {
      const answer = answerByQuestion.get(question.id);
      if (!answer) continue;

      const contribution = contributionFor(question, answer.value, id);
      if (!contribution) continue;

      points += contribution.awarded;
      maxPoints += contribution.possible;
      evidenceCount += 1;
      evidence.push({
        questionId: question.id,
        questionTitle: question.title,
        answerLabel: contribution.label,
        awarded: round(contribution.awarded, 3),
        possible: round(contribution.possible, 3),
        note: contribution.note,
      });
    }

    const rawRatio = maxPoints > 0 ? points / maxPoints : 0;
    const shrunkRatio =
      (points + config.priorStrength * config.priorRatio) / (maxPoints + config.priorStrength);
    const score = clampScore(shrunkRatio * 100);
    const level = getLevel(score);

    return {
      id,
      name: competency.name,
      shortName: competency.shortName,
      color: competency.color,
      softColor: competency.softColor,
      score,
      rawRatio: round(rawRatio, 4),
      points: round(points, 3),
      maxPoints: round(maxPoints, 3),
      evidenceCount,
      confidence: confidenceFor(evidenceCount, maxPoints),
      levelId: level.id,
      levelLabel: level.label,
      levelDescription: level.description,
      evidence: evidence.sort((a, b) => b.awarded - a.awarded),
    };
  });
};

/**
 * Confianza orientativa: combina quantas preguntas informaban de la
 * competencia y cuanto peso acumulado aportaban. No es una medida
 * estadistica, solo un aviso de cuan sólida es la lectura.
 */
export const confidenceFor = (evidenceCount: number, maxPoints: number): number => {
  const byQuestions = Math.min(1, evidenceCount / 3);
  const byWeight = Math.min(1, maxPoints / 2.5);
  return round(byQuestions * 0.6 + byWeight * 0.4, 3);
};

/** Indice global ponderado por `competencyWeights`. */
export const overallIndex = (
  scores: CompetencyScore[],
  config: ScoringConfig = SCORING_CONFIG,
): number => {
  const totalWeight = COMPETENCY_IDS.reduce(
    (acc, id) => acc + (config.competencyWeights[id] ?? 0),
    0,
  );
  if (totalWeight <= 0) return 0;
  const weighted = COMPETENCY_IDS.reduce((acc, id) => {
    const score = scores.find((item) => item.id === id);
    const weight = config.competencyWeights[id] ?? 0;
    return acc + (score ? score.score * weight : 0);
  }, 0);
  return clampScore(weighted / totalWeight);
};

/** Indice de autocompatibilidad: como de lejos esta la parte más debil del perfil. */
export const balanceIndex = (scores: CompetencyScore[]): number => {
  if (scores.length === 0) return 0;
  const values = scores.map((score) => score.score);
  const min = Math.min(...values);
  const avg = values.reduce((acc, value) => acc + value, 0) / values.length;
  return clampScore(avg - (avg - min) * 0.75);
};

const round = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const clampScore = (value: number): number => Math.min(100, Math.max(0, Math.round(value)));

export { QUESTION_BY_ID };
