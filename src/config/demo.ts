/**
 * Datos de demostracion ficticios.
 *
 * Perfil de una persona imaginaria: "Marta", que ha trabajado siempre en
 * cuidados y atencion al cliente y llega al cuestionario con mucha
 * experiencia de vida pero sin titulos Shell. Sirve para probar la aplicacion
 * sin tener que responder las 15 preguntas.
 *
 * Ninguno de estos datos es real.
 */

import type { Answer } from '../engine/types';

export interface DemoProfile {
  displayName: string;
  headline: string;
  sector: string;
  yearsExperience: number;
  description: string;
}

export const DEMO_PROFILE: DemoProfile = {
  displayName: 'Marta (perfil de demostración)',
  headline: 'Cuidados de personas mayores y atención al cliente en tienda',
  sector: 'Salud y cuidados',
  yearsExperience: 9,
  description:
    'Persona ficticia creada para probar la aplicación. Tiene nueve años de experiencia en ' +
    'cuidados y atención al cliente, mucha práctica resolviendo imprevistos y ninguna titulación ' +
    'universitaria.',
};

/** Respuestas de la persona de demostración. */
export const DEMO_ANSWERS: Answer[] = [
  { questionId: 'q01', value: 4 },
  { questionId: 'q02', value: 'b' },
  { questionId: 'q03', value: 4 },
  { questionId: 'q04', value: 'a' },
  { questionId: 'q05', value: 4 },
  { questionId: 'q06', value: 'a' },
  { questionId: 'q07', value: 4 },
  { questionId: 'q08', value: 'b' },
  { questionId: 'q09', value: 5 },
  { questionId: 'q10', value: 'a' },
  { questionId: 'q11', value: 4 },
  { questionId: 'q12', value: 'a' },
  { questionId: 'q13', value: 4 },
  { questionId: 'q14', value: 'a' },
  { questionId: 'q15', value: 3 },
];
