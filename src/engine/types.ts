/**
 * Tipos del dominio de evaluación.
 *
 * Son deliberadamente planos y serializables: el mismo objeto se puede
 * guardar en localStorage, enviar a un informe PDF o comparar en pruebas.
 */

/** Respuesta guardada: el valor es numerico en escalas y texto en opciones. */
export interface Answer {
  questionId: string;
  value: number | string;
}

export interface Evidence {
  questionId: string;
  questionTitle: string;
  /** Texto legible de la respuesta elegida. */
  answerLabel: string;
  /** Aporte de esta respuesta a la competencia (ya normalizado y ponderado). */
  awarded: number;
  /** Peso maximo que esta pregunta podria aportar. */
  possible: number;
  /** Comentario explicativo de la opcion, si existe. */
  note?: string;
}

export interface CompetencyScore {
  id: string;
  name: string;
  shortName: string;
  color: string;
  softColor: string;
  /** Puntuación final 0..100 (ya contraida hacia la media). */
  score: number;
  /** Ratio bruto 0..1 antes de la contraccion. */
  rawRatio: number;
  /** Puntos effectivement conseguidos. */
  points: number;
  /** Puntos maximos posibles con este cuestionario. */
  maxPoints: number;
  /** Número de preguntas respondidas que informaban de esta competencia. */
  evidenceCount: number;
  /** Confianza orientativa 0..1 segun cuanta evidencia hay. */
  confidence: number;
  levelId: string;
  levelLabel: string;
  levelDescription: string;
  evidence: Evidence[];
}

export interface TalentMap {
  strengths: CompetencyScore[];
  complementary: CompetencyScore[];
  development: CompetencyScore[];
  /** Todas las competencias ordenadas de mayor a menor. */
  ranking: CompetencyScore[];
  /** Indice global 0..100. */
  overallIndex: number;
  overallLevelId: string;
  overallLevelLabel: string;
  /** Resumen redactado con plantillas estaticas (sin IA). */
  summary: string;
  /** Comprobacion de que el resultado se calculo con la version actual del cuestionario. */
  questionnaireVersion: string;
}

export interface AssessmentResult {
  createdAt: string;
  answers: Answer[];
  scores: CompetencyScore[];
  map: TalentMap;
  questionnaireVersion: string;
}

export interface CompetencyRef {
  id: string;
  name: string;
  score: number;
  levelLabel: string;
  color: string;
  softColor: string;
}
