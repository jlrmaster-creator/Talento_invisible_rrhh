import { describe, expect, it } from 'vitest';
import { buildTalentMap, joinCompetencies } from './talentMap';
import { scoreAssessment } from './scoring';
import { SCORING_CONFIG } from '../config/scoring';
import { bestAnswers, middleAnswers, worstAnswers } from '../test/fixtures';

describe('mapa de talento', () => {
  it('clasifica las competencias en los tres bloques sin perder ninguna', () => {
    const map = buildTalentMap(scoreAssessment(middleAnswers()));
    const total =
      map.strengths.length + map.complementary.length + map.development.length;
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThanOrEqual(map.ranking.length);
  });

  it('nunca deja un bloque completamente vacio', () => {
    for (const answers of [bestAnswers(), middleAnswers(), worstAnswers()]) {
      const map = buildTalentMap(scoreAssessment(answers));
      expect(map.strengths.length).toBeGreaterThan(0);
      expect(map.development.length).toBeGreaterThan(0);
    }
  });

  it('ordena el ranking de mayor a menor puntuacion', () => {
    const map = buildTalentMap(scoreAssessment(bestAnswers()));
    for (let index = 1; index < map.ranking.length; index++) {
      expect(map.ranking[index - 1].score).toBeGreaterThanOrEqual(map.ranking[index].score);
    }
  });

  it('un perfil fuerte concentrate las fortalezas y deja margen de desarrollo', () => {
    const map = buildTalentMap(scoreAssessment(bestAnswers()));
    expect(map.strengths.length).toBeGreaterThan(0);
    expect(map.overallIndex).toBeGreaterThan(60);
  });

  it('un perfil minimo tiene un indice bajo', () => {
    const map = buildTalentMap(scoreAssessment(worstAnswers()));
    expect(map.overallIndex).toBeLessThan(60);
  });

  it('el resumen menciona fortalezas, complementarias y areas de desarrollo', () => {
    const map = buildTalentMap(scoreAssessment(bestAnswers()));
    expect(map.summary).toContain('fortalezas');
    expect(map.summary).toContain('margen de crecimiento');
    expect(map.summary.length).toBeGreaterThan(150);
  });

  it('el resumen aclara que los resultados son orientativos', () => {
    const map = buildTalentMap(scoreAssessment(middleAnswers()));
    expect(map.summary.toLowerCase()).toContain('orientativos');
  });

  it('expone la version del cuestionario con la que se calculo', () => {
    const map = buildTalentMap(scoreAssessment(middleAnswers()), SCORING_CONFIG);
    expect(map.questionnaireVersion).toBe(SCORING_CONFIG.questionnaireVersion);
  });

  it('es determinista', () => {
    const a = buildTalentMap(scoreAssessment(middleAnswers()));
    const b = buildTalentMap(scoreAssessment(middleAnswers()));
    expect(b).toEqual(a);
  });

  it('une nombres de competencia de forma legible', () => {
    expect(joinCompetencies([])).toBe('');
    expect(joinCompetencies(['A'])).toBe('A');
    expect(joinCompetencies(['A', 'B'])).toBe('A y B');
    expect(joinCompetencies(['A', 'B', 'C'])).toBe('A, B y C');
  });
});
