/**
 * Plantillas del plan de desarrollo personal.
 *
 * El plan se construye de forma determinista: se eligen las áreas de desarrollo
 * más relevantes y se combinan con estas plantillas. No hay texto generado.
 */

export interface PlanWeekTemplate {
  week: number;
  focus: string;
  objective: string;
  actions: string[];
  evidence: string;
}

export const PLAN_WEEK_TEMPLATES: PlanWeekTemplate[] = [
  {
    week: 1,
    focus: 'Observar',
    objective:
      'Reconocer cómo trabajas hoy en {competency} y tomar nota de dos ejemplos reales de la última semana.',
    actions: [
      'Anota tres situaciones concretas en las que has aplicado {competency}.',
      'Elige la que te salió peor y escribe qué habrías hecho distinto.',
      'Guarda esas notas: en la semana 4 las convertirás en evidencia.',
    ],
    evidence: 'Dos notas breves describiendo situaciones reales de trabajo.',
  },
  {
    week: 2,
    focus: 'Práctica guiada',
    objective: 'Ensayar {competency} con un método concreto y medible.',
    actions: [
      'Aplica la acción recomendada: {action}',
      'Define una señal simple de mejora (tiempo, número de errores, cambios de interlocutor).',
      'Anota el resultado al final de la semana.',
    ],
    evidence: 'Un registro de la acción aplicada y de su resultado medible.',
  },
  {
    week: 3,
    focus: 'Práctica en contexto real',
    objective: 'Aplicar {competency} en un encargo real, con personas de tu entorno.',
    actions: [
      'Elige un encargo auténtico y llevalo con el método de la semana 2.',
      'Pide a una persona de confianza su opinión sobre el resultado.',
      'Guarda el resultado y el comentario recibido.',
    ],
    evidence: 'Un entregable real y una opinión externa sobre el.',
  },
  {
    week: 4,
    focus: 'Consolidar y evidenciar',
    objective: 'Convertir lo aprendido en un ejemplo presentable en una candidatura.',
    actions: [
      'Resume el antes y el después en cinco líneas.',
      'Prepara una versión breve de la historia para una entrevista.',
      'Cierra la semana con la acción recomendada para el siguiente mes: {action}',
    ],
    evidence: 'Un resumen de cinco líneas con un resultado concreto.',
  },
];

export const PLAN_INTRO =
  'Plan de cuatro semanas construido a partir de tus áreas de desarrollo. ' +
  'Cada semana tiene un objetivo, acciones concretas y una evidencia que puedes guardar ' +
  'y usar después en una candidatura.';
