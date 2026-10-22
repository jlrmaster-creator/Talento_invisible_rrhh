/**
 * Catálogo de competencias evaluadas por Talento Invisible.
 *
 * Este archivo es la única fuente de verdad sobre las competencias. Para añadir,
 * quitar o renombrar una competencia basta con editar esta lista y las
 * referencias de `config/questions.ts` y `config/recommendations.ts`.
 */

export const COMPETENCY_IDS = [
  'problemSolving',
  'planning',
  'communication',
  'collaboration',
  'adaptability',
  'selfLearning',
  'attentionToDetail',
  'customerOrientation',
  'initiative',
  'practicalCreativity',
] as const;

export type CompetencyId = (typeof COMPETENCY_IDS)[number];

export interface Competency {
  id: CompetencyId;
  /** Nombre completo que se muestra en la interfaz y en los informes. */
  name: string;
  /** Nombre corto, para etiquetas compactas (tarjetas, gráficas). */
  shortName: string;
  /** Explicación breve y neutral de qué mide la competencia. */
  description: string;
  /** Color representativo (Tailwind + PDF). */
  color: string;
  /** Color suave para fondos. */
  softColor: string;
}

export const COMPETENCIES: Record<CompetencyId, Competency> = {
  problemSolving: {
    id: 'problemSolving',
    name: 'Resolución de problemas',
    shortName: 'Problemas',
    description:
      'Enfrentarse a situations nuevas, buscar causas y llegar a una solución viable.',
    color: '#4F46E5',
    softColor: '#EEF2FF',
  },
  planning: {
    id: 'planning',
    name: 'Organización y planificación',
    shortName: 'Planificación',
    description:
      'Ordenar tareas, distribuir tiempos y anticipar lo que puede complicarse.',
    color: '#7C3AED',
    softColor: '#F5F3FF',
  },
  communication: {
    id: 'communication',
    name: 'Comunicación',
    shortName: 'Comunicación',
    description:
      'Transmitir ideas de forma clara, adaptar el mensaje y escuchar con atención.',
    color: '#0891B2',
    softColor: '#ECFEFF',
  },
  collaboration: {
    id: 'collaboration',
    name: 'Colaboración',
    shortName: 'Colaboración',
    description:
      'Trabajar con otras personas, aportar y resolver diferencias de forma constructiva.',
    color: '#DB2777',
    softColor: '#FDF2F8',
  },
  adaptability: {
    id: 'adaptability',
    name: 'Adaptabilidad',
    shortName: 'Adaptabilidad',
    description:
      'Reaccionar con calma ante cambios, prioridades nuevas o imprevistos.',
    color: '#EA580C',
    softColor: '#FFF7ED',
  },
  selfLearning: {
    id: 'selfLearning',
    name: 'Aprendizaje autónomo',
    shortName: 'Aprendizaje',
    description:
      'Aprender por cuenta propia, pedir feedback y aplicar lo aprendido con criterio.',
    color: '#16A34A',
    softColor: '#F0FDF4',
  },
  attentionToDetail: {
    id: 'attentionToDetail',
    name: 'Atención al detalle',
    shortName: 'Detalle',
    description:
      'Revisar el trabajo, detectar errores y cuidar los detalles que importan.',
    color: '#0D9488',
    softColor: '#F0FDFA',
  },
  customerOrientation: {
    id: 'customerOrientation',
    name: 'Orientación a la persona usuaria',
    shortName: 'Orientación',
    description:
      'Entender qué necesita la otra persona y devolver una respuesta útil y cercana.',
    color: '#C026D3',
    softColor: '#FAF5FF',
  },
  initiative: {
    id: 'initiative',
    name: 'Iniciativa',
    shortName: 'Iniciativa',
    description:
      'Tomar la iniciativa, hacer propuestas y avanzar sin esperar a que todo esté claro.',
    color: '#CA8A04',
    softColor: '#FEFCE8',
  },
  practicalCreativity: {
    id: 'practicalCreativity',
    name: 'Creatividad práctica',
    shortName: 'Creatividad',
    description:
      'Encontrar soluciones sencillos y aplicables con los recursos que hay.',
    color: '#9333EA',
    softColor: '#FAF5FF',
  },
};

export const COMPETENCY_LIST: Competency[] = COMPETENCY_IDS.map((id) => COMPETENCIES[id]);

export const getCompetency = (id: CompetencyId): Competency => COMPETENCIES[id];
