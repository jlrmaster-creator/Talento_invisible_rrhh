/**
 * Configuración del motor de puntuación.
 *
 * Todos los parámetros de cálculo viven aquí. No hay ninguna lógica oculta:
 * la interfaz explica al usuario final exactamente qué hace este archivo.
 *
 * Fórmula por competencia (determinista, reproducible):
 *
 *   puntos      = suma(peso_pregunta * valor_respuesta_normalizado * importancia)
 *   maxPuntos   = suma(peso_pregunta * 1 * importancia)   // mejor caso posible
 *   ratio       = puntos / maxPuntos                     // 0..1
 *   shrinkage   = (puntos + priorStrength * priorRatio) / (maxPuntos + priorStrength)
 *   puntuación  = redondeo(shrinkage * 100)
 *
 * La contraccion (shrinkage) evita que una competencia explorada por una sola
 * pregunta obtenga una puntuación extrema. Cuanto menor es maxPuntos, más se
 * acerca el resultado a priorRatio (55 por defecto).
 */

import { COMPETENCY_IDS, type CompetencyId } from './competencies';

export type LevelId = 'developing' | 'building' | 'solid' | 'strength';

export interface LevelDefinition {
  id: LevelId;
  label: string;
  description: string;
  min: number;
  max: number;
}

export const LEVELS: LevelDefinition[] = [
  {
    id: 'developing',
    label: 'Por desarrollar',
    description: 'Zona con más margen de crecimiento; conviene practicarla.',
    min: 0,
    max: 39,
  },
  {
    id: 'building',
    label: 'En construcción',
    description: 'Base existente que todavía se apoya en terceros en situaciones nuevas.',
    min: 40,
    max: 59,
  },
  {
    id: 'solid',
    label: 'Competencia sólida',
    description: 'Se sostiene con autonomía en situaciones habituales.',
    min: 60,
    max: 79,
  },
  {
    id: 'strength',
    label: 'Punto fuerte',
    description: 'Se observa de forma consistente y sostiene el resto del perfil.',
    min: 80,
    max: 100,
  },
];

export interface BandThresholds {
  /** A partir de esta puntuación la competencia se considera fortaleza. */
  strength: number;
  /** Por debajo de esta puntuación se considera área de desarrollo. */
  development: number;
}

export interface ScoringConfig {
  /**
   * Peso de cada competencia en el indice global ("Indice de talento visible").
   * Por defecto todas pesan lo mismo.
   */
  competencyWeights: Record<CompetencyId, number>;
  /** Puntuación previa (0..1) hacia la que se contraen las competencias con poca evidencia. */
  priorRatio: number;
  /** Fuerza de la contraccion. Mayor valor = más prudente con poca evidencia. */
  priorStrength: number;
  /** Umbrales para clasificar fortalezas y áreas de desarrollo. */
  bands: BandThresholds;
  /** Version del cuestionario. Cambia al modificar preguntas o pesos. */
  questionnaireVersion: string;
}

const equalWeights = Object.fromEntries(
  COMPETENCY_IDS.map((id) => [id, 1]),
) as Record<CompetencyId, number>;

export const SCORING_CONFIG: ScoringConfig = {
  competencyWeights: equalWeights,
  priorRatio: 0.55,
  priorStrength: 0.75,
  bands: {
    strength: 65,
    development: 45,
  },
  questionnaireVersion: '1.0.0',
};

export const getLevel = (score: number): LevelDefinition =>
  LEVELS.find((level) => score >= level.min && score <= level.max) ?? LEVELS[0];
