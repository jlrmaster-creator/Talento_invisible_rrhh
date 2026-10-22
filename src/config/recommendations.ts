/**
 * Catalogo estatico de recomendaciones profesionales.
 *
 * No hay generacion de texto por IA: cada competencia tiene un conjunto fijo
 * de recomendaciones validas, con un título, una acción concreta y el
 * argumento por el que aparece. Para ampliar el catalogo basta con anadir
 * entradas aquí.
 */

import type { CompetencyId } from './competencies';

export type RecommendationKind = 'strength' | 'complementary' | 'development';

export interface Recommendation {
  id: string;
  competency: CompetencyId;
  kind: RecommendationKind;
  /** Titulo corto de la recomendacion. */
  title: string;
  /** Acción concreta y aplicable. */
  action: string;
  /** Porque aparece esta recomendacion. */
  rationale: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  // --- Resolucion de problemas ---
  {
    id: 'ps-strength',
    competency: 'problemSolving',
    kind: 'strength',
    title: 'Pon tu criterio analítico a trabajar en problemas mal definidos',
    action:
      'Busca responsabilidades que incluyan problemas abiertos, como mejoras de proceso o incidencias, y documenta como los resuelves.',
    rationale:
      'Las respuestas indican una forma estructurada de abordar problemas poco definidos, algo muy valorado en mejora continua.',
  },
  {
    id: 'ps-development',
    competency: 'problemSolving',
    kind: 'development',
    title: 'Practica el análisis de causa antes de actuar',
    action:
      'En el próximo problema que te encuentres, escribe tres líneas: qué ocurre, por qué ocurre y qué probaría. Repítelo al menos cinco veces.',
    rationale:
      'El cuestionario muestra cómo tiendes a resolver de forma práctica. Los equipos valoran que el análisis quede explícito y sea reproducible.',
  },
  {
    id: 'ps-complementary',
    competency: 'problemSolving',
    kind: 'complementary',
    title: 'Convierte tu práctica en un método transferible',
    action:
      'Escribe un manual breve de los pasos que sigues cuando algo falla. Sirve como evidencia de competencia en cualquier candidatura.',
    rationale:
      'Tienes una base sólida de resolución de problemas que puede reaparecer en puestos donde antes no la aplicabas.',
  },

  // --- Organización y planificación ---
  {
    id: 'pl-strength',
    competency: 'planning',
    kind: 'strength',
    title: 'Lidera con planificación visible',
    action:
      'Propone agendas, listas de control o calendarios donde la parte visible de tu forma de trabajar aporte valor al equipo.',
    rationale:
      'La evaluación destaca tu capacidad para priorizar y sacar adelante lo planificado.',
  },
  {
    id: 'pl-development',
    competency: 'planning',
    kind: 'development',
    title: 'Ordena tus tareas con un método simple y sostenible',
    action:
      'Usa una sola lista con tres columnas (pendiente, en curso, hecho) y revísala a fin de semana durante cuatro semanas.',
    rationale:
      'Hay margen de mejora en la parte organizativa. Un método minimo y constante suele funcionar mejor que un sistema complejo.',
  },
  {
    id: 'pl-complementary',
    competency: 'planning',
    kind: 'complementary',
    title: 'Aplica tu planificación a entornos nuevos',
    action:
      'Aplica tu método de orden de tareas a un ámbito que no domines, como formación, voluntariado o un proyecto personal, y déjalo por escrito.',
    rationale:
      'Tu capacidad de planificación es sólida y puede reforzarse en contextos diferentes.',
  },

  // --- Comunicación ---
  {
    id: 'co-strength',
    competency: 'communication',
    kind: 'strength',
    title: 'Usa tu comunicación como ventaja competitiva',
    action:
      'Opta por puestos de coordinación, atención o formación, donde buena parte del valor está en explicar con claridad.',
    rationale:
      'La comunicación alcanza un nivel alto en la evaluación, con énfasis en adaptar el mensaje a cada interlocutor.',
  },
  {
    id: 'co-development',
    competency: 'communication',
    kind: 'development',
    title: 'Estructura tus mensajes en tres bloques',
    action:
      'En tus próximas presentaciones o informes usa la estructura contexto, clave, peticion. Al final, comprueba que han entendido.',
    rationale:
      'Comunicar con estructura es una habilidad aprendible y muy valorada en entornos profesionales.',
  },
  {
    id: 'co-complementary',
    competency: 'communication',
    kind: 'complementary',
    title: 'Explica procesos complejos a quien no trabaja contigo',
    action:
      'Documenta cómo explicas un proceso a alguien no especialista. Te sirve de evidencia y de guion reutilizable.',
    rationale:
      'Comunicas bien y sabes moverte entre registros distintos, una combinación util en equipos muy variados.',
  },

