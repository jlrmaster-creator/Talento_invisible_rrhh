/**
 * Construccion del mapa de talento.
 *
 * Agrupa las competencias puntuadas en fortalezas, habilidades complementarias
 * y areas de desarrollo, y redacta un resumen con plantillas estaticas.
 */

import { SCORING_CONFIG, getLevel, type ScoringConfig } from '../config/scoring';
import { recommendationsFor } from '../config/recommendations';
import { COMPETENCIES } from '../config/competencies';
import type { CompetencyId } from '../config/competencies';
import { overallIndex } from './scoring';
import type { CompetencyScore, TalentMap } from './types';

/** Une una lista de nombres de competencia en texto legible. */
export const joinCompetencies = (names: string[]): string => {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  const head = names.slice(0, -1).join(', ');
  return `${head} y ${names[names.length - 1]}`;
};

/**
 * Clasifica las competencias en los tres bloques del mapa de talento.
 *
 * Los umbrales vienen de `config/scoring.ts`. Cada bloque tiene un tope para
 * que el mapa siga siendo legible, y si un bloque queda vacio se rellena con
 * las competencias mas próximas, de forma que el mapa siempre aporte
 * informacion aunque el perfil sea muy uniforme.
 */
export const buildTalentMap = (
  scores: CompetencyScore[],
  config: ScoringConfig = SCORING_CONFIG,
): TalentMap => {
  const ranking = [...scores].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const strengthBand = ranking.filter((score) => score.score >= config.bands.strength);
  const developmentBand = ranking.filter((score) => score.score < config.bands.development);
  const complementaryBand = ranking.filter(
    (score) => score.score >= config.bands.development && score.score < config.bands.strength,
  );

  // 1. Fortalezas: las del umbral alto, como mucho las cuatro mejores.
  const strengths = strengthBand.length > 0 ? strengthBand.slice(0, 4) : ranking.slice(0, 2);
  const taken = new Set(strengths.map((score) => score.id));

  // 2. Complementarias: las del tranche medio que no sean fortalezas.
  const complementaryCandidates = complementaryBand.filter((score) => !taken.has(score.id));
  const complementary =
    complementaryCandidates.length > 0
      ? complementaryCandidates.slice(0, 3)
      : ranking.filter((score) => !taken.has(score.id)).slice(0, 3);
  complementary.forEach((score) => taken.add(score.id));

  // 3. Areas de desarrollo: las del umbral bajo y, si no hay, las mas debiles.
  const developmentCandidates = developmentBand.filter((score) => !taken.has(score.id));
  const development =
    developmentCandidates.length > 0
      ? developmentCandidates.slice(0, 3)
      : ranking.filter((score) => !taken.has(score.id)).slice(-2).reverse();

  const index = overallIndex(scores, config);
  const overallLevel = getLevel(index);

  return {
    strengths,
    complementary,
    development,
    ranking,
    overallIndex: index,
    overallLevelId: overallLevel.id,
    overallLevelLabel: overallLevel.label,
    summary: buildSummary(strengths, complementary, development, index),
    questionnaireVersion: config.questionnaireVersion,
  };
};

/** Resumen en lenguaje natural construido con plantillas estaticas. */
export const buildSummary = (
  strengths: CompetencyScore[],
  complementary: CompetencyScore[],
  development: CompetencyScore[],
  index: number,
): string => {
  const strengthNames = strengths.slice(0, 3).map((score) => score.name);
  const complementaryNames = complementary.slice(0, 2).map((score) => score.name);
  const developmentNames = development.slice(0, 2).map((score) => score.name);

  const parts: string[] = [];

  parts.push(
    `Tu indice de talento visible se situa en ${index} sobre 100, en el nivel ${getLevel(index).label.toLowerCase()}.`,
  );

  if (strengthNames.length > 0) {
    parts.push(
      `Tus principales fortalezas son ${joinCompetencies(strengthNames)}. Son las competencias que mejor responden a tus respuestas.`,
    );
  }

  if (complementaryNames.length > 0) {
    parts.push(
      `Ademas, ${joinCompetencies(complementaryNames)} sostienen y complementan tu perfil, aunque todavia hay recorrido por delante.`,
    );
  }

  if (developmentNames.length > 0) {
    parts.push(
      `El margen de crecimiento mas claro esta en ${joinCompetencies(developmentNames)}.`,
    );
  }

  parts.push(
    'Estos resultados son orientativos: se calcula de tus respuestas a un cuestionario breve y describen como has tendido a actuar, no lo que puedes hacer en un puesto concreto.',
  );

  return parts.join(' ');
};

/**
 * Recomendaciones asociadas a un bloque del mapa de talento.
 * Se elige la recomendacion del catalogo estatico que corresponda.
 */
export const recommendationFor = (score: CompetencyScore, kind: 'strength' | 'complementary' | 'development') =>
  recommendationsFor(score.id as CompetencyId, kind);

/** Etiqueta corta del nivel, usada en listas compactas. */
export const levelLabelFor = (score: number): string => getLevel(score).label;

/** Competencia completa a partir de un identificador. */
export const competencyName = (id: string): string =>
  COMPETENCIES[id as CompetencyId]?.name ?? id;
