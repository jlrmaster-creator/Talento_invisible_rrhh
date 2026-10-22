/**
 * Datos de prueba reutilizables.
 *
 * Permiten construir perfiles extremos (maximo, minimo, medio) sin depender de
 * respuestas escritas a mano, de modo que las pruebas se ajustan solas si
 * cambia el banco de preguntas.
 */

import { QUESTIONS, type Question } from '../config/questions';
import type { Answer } from '../engine/types';

const totalWeight = (question: Question, value: string): number => {
  if (question.type !== 'choice') return 0;
  const option = question.options.find((item) => item.value === value);
  if (!option) return 0;
  return Object.values(option.weights).reduce((sum, weight) => sum + (weight ?? 0), 0);
};

/** Respuestas que maximizan cada competencia. */
export const bestAnswers = (): Answer[] =>
  QUESTIONS.map((question) => {
    if (question.type === 'scale') {
      return { questionId: question.id, value: question.max };
    }
    const best = question.options.reduce((a, b) => (totalWeight(question, b.value) > totalWeight(question, a.value) ? b : a));
    return { questionId: question.id, value: best.value };
  });

/** Respuestas que minimizan cada competencia. */
export const worstAnswers = (): Answer[] =>
  QUESTIONS.map((question) => {
    if (question.type === 'scale') {
      return { questionId: question.id, value: question.min };
    }
    const worst = question.options.reduce((a, b) => (totalWeight(question, b.value) < totalWeight(question, a.value) ? b : a));
    return { questionId: question.id, value: worst.value };
  });

/** Respuestas intermedias: siempre el valor central. */
export const middleAnswers = (): Answer[] =>
  QUESTIONS.map((question) => {
    if (question.type === 'scale') {
      return { questionId: question.id, value: Math.round((question.min + question.max) / 2) };
    }
    const middle = question.options[Math.floor(question.options.length / 2)];
    return { questionId: question.id, value: middle.value };
  });

/** Perfil concreto: responde siempre con la primera opcion de cada pregunta. */
export const firstOptionAnswers = (): Answer[] =>
  QUESTIONS.map((question) => ({
    questionId: question.id,
    value: question.type === 'scale' ? question.max : question.options[0].value,
  }));

export const answerFor = (questionId: string, value: number | string): Answer => ({
  questionId,
  value,
});