  // --- Colaboración ---
  {
    id: 'cb-strength',
    competency: 'collaboration',
    kind: 'strength',
    title: 'Busca puestos donde el trabajo con otras personas sea el centro',
    action:
      'Busca equipos pequeños, coordinación de recursos o roles de enlace, donde tu forma de resolver diferencias sea una ventaja.',
    rationale:
      'La colaboración aparece como una de tus competencias mejor situadas.',
  },
  {
    id: 'cb-development',
    competency: 'collaboration',
    kind: 'development',
    title: 'Entrena la colaboración en situaciones de desacuerdo',
    action:
      'En tu próximo equipo, plantea las diferencias por escrito antes de la reunión, con dos opciones y una propuesta.',
    rationale:
      'Se detecta margen en el trabajo con desacuerdos. Practicar la conversación estructurada mejora el resultado visible.',
  },
  {
    id: 'cb-complementary',
    competency: 'collaboration',
    kind: 'complementary',
    title: 'Documenta cómo has resuelto conflictos en trabajos anteriores',
    action:
      'Prepara dos ejemplos de conflictos reales: qué pasó, qué hiciste y cómo terminó. Sirven para cualquier candidatura.',
    rationale:
      'Tienes una base de trabajo en equipo que puedes traducir a ejemplos concretos.',
  },

  // --- Adaptabilidad ---
  {
    id: 'ad-strength',
    competency: 'adaptability',
    kind: 'strength',
    title: 'Elige entornos que cambian con frecuencia',
    action:
      'Valora puestos en proyectos en marcha, reorganizaciones o trabajo por campañas. Encaja con tu forma de funcionar.',
    rationale:
      'Los cambios de plan se gestionan con soltura, una ventaja en entornos por proyectos o en transformación.',
  },
  {
    id: 'ad-development',
    competency: 'adaptability',
    kind: 'development',
    title: 'Reduce el tiempo de bloqueo ante los cambios',
    action:
      'Cuando algo cambie sin aviso, escribe tus tres primeras acciones en menos de diez minutos. Repitelo durante un mes.',
    rationale:
      'La adaptabilidad es clave en la mayoría de los entornos actuales. Trabajar el tiempo de respuesta la hace visible.',
  },
  {
    id: 'ad-complementary',
    competency: 'adaptability',
    kind: 'complementary',
    title: 'Suma la adaptabilidad a tus otras fortalezas',
    action:
      'En tu candidatura, une tu capacidad de adaptación con la competencia que ya dominas. Juntas forman un perfil más raro y valioso.',
    rationale:
      'Te adaptas con facilidad. Al combinarla con tu otra fortaleza, el perfil gana personalidad.',
  },

  // --- Aprendizaje autonomo ---
  {
    id: 'sl-strength',
    competency: 'selfLearning',
    kind: 'strength',
    title: 'Convierte el aprendizaje en una sección de tu CV',
    action:
      'Anota durante seis meses todo lo que aprendes por tu cuenta, con una línea de impacto. Te dará material de entrevista.',
    rationale:
      'Aprender sin que te lo impongan aparece entre tus puntos fuertes.',
  },
  {
    id: 'sl-development',
    competency: 'selfLearning',
    kind: 'development',
    title: 'Cierra el círculo: aprende y aplica',
    action:
      'Elige un tema de tu trabajo, aprende en un curso corto y aplicalo en una semana. Repite cada trimestre.',
    rationale:
      'Aprender por cuenta propia está presente, pero con menos evidencia. Aplicarlo convierte el aprendizaje en resultado.',
  },
  {
    id: 'sl-complementary',
    competency: 'selfLearning',
    kind: 'complementary',
    title: 'Comparte lo que aprendes',
    action:
      'En tu equipo, comparte un resumen breve de algo que has aprendido. Refuerza la colaboración y la comunicación a la vez.',
    rationale:
      'Tienes curiosidad y capacidad de aprender por tu cuenta, un valor que se agradece en equipos que evolucionan.',
  },

  // --- Atención al detalle ---
  {
    id: 'at-strength',
    competency: 'attentionToDetail',
    kind: 'strength',
    title: 'Candidaturas donde el error tenga coste',
    action:
      'Fíjate en roles de calidad, facturación, documentación técnica, administración o atención al cliente.',
    rationale:
      'La revisión previa a la entrega es uno de tus rasgos más marcados.',
  },
  {
    id: 'at-development',
    competency: 'attentionToDetail',
    kind: 'development',
    title: 'Crea una lista de verificación personal',
    action:
      'Para cada tipo de entrega importante anota tres comprobaciones y aplícalas siempre. Medir es la única forma de mejorar.',
    rationale:
      'Hay margen en la parte de revisión. Un procedimiento corto y constante lo resuelve.',
  },
  {
    id: 'at-complementary',
    competency: 'attentionToDetail',
    kind: 'complementary',
    title: 'Une el detalle con la mejora continua',
    action:
      'Propón en tu trabajo una mejora pequeña de proceso y mídela durante un mes.',
    rationale:
      'Tu atención al detalle puede aportar a la mejora de procesos, no solo a la ejecución.',
  },

