/**
 * Catalogo estatico de recomendaciones profesionales.
 *
 * No hay generacion de texto por IA: cada competencia tiene un conjunto fijo
 * de recomendaciones validas, con un titulo, una accion concreta y el
 * argumento por el que aparece. Para ampliar el catalogo basta con anadir
 * entradas aqui.
 */

import type { CompetencyId } from './competencies';

export type RecommendationKind = 'strength' | 'complementary' | 'development';

export interface Recommendation {
  id: string;
  competency: CompetencyId;
  kind: RecommendationKind;
  /** Titulo corto de la recomendacion. */
  title: string;
  /** Accion concreta y aplicable. */
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
    title: 'Pon tu criterio analitico a trabajar en problemas mal definidos',
    action:
      'Busca responsabilidades que incluyan problemas abiertos, como mejoras de proceso o incidencias, y documenta como los resuelves.',
    rationale:
      'Las respuestas indican una forma estructurada de abordar problemas poco definidos, algo muy valorado en mejora continua.',
  },
  {
    id: 'ps-development',
    competency: 'problemSolving',
    kind: 'development',
    title: 'Practica el analisis de causa antes de actuar',
    action:
      'En el proximo problema que te encuentres, escribe tres lineas: que ocurre, por que ocurre y que probaria. Repitelo al menos cinco veces.',
    rationale:
      'El cuestionario muestra como tiendes a resolver de forma practica. Los equipos valoran que el analisis quede explicito y sea reproducible.',
  },
  {
    id: 'ps-complementary',
    competency: 'problemSolving',
    kind: 'complementary',
    title: 'Convierte tu practica en un metodo transferible',
    action:
      'Escribe un manual breve de los pasos que sigues cuando algo falla. Sirve como evidencia de competencia en cualquier candidatura.',
    rationale:
      'Tienes una base solida de resolucion de problemas que puede reaparecer en puestos donde antes no la aplicabas.',
  },

  // --- Organizacion y planificacion ---
  {
    id: 'pl-strength',
    competency: 'planning',
    kind: 'strength',
    title: 'Lidera con planificacion visible',
    action:
      'Propone agendas, listas de control o calendarios donde la parte visible de tu forma de trabajar aporte valor al equipo.',
    rationale:
      'La evaluacion destaca tu capacidad para priorizar y sacar adelante lo planificado.',
  },
  {
    id: 'pl-development',
    competency: 'planning',
    kind: 'development',
    title: 'Ordena tus tareas con un metodo simple y sostenible',
    action:
      'Usa una sola lista con tres columnas (pendiente, en curso, hecho) y revisala a fin de semana durante cuatro semanas.',
    rationale:
      'Hay margen de mejora en la parte organizativa. Un metodo minimo y constante suele funcionar mejor que un sistema complejo.',
  },
  {
    id: 'pl-complementary',
    competency: 'planning',
    kind: 'complementary',
    title: 'Aplica tu planificacion a entornos nuevos',
    action:
      'Aplica tu metodo de orden de tareas a un ambito que no domines, como formacion, voluntariado o un proyecto personal, y dejalo por escrito.',
    rationale:
      'Tu capacidad de planificacion es solida y puede reforzarse en contextos diferentes.',
  },

  // --- Comunicacion ---
  {
    id: 'co-strength',
    competency: 'communication',
    kind: 'strength',
    title: 'Usa tu comunicacion como ventaja competitiva',
    action:
      'Opta por puestos de coordinacion, atencion o formacion, donde buena parte del valor esta en explicar con claridad.',
    rationale:
      'La comunicacion alcanza un nivel alto en la evaluacion, con enfasis en adaptar el mensaje a cada interlocutor.',
  },
  {
    id: 'co-development',
    competency: 'communication',
    kind: 'development',
    title: 'Estructura tus mensajes en tres bloques',
    action:
      'En tus proximas presentaciones o informes usa la estructura contexto, clave, peticion. Al final, comprueba que han entendido.',
    rationale:
      'Comunicar con estructura es una habilidad aprendible y muy valorada en entornos profesionales.',
  },
  {
    id: 'co-complementary',
    competency: 'communication',
    kind: 'complementary',
    title: 'Sostiene conversaciones-Explicas con quien no trabaja contigo',
    action:
      'Documenta como explicas un proceso a alguien no especialista. Te sirve de evidencia y de guion reutilizable.',
    rationale:
      'Comunicas bien y sabes moverte entre registros distintos, una combinacion util en equipos muy variados.',
  },

  // --- Colaboracion ---
  {
    id: 'cb-strength',
    competency: 'collaboration',
    kind: 'strength',
    title: 'Busca puestos donde el trabajo con otras personas sea el centro',
    action:
      'Busca equipos pequenos, coordinacion de recursos o roles de enlace, donde tu forma de resolver diferencias sea una ventaja.',
    rationale:
      'La colaboracion aparece como una de tus competencias mejor situadas.',
  },
  {
    id: 'cb-development',
    competency: 'collaboration',
    kind: 'development',
    title: 'Entrena la colaboracion en situaciones de desacuerdo',
    action:
      'En tu proximo equipo, plantea las diferencias por escrito antes de la reunion, con dos opciones y una propuesta.',
    rationale:
      'Se detecta margen en el trabajo con desacuerdos. Practicar la conversacion estructurada mejora el resultado visible.',
  },
  {
    id: 'cb-complementary',
    competency: 'collaboration',
    kind: 'complementary',
    title: 'Documenta como has resuelto conflictos en trabajos anteriores',
    action:
      'Prepara dos ejemplos de conflictos reales: que paso, que hiciste y como termino. Sirven para cualquier candidatura.',
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
      'Valora puestos en proyectos en marcha, reorganizaciones o trabajo por campanas. Encaja con tu forma de funcionar.',
    rationale:
      'Los cambios de plan se gestionan con soltura, una ventaja en entornos por proyectos o en transformacion.',
  },
  {
    id: 'ad-development',
    competency: 'adaptability',
    kind: 'development',
    title: 'Reduce el tiempo de bloqueo ante los cambios',
    action:
      'Cuando algo cambie sin aviso, escribe tus tres primeras acciones en menos de diez minutos. Repitelo durante un mes.',
    rationale:
      'La adaptabilidad es clave en la mayoria de los entornos actuales. Trabajar el tiempo de respuesta la hace visible.',
  },
  {
    id: 'ad-complementary',
    competency: 'adaptability',
    kind: 'complementary',
    title: 'Suma la adaptabilidad a tus otras fortalezas',
    action:
      'En tu candidatura, une tu capacidad de adaptacion con la competencia que ya dominas. Juntas forman un perfil mas raro y valioso.',
    rationale:
      'Te adaptas con facilidad. Al combinarla con tu otra fortaleza, el perfil gana personalidad.',
  },

  // --- Aprendizaje autonomo ---
  {
    id: 'sl-strength',
    competency: 'selfLearning',
    kind: 'strength',
    title: 'Convierte el aprendizaje en una seccion de tu CV',
    action:
      'Anota durante seis meses todo lo que aprendes por tu cuenta, con una linea de impacto. Te dara material de entrevista.',
    rationale:
      'Aprender sin que te lo impongan aparece entre tus puntos fuertes.',
  },
  {
    id: 'sl-development',
    competency: 'selfLearning',
    kind: 'development',
    title: 'Cierra el circulo: aprende y aplica',
    action:
      'Elige un tema de tu trabajo, aprende en un curso corto y aplicalo en una semana. Repite cada trimestre.',
    rationale:
      'Aprender por cuenta propia esta presente, pero con menos evidencia. Aplicarlo convierte el aprendizaje en resultado.',
  },
  {
    id: 'sl-complementary',
    competency: 'selfLearning',
    kind: 'complementary',
    title: 'Comparte lo que aprendes',
    action:
      'En tu equipo, comparte un resumen breve de algo que has aprendido. Refuerza la colaboracion y la comunicacion a la vez.',
    rationale:
      'Tienes curiosidad y capacidad de aprender por tu cuenta, un valor que se agradece en equipos que evolucionan.',
  },

  // --- Atencion al detalle ---
  {
    id: 'at-strength',
    competency: 'attentionToDetail',
    kind: 'strength',
    title: 'Candidaturas donde el error tenga coste',
    action:
      'Fijate en roles de calidad, facturacion, documentacion tecnica, administracion o atencion al cliente.',
    rationale:
      'La revision previa a la entrega es uno de tus rasgos mas marcados.',
  },
  {
    id: 'at-development',
    competency: 'attentionToDetail',
    kind: 'development',
    title: 'Crea una lista de verificacion personal',
    action:
      'Para cada tipo de entrega importante anota tres comprobaciones y aplicalas siempre. Medir es la unica forma de mejorar.',
    rationale:
      'Hay margen en la parte de revision. Un procedimiento corto y constante lo resuelve.',
  },
  {
    id: 'at-complementary',
    competency: 'attentionToDetail',
    kind: 'complementary',
    title: 'Une el detalle con la mejora continua',
    action:
      'Propon en tu trabajo una mejora pequena de proceso y midela durante un mes.',
    rationale:
      'Tu atencion al detalle puede aportar a la mejora de procesos, no solo a la ejecucion.',
  },

  // --- Orientacion a la persona usuaria ---
  {
    id: 'cu-strength',
    competency: 'customerOrientation',
    kind: 'strength',
    title: 'Busca el lado de contacto con personas',
    action:
      'Valora puestos de atencion, servicio al cliente, soporte, ventas o mediacion, donde importe entender bien a la persona.',
    rationale:
      'La orientacion a la otra persona destaca entre tus competencias mejor situadas.',
  },
  {
    id: 'cu-development',
    competency: 'customerOrientation',
    kind: 'development',
    title: 'Anticipa la necesidad antes de que la pidan',
    action:
      'En tu proxima interaccion termina preguntando que necesitaria de ti, y anota la respuesta. Repite durante un mes.',
    rationale:
      'Existe margen en la parte de anticipacion. La pregunta final es un recurso barato y muy eficaz.',
  },
  {
    id: 'cu-complementary',
    competency: 'customerOrientation',
    kind: 'complementary',
    title: 'Aplica tu orientacion a la persona en roles internos',
    action:
      'En soporte interno, como informatica, compras o administracion, pide a quien te ayuda que te explique que necesita de ti.',
    rationale:
      'Tu sensibilidad hacia las necesidades de la otra persona se puede aplicar tambien dentro de la organizacion.',
  },

  // --- Iniciativa ---
  {
    id: 'in-strength',
    competency: 'initiative',
    kind: 'strength',
    title: 'Busca autonomia real, no solo responsabilidad nominal',
    action:
      'Al evaluar una oferta, pregunta quien decide y con que margen de accion. Busca contextos con margen real.',
    rationale:
      'La iniciativa aparece con puntuacion alta, incluida la capacidad de arrancar sin instrucciones claras.',
  },
  {
    id: 'in-development',
    competency: 'initiative',
    kind: 'development',
    title: 'Convierte la iniciativa en propuestas visibles',
    action:
      'Cuando detectes una mejora, mandala por escrito con el impacto esperado y el tiempo que requiere. Una propuesta al mes.',
    rationale:
      'La iniciativa necesita un cauce. Sin el, el esfuerzo se queda en lo invisible.',
  },
  {
    id: 'in-complementary',
    competency: 'initiative',
    kind: 'complementary',
    title: 'Compagina iniciativa con criterio de equipo',
    action:
      'Antes de lanzar una idea en tu equipo, consulta a las dos personas mas afectadas. La iniciativa informada rinde mas.',
    rationale:
      'Tienes iniciativa y ademas sabes colaborar, una combinacion que reduce los roces.',
  },

  // --- Creatividad practica ---
  {
    id: 'cr-strength',
    competency: 'practicalCreativity',
    kind: 'strength',
    title: 'Busca problemas con recursos limitados',
    action:
      'En sectores de logistica, servicios, hosteleria, administracion publica o pequena empresa, la resolucion practica es un activo raro.',
    rationale:
      'Encontrar soluciones sencillas con los recursos disponibles es una competencia poco comun y muy buscada.',
  },
  {
    id: 'cr-development',
    competency: 'practicalCreativity',
    kind: 'development',
    title: 'Practica el rediseno de algo pequeno',
    action:
      'Elige un proceso cotidiano, como un formulario, un correo o un turno, y redisenalo en quince minutos. Repite cada mes.',
    rationale:
      'La creatividad aplicada necesita practica deliberada. Los ejercicios cortos funcionan mejor que la inspiracion.',
  },
  {
    id: 'cr-complementary',
    competency: 'practicalCreativity',
    kind: 'complementary',
    title: 'Pon tu creatividad al servicio de otra competencia',
    action:
      'Usa la creatividad practica para resolver un problema de organizacion o de comunicacion y mide el resultado.',
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
