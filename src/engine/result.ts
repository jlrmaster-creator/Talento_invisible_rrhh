/**
 * Construccion de un resultado completo a partir de las respuestas.
 *
 * El resultado nunca se guarda en cache: se recalcula siempre con las reglas
 * actuales, de modo que el PDF y la pantalla muestran exactamente lo mismo.
 */

import { SCORING_CONFIG } from '../config/scoring';
import { scoreAssessment } from './scoring';
import { buildTalentMap } from './talentMap';
import type { Answer, AssessmentResult } from './types';

export const buildResult = (answers: Answer[], createdAt: string): AssessmentResult => {
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