  // --- Orientacion a la persona usuaria ---
  {
    id: 'cu-strength',
    competency: 'customerOrientation',
    kind: 'strength',
    title: 'Busca el lado de contacto con personas',
    action:
      'Valora puestos de atención, servicio al cliente, soporte, ventas o mediación, donde importe entender bien a la persona.',
    rationale:
      'La orientación a la otra persona destaca entre tus competencias mejor situadas.',
  },
  {
    id: 'cu-development',
    competency: 'customerOrientation',
    kind: 'development',
    title: 'Anticipa la necesidad antes de que la pidan',
    action:
      'En tu próxima interacción termina preguntando qué necesitaría de ti, y anota la respuesta. Repite durante un mes.',
    rationale:
      'Existe margen en la parte de anticipación. La pregunta final es un recurso barato y muy eficaz.',
  },
  {
    id: 'cu-complementary',
    competency: 'customerOrientation',
    kind: 'complementary',
    title: 'Aplica tu orientación a la persona en roles internos',
    action:
      'En soporte interno, como informática, compras o administración, pide a quien te ayuda que te explique qué necesita de ti.',
    rationale:
      'Tu sensibilidad hacia las necesidades de la otra persona se puede aplicar también dentro de la organización.',
  },

  // --- Iniciativa ---
  {
    id: 'in-strength',
    competency: 'initiative',
    kind: 'strength',
    title: 'Busca autonomía real, no solo responsabilidad nominal',
    action:
      'Al evaluar una oferta, pregunta quién decide y con qué margen de acción. Busca contextos con margen real.',
    rationale:
      'La iniciativa aparece con puntuación alta, incluida la capacidad de arrancar sin instrucciones claras.',
  },
  {
    id: 'in-development',
    competency: 'initiative',
    kind: 'development',
    title: 'Convierte la iniciativa en propuestas visibles',
    action:
      'Cuando detectes una mejora, mándala por escrito con el impacto esperado y el tiempo que requiere. Una propuesta al mes.',
    rationale:
      'La iniciativa necesita un cauce. Sin él, el esfuerzo se queda en lo invisible.',
  },
  {
    id: 'in-complementary',
    competency: 'initiative',
    kind: 'complementary',
    title: 'Compagina iniciativa con criterio de equipo',
    action:
      'Antes de lanzar una idea en tu equipo, consulta a las dos personas más afectadas. La iniciativa informada rinde más.',
    rationale:
      'Tienes iniciativa y además sabes colaborar, una combinación que reduce los roces.',
  },

  // --- Creatividad práctica ---
  {
    id: 'cr-strength',
    competency: 'practicalCreativity',
    kind: 'strength',
    title: 'Busca problemas con recursos limitados',
    action:
      'En sectores de logística, servicios, hostelería, administración pública o pequeña empresa, la resolución práctica es un activo raro.',
    rationale:
      'Encontrar soluciones sencillas con los recursos disponibles es una competencia poco común y muy buscada.',
  },
  {
    id: 'cr-development',
    competency: 'practicalCreativity',
    kind: 'development',
    title: 'Practica el rediseño de algo pequeño',
    action:
      'Elige un proceso cotidiano, como un formulario, un correo o un turno, y rediséñalo en quince minutos. Repite cada mes.',
    rationale:
      'La creatividad aplicada necesita práctica deliberada. Los ejercicios cortos funcionan mejor que la inspiración.',
  },
  {
    id: 'cr-complementary',
    competency: 'practicalCreativity',
    kind: 'complementary',
    title: 'Pon tu creatividad al servicio de otra competencia',
    action:
      'Usa la creatividad práctica para resolver un problema de organización o de comunicación y mide el resultado.',
    rationale:
      'La creatividad complementaria multiplica el valor de tus otras competencias.',
  },
];

export const recommendationsFor = (
  competency: CompetencyId,
  kind: RecommendationKind,
): Recommendation | undefined =>
  RECOMMENDATIONS.find((item) => item.competency === competency && item.kind === kind);

export const recommendationsByKind = (
  kind: RecommendationKind,
): Recommendation[] => RECOMMENDATIONS.filter((item) => item.kind === kind);
