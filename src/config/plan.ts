/**
 * Plantillas del plan de desarrollo personal.
 *
 * El plan se construye de forma determinista: se eligen las areas de desarrollo
 * mas relevantes y se combinan con estas plantillas. No hay texto generado.
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
      'Reconocer como trabajas hoy en {competency} y tomar nota de dos ejemplos reales de la ultima semana.',
    actions: [
      'Anota tres situaciones concretas en las que has aplicado {competency}.',
      'Elige la que te salio peor y escribe que habrias hecho distinto.',
      'Guarda esas notas: en la semana 4 las convertiras en evidencia.',
    ],
    evidence: 'Dos notas breves describiendo situaciones reales de trabajo.',
  },
  {
    week: 2,
    focus: 'Practica guiada',
    objective: 'Ensayar {competency} con un metodo concreto y medible.',
    actions: [
      'Aplica la accion recomendada: {action}',
      'Define una señal simple de mejora (tiempo, numero de errores, cambios de interlocutor).',
      'Anota el resultado al final de la semana.',
    ],
    evidence: 'Un registro de la accion aplicada y de su resultado medible.',
  },
  {
    week: 3,
    focus: 'Practica en contexto real',
    objective: 'Aplicar {competency} en un encargo real, con personas de tu entorno.',
    actions: [
      'Elige un encargo autentico y llevalo con el metodo de la semana 2.',
      'Pide a una persona de confianza su opinion sobre el resultado.',
      'Guarda el resultado y el comentario recibido.',
    ],
    evidence: 'Un entregable real y una opinion externa sobre el.',
  },
  {
    week: 4,
    focus: 'Consolididar y evidenciar',
    objective: 'Convertir lo aprendido en un ejemplo presentable en una candidatura.',
    actions: [
      'Resume el antes y el despues en cinco lineas.',
      'Prepara una version breve de la historia para una entrevista.',
      'Cierra la semana con la accion recomendada para el siguiente mes: {action}',
    ],
    evidence: 'Un resumen de cinco lineas con un resultado concreto.',
  },
];

export const PLAN_INTRO =
  'Plan de cuatro semanas construido a partir de tus areas de desarrollo. ' +
  'Cada semana tiene un objetivo, acciones concretas y una evidencia que puedes guardar ' +
  'y usar despues en una candidatura.';
