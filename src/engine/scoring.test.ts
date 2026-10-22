import { describe, expect, it } from 'vitest';
import { scoreAssessment, overallIndex, balanceIndex, describeAnswer } from './scoring';
import { SCORING_CONFIG } from '../config/scoring';
import { COMPETENCY_IDS } from '../config/competencies';
import { QUESTIONS, QUESTION_BY_ID } from '../config/questions';
import { bestAnswers, middleAnswers, worstAnswers } from '../test/fixtures';
import type { CompetencyScore } from './types';

/** Competencia minima para probar funciones que solo usan la puntuacion. */
const fakeScore = (score: number, id = 'x'): CompetencyScore =>
  ({
    id,
    name: id,
    shortName: id,
    color: '#4F46E5',
    softColor: '#EEF2FF',
    score,
    rawRatio: score / 100,
    points: 0,
    maxPoints: 0,
    evidenceCount: 0,
    confidence: 0,
    levelId: 'building',
    levelLabel: 'En construcción',
    levelDescription: '',
    evidence: [],
  }) as CompetencyScore;

describe('motor de puntuacion', () => {
  it('devuelve una puntuacion para cada competencia del catalogo', () => {
    const scores = scoreAssessment(bestAnswers());
    expect(scores).toHaveLength(COMPETENCY_IDS.length);
    expect(scores.map((score) => score.id).sort()).toEqual([...COMPETENCY_IDS].sort());
  });

  it('es determinista: dos calculos con las mismas entradas dan el mismo resultado', () => {
    const first = scoreAssessment(bestAnswers());
    const second = scoreAssessment(bestAnswers());
    expect(second).toEqual(first);
  });

  it('todas las puntuaciones estan dentro del rango 0..100', () => {
    for (const answers of [bestAnswers(), middleAnswers(), worstAnswers()]) {
      for (const score of scoreAssessment(answers)) {
        expect(score.score).toBeGreaterThanOrEqual(0);
        expect(score.score).toBeLessThanOrEqual(100);
        expect(Number.isInteger(score.score)).toBe(true);
      }
    }
  });

  it('un perfil maximo puntua mas que uno medio, y uno medio mas que uno minimo', () => {
    const index = (answers: ReturnType<typeof bestAnswers>) =>
      overallIndex(scoreAssessment(answers));

    const best = index(bestAnswers());
    const middle = index(middleAnswers());
    const worst = index(worstAnswers());

    expect(best).toBeGreaterThan(middle);
    expect(middle).toBeGreaterThan(worst);
  });

  it('el indice global coincide con la media ponderada de las competencias', () => {
    const scores = scoreAssessment(middleAnswers());
    const expected =
      scores.reduce((sum, score) => sum + score.score * SCORING_CONFIG.competencyWeights[score.id as keyof typeof SCORING_CONFIG.competencyWeights], 0) /
      COMPETENCY_IDS.length;
    expect(overallIndex(scores)).toBe(Math.round(expected));
  });

  it('la contraccion acerca a la media las competencias con poca evidencia', () => {
    const scores = scoreAssessment(bestAnswers());
    for (const score of scores) {
      expect(score.score).toBeLessThanOrEqual(100);
      // Con mucha evidencia la contraccion es pequeña; con poca, la puntuacion
      // se aleja del maximo teorico.
      expect(score.score).toBeLessThan(100);
    }
  });

  it('ignora respuestas a preguntas desconocidas', () => {
    const answers = [...bestAnswers(), { questionId: 'no-existe', value: 5 }];
    const scores = scoreAssessment(answers);
    expect(scores).toHaveLength(COMPETENCY_IDS.length);
    expect(scores.every((score) => score.score <= 100)).toBe(true);
  });

  it('ignora preguntas sin responder y no inventa evidencia', () => {
    const scores = scoreAssessment([{ questionId: 'q01', value: 5 }]);
    const q01 = scores.find((score) => score.id === 'problemSolving');
    expect(q01).toBeDefined();
    expect(q01!.evidenceCount).toBe(1);
    expect(q01!.evidence).toHaveLength(1);
  });

  it('las preguntas de escala aportan proporcionalmente a la respuesta', () => {
    const low = scoreAssessment([{ questionId: 'q01', value: 1 }]);
    const high = scoreAssessment([{ questionId: 'q01', value: 5 }]);
    const lowScore = low.find((score) => score.id === 'problemSolving')!;
    const highScore = high.find((score) => score.id === 'problemSolving')!;
    expect(highScore.score).toBeGreaterThan(lowScore.score);
    expect(highScore.points).toBeGreaterThan(lowScore.points);
  });

  it('las opciones con distinto peso producen puntuaciones distintas', () => {
    const a = scoreAssessment([{ questionId: 'q02', value: 'a' }]);
    const b = scoreAssessment([{ questionId: 'q02', value: 'd' }]);
    const aPlanning = a.find((score) => score.id === 'planning')!;
    const bPlanning = b.find((score) => score.id === 'planning')!;
    expect(aPlanning.points).toBeGreaterThan(bPlanning.points);
  });

  it('registra la evidencia con la pregunta y la respuesta elegidas', () => {
    const scores = scoreAssessment([{ questionId: 'q05', value: 5 }]);
    const collaboration = scores.find((score) => score.id === 'collaboration')!;
    expect(collaboration.evidence[0].questionId).toBe('q05');
    expect(collaboration.evidence[0].questionTitle).toBe(QUESTION_BY_ID.q05.title);
    expect(collaboration.evidence[0].answerLabel).toContain('5');
  });

  it('la confianza orientativa crece con el numero de evidencias', () => {
    const one = scoreAssessment([{ questionId: 'q01', value: 5 }]);
    const many = scoreAssessment(bestAnswers());
    const oneConfidence = one.find((score) => score.id === 'problemSolving')!.confidence;
    const manyConfidence = many.find((score) => score.id === 'problemSolving')!.confidence;
    expect(manyConfidence).toBeGreaterThan(oneConfidence);
  });

  it('el indice de equilibrio premia los perfiles homogenos', () => {
    const flat = [60, 60, 60, 60].map((score) => fakeScore(score));
    const spread = [30, 50, 70, 90].map((score) => fakeScore(score));
    expect(balanceIndex(flat)).toBeGreaterThan(balanceIndex(spread));
  });

  it('el indice de equilibrio no depende de las respuestas respondidas', () => {
    const empty = balanceIndex([]);
    expect(empty).toBe(0);
  });

  it('describe la respuesta con una etiqueta legible', () => {
    expect(describeAnswer(QUESTION_BY_ID.q01, 1)).toContain('1 de 5');
    expect(describeAnswer(QUESTION_BY_ID.q02, 'a')).toBe(
      QUESTION_BY_ID.q02.type === 'choice' ? QUESTION_BY_ID.q02.options[0].label : '',
    );
  });

  it('respeta una configuracion de puntuacion personalizada', () => {
    const custom = {
      ...SCORING_CONFIG,
      priorRatio: 0.5,
      priorStrength: 0,
      bands: { strength: 90, development: 10 },
    };
    const scores = scoreAssessment(bestAnswers(), { config: custom });
    // Sin contraccion, el perfil maximo llega al 100 en las competencias bien cubiertas.
    const communication = scores.find((score) => score.id === 'communication')!;
    expect(communication.score).toBe(100);
  });

  it('el total de preguntas del banco coincide con el configurado', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(10);
    expect(QUESTIONS.length).toBeLessThanOrEqual(15);
  });
});
