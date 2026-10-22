import { describe, expect, it } from 'vitest';
import { QUESTIONS } from './questions';
import { COMPETENCY_IDS, COMPETENCIES } from './competencies';
import { RECOMMENDATIONS } from './recommendations';
import type { CompetencyId } from './competencies';

describe('banco de preguntas', () => {
  it('tiene entre 10 y 15 preguntas', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(10);
    expect(QUESTIONS.length).toBeLessThanOrEqual(15);
  });

  it('tiene identificadores unicos', () => {
    const ids = QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todas las preguntas declaran pesos validos y positivos', () => {
    for (const question of QUESTIONS) {
      expect(question.importance).toBeGreaterThan(0);
      const weights =
        question.type === 'scale'
          ? Object.entries(question.weights)
          : question.options.flatMap((option) => Object.entries(option.weights));
      for (const [competency, weight] of weights) {
        expect(COMPETENCY_IDS).toContain(competency as CompetencyId);
        expect(weight).toBeGreaterThan(0);
        expect(weight).toBeLessThanOrEqual(1.5);
      }
    }
  });

  it('cada opcion aporta a alguna competencia', () => {
    for (const question of QUESTIONS) {
      if (question.type !== 'choice') continue;
      for (const option of question.options) {
        const total = Object.values(option.weights).reduce((sum, weight) => sum + (weight ?? 0), 0);
        expect(total).toBeGreaterThan(0);
      }
    }
  });

  it('las escalas tienen al menos tres puntos y etiquetas en los extremos', () => {
    for (const question of QUESTIONS) {
      if (question.type !== 'scale') continue;
      expect(question.max).toBeGreaterThan(question.min);
      expect(question.minLabel.length).toBeGreaterThan(0);
      expect(question.maxLabel.length).toBeGreaterThan(0);
    }
  });

  it('las opciones de eleccion tienen valores unicos', () => {
    for (const question of QUESTIONS) {
      if (question.type !== 'choice') continue;
      const values = question.options.map((option) => option.value);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('toda competencia del catalogo aparece en al menos dos preguntas', () => {
    const coverage = new Map<CompetencyId, number>();
    for (const question of QUESTIONS) {
      const touched = new Set<CompetencyId>();
      if (question.type === 'scale') {
        for (const key of Object.keys(question.weights)) touched.add(key as CompetencyId);
      } else {
        for (const option of question.options) {
          for (const key of Object.keys(option.weights)) touched.add(key as CompetencyId);
        }
      }
      for (const competency of touched) {
        coverage.set(competency, (coverage.get(competency) ?? 0) + 1);
      }
    }
    for (const id of COMPETENCY_IDS) {
      expect(coverage.get(id) ?? 0).toBeGreaterThanOrEqual(2);
    }
  });

  it('no hay texto vacio en las preguntas', () => {
    for (const question of QUESTIONS) {
      expect(question.title.trim().length).toBeGreaterThan(10);
      if (question.help) expect(question.help.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('catalogo de competencias', () => {
  it('todas las competencias tienen nombre, descripcion y color', () => {
    for (const id of COMPETENCY_IDS) {
      const competency = COMPETENCIES[id];
      expect(competency.name.length).toBeGreaterThan(3);
      expect(competency.description.length).toBeGreaterThan(10);
      expect(competency.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('catalogo de recomendaciones', () => {
  it('tiene identificadores unicos', () => {
    const ids = RECOMMENDATIONS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada competencia tiene al menos una recomendacion de cada tipo', () => {
    for (const id of COMPETENCY_IDS) {
      for (const kind of ['strength', 'complementary', 'development'] as const) {
        const found = RECOMMENDATIONS.some(
          (item) => item.competency === id && item.kind === kind,
        );
        expect(found).toBe(true);
      }
    }
  });

  it('todas las recomendaciones tienen titulo, accion y argumento', () => {
    for (const item of RECOMMENDATIONS) {
      expect(item.title.trim().length).toBeGreaterThan(5);
      expect(item.action.trim().length).toBeGreaterThan(10);
      expect(item.rationale.trim().length).toBeGreaterThan(10);
    }
  });

  it('solo usa competencias del catalogo', () => {
    for (const item of RECOMMENDATIONS) {
      expect(COMPETENCY_IDS).toContain(item.competency);
    }
  });
});
