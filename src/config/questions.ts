/**
 * Banco de preguntas de la evaluación.
 *
 * Cada pregunta declara un tipo, un texto y un conjunto de pesos por competencia.
 * La estructura es declarativa: para reescribir la evaluación basta con editar
 * este archivo y el motor de puntuación se adapta sin tocar la arquitectura.
 *
 * Tipos admitidos:
 *  - `scale`: escala numérica (por ejemplo 1..5). Los pesos son los mismos para
 *    todos los valores de la escala; el valor obtenido se escala según la respuesta.
 *  - `choice`: opciones con pesos propios. Cada opción declara qué competencias
 *    evidencia esa manera de actuar (puede ser 0 para una competencia concreta).
 *
 * `importance` multiplica el peso de la pregunta en el cálculo global.
 * Todos los pesos son >= 0 y la suma de pesos de una opción se mantiene pequeña
 * para que una respuesta no domine por sí sola el resultado.
 */

import type { CompetencyId } from './competencies';

export type QuestionType = 'scale' | 'choice';

export interface QuestionOption {
  value: string;
  label: string;
  /** Pesos por competencia para esta respuesta concreta. */
  weights: Partial<Record<CompetencyId, number>>;
  /** Comentario corto que explica la lectura de la opción (se usa como evidencia). */
  note?: string;
}

interface QuestionBase {
  id: string;
  type: QuestionType;
  title: string;
  /** Texto de apoyo que ayuda a responder sin ambigüedad. */
  help?: string;
  /** Competencias que la pregunta pretende explorar (solo informativa). */
  focus: CompetencyId[];
  /** Multiplicador de importancia de la pregunta (0.5 - 1.5). */
  importance: number;
}

export interface ScaleQuestion extends QuestionBase {
  type: 'scale';
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  weights: Partial<Record<CompetencyId, number>>;
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'choice';
  options: QuestionOption[];
}

export type Question = ScaleQuestion | ChoiceQuestion;

export const QUESTIONS: Question[] = [
  {
    id: 'q01',
    type: 'scale',
    title: 'Cuando te enfrentas a un problema que no conoces, ¿qué haces primero?',
    help: 'Piensa en la última vez que algo no salió como estaba previsto.',
    focus: ['problemSolving', 'adaptability'],
    importance: 1.2,
    min: 1,
    max: 5,
    minLabel: 'Espero a que me indiquen el procedimiento',
    maxLabel: 'Busco por mi cuenta una forma distinta de resolverlo',
    weights: { problemSolving: 1, adaptability: 0.5 },
  },
  {
    id: 'q02',
    type: 'choice',
    title: 'Llegas a tu jornada y dos personas no han podido cubrir su parte. ¿Qué haces?',
    help: 'Imagina que el trabajo no puede esperar y hay plazos que se cumplen.',
    focus: ['planning', 'collaboration', 'initiative'],
    importance: 1.1,
    options: [
      {
        value: 'a',
        label:
          'Reorganizo mi propia tarea y aviso a quien coordina para que no se acumulen retrasos',
        note: 'Reorganización personal con aviso a la persona responsable.',
        weights: { planning: 1, collaboration: 0.7, initiative: 0.4 },
      },
      {
        value: 'b',
        label: 'Lo comento con el equipo y proponemos un reparto nuevo entre todos',
        note: 'Propuesta compartida de reparto.',
        weights: { collaboration: 1, communication: 0.7, planning: 0.4 },
      },
      {
        value: 'c',
        label: 'Sigo con mi parte y espero a que la situación se resuelva por sí sola',
        note: 'Mantiene su tarea y evita el conflicto, sin anticipar el problema.',
        weights: { planning: 0.3, collaboration: 0.2 },
      },
      {
        value: 'd',
        label: 'Termino lo mío a mi hora y no intervengo, no me corresponde decidirlo',
        note: 'Prioriza su propio trabajo sin anticipar el impacto en el equipo.',
        weights: { planning: 0.2, collaboration: 0.1 },
      },
    ],
  },
  {
    id: 'q03',
    type: 'scale',
    title: 'Cuando organizas tu trabajo, ¿con qué detalle lo planificas?',
    help: 'Piensa en cómo decides qué se hace primero, qué se puede posponer y qué revisas.',
    focus: ['planning', 'attentionToDetail'],
    importance: 1.1,
    min: 1,
    max: 5,
    minLabel: 'Lo abordo según va surgiendo',
    maxLabel: 'Hago una lista, priorizo y reviso lo entregado',
    weights: { planning: 1, attentionToDetail: 0.4 },
  },
  {
    id: 'q04',
    type: 'choice',
    title: 'Tienes que explicar algo técnico a alguien que no tiene conocimientos técnicos.',
    help: 'El objetivo es que la otra persona entienda y pueda decidir.',
    focus: ['communication'],
    importance: 1.1,
    options: [
      {
        value: 'a',
        label: 'Uso ejemplos cotidianos, evito tecnicismos y compruebo que ha entendido',
        note: 'Adapta el lenguaje y verifica la comprensión.',
        weights: { communication: 1, customerOrientation: 0.4 },
      },
      {
        value: 'b',
        label:
          'Explico el proceso paso a paso tal como lo hago yo, con el nivel de detalle necesario',
        note: 'Explicación ordenada y completa, con vocabulario técnico.',
        weights: { communication: 0.8, planning: 0.4 },
      },
      {
        value: 'c',
        label: 'Le envío un documento con la información completa para que la lea cuando pueda',
        note: 'Traslada la información al formato documento.',
        weights: { communication: 0.4, attentionToDetail: 0.3 },
      },
      {
        value: 'd',
        label: 'Le digo que es algo complicado y que lo consulte con alguien del equipo',
        note: 'Remite la consulta a una persona más experimentada.',
        weights: { collaboration: 0.4, communication: 0.2 },
      },
    ],
  },
  {
    id: 'q05',
    type: 'scale',
    title: 'En un proyecto en equipo surge un desacuerdo sobre cómo continuar.',
    help: 'Describe qué suele pasar en la práctica, no lo que idealizarías que pasa.',
    focus: ['collaboration', 'communication'],
    importance: 1.1,
    min: 1,
    max: 5,
    minLabel: 'Prefiero apartarme y seguir mi parte',
    maxLabel: 'Escucho las posturas, busco un acuerdo y lo planteo con argumentos',
    weights: { collaboration: 1, communication: 0.8 },
  },
  {
    id: 'q06',
    type: 'choice',
    title: 'Una persona te llama irritada porque algo no ha salido como esperaba.',
    help: 'Piensa en cómo suele empezar la conversación y en cómo termina.',
    focus: ['customerOrientation', 'communication'],
    importance: 1.2,
    options: [
      {
        value: 'a',
        label:
          'Escucho hasta el final, le pido que me cuente qué esperaba y propongo un siguiente paso',
        note: 'Escucha activa y propuesta de siguiente paso.',
        weights: { customerOrientation: 1, communication: 0.8, problemSolving: 0.3 },
      },
      {
        value: 'b',
        label: 'Le explico con calma qué ha ocurrido y qué podemos hacer desde aquí',
        note: 'Aclara la situación y ofrece alternativas.',
        weights: { communication: 0.9, customerOrientation: 0.5, problemSolving: 0.4 },
      },
      {
        value: 'c',
        label: 'Le indico las causas y le recuerdo que el proceso ya estaba comunicado',
        note: 'Justifica la situación ante la reclamación.',
        weights: { communication: 0.5, customerOrientation: 0.2, attentionToDetail: 0.2 },
      },
      {
        value: 'd',
        label: 'Le paso el caso a otra persona porque no me corresponde gestionarlo',
        note: 'Traslada la conversación a una tercera persona.',
        weights: { collaboration: 0.3, communication: 0.2 },
      },
    ],
  },
  {
    id: 'q07',
    type: 'scale',
    title: 'Un plan cambia a última hora y hay que reorganizar el trabajo.',
    help: '¿Qué valoras más: la rapidez para reubicarte o el cuidado para no romper nada?',
    focus: ['adaptability', 'problemSolving'],
    importance: 1.1,
    min: 1,
    max: 5,
    minLabel: 'Me bloquea hasta que me lo indiquen claramente',
    maxLabel: 'Me adapto rápido y propongo cómo repartirlo',
    weights: { adaptability: 1, problemSolving: 0.4 },
  },
  {
    id: 'q08',
    type: 'choice',
    title: 'Detectas un error en un proceso que ya conocías bien y nunca habías visto ahí.',
    help: 'Lo has detectado tú, en tu trabajo o en algo que gestionas.',
    focus: ['attentionToDetail', 'initiative'],
    importance: 1.1,
    options: [
      {
        value: 'a',
        label: 'Lo corrijo, lo aviso a quien corresponda y dejo constancia de lo ocurrido',
        note: 'Corrige, comunica y deja registro.',
        weights: { attentionToDetail: 1, initiative: 0.7, communication: 0.3 },
      },
      {
        value: 'b',
        label:
          'Lo corrijo y lo menciono a las personas con las que trabajo para evitar que se repita',
        note: 'Corrige y comparte el aprendizaje con el equipo.',
        weights: { attentionToDetail: 0.8, collaboration: 0.6, initiative: 0.4 },
      },
      {
        value: 'c',
        label: 'Lo corrijo sin darlo a conocer, ya que no era mi tarea',
        note: 'Resuelve el error puntual sin comunicar.',
        weights: { attentionToDetail: 0.5, collaboration: 0.1 },
      },
      {
        value: 'd',
        label: 'No lo toco: si el proceso funciona así desde hace tiempo, mejor no cambiarlo',
        note: 'Mantiene el procedimiento por inercia.',
        weights: { planning: 0.2, attentionToDetail: 0.1 },
      },
    ],
  },
  {
    id: 'q09',
    type: 'scale',
    title: 'Cuando quieres aprender algo nuevo, ¿cómo lo haces?',
    help: 'Piensa en la última cosa que aprendiste sin que nadie te lo impusiera.',
    focus: ['selfLearning', 'initiative'],
    importance: 1.1,
    min: 1,
    max: 5,
    minLabel: 'Espero a que me lo enseñen o me lo pidan',
    maxLabel: 'Busco fuentes, practico por mi cuenta y pregunto cuando me atasco',
    weights: { selfLearning: 1, initiative: 0.5 },
  },
  {
    id: 'q10',
    type: 'choice',
    title:
      'Fuera de un empleo formal has tenido que resolver algo desde cero: cuidar a una persona, sostener un hogar, llevar un pequeño negocio o colaborar en un proyecto vecinal.',
    help:
      'Cuenta una situación real, sin importar si estaba remunerada. Piensa en horarios, dinero, personas e imprevistos.',
    focus: [
      'planning',
      'adaptability',
      'selfLearning',
      'communication',
      'collaboration',
      'initiative',
      'attentionToDetail',
      'practicalCreativity',
    ],
    importance: 1.3,
    options: [
      {
        value: 'a',
        label:
          'Organicé horarios, dinero y personas; además busqué formas más sencillas de hacerlo y fui ajustando sobre la marcha',
        note: 'Gestión autónoma con búsqueda de soluciones prácticas.',
        weights: {
          planning: 1,
          adaptability: 0.8,
          selfLearning: 0.6,
          attentionToDetail: 0.5,
          practicalCreativity: 0.9,
          initiative: 0.5,
        },
      },
      {
        value: 'b',
        label:
          'Me coordiné con otras personas y con servicios externos para resolverlo, y en esos momentos tuve que explicar y negociar',
        note: 'Coordinación y negociación con terceros.',
        weights: {
          collaboration: 1,
          communication: 0.9,
          problemSolving: 0.5,
          adaptability: 0.4,
          customerOrientation: 0.4,
        },
      },
      {
        value: 'c',
        label: 'Tuve que aprender cosas que no conocía, buscar información por mi cuenta y resolver imprevistos',
        note: 'Aprendizaje autónomo bajo presión de tiempo.',
        weights: {
          selfLearning: 1,
          adaptability: 0.8,
          problemSolving: 0.6,
          initiative: 0.4,
        },
      },
      {
        value: 'd',
        label: 'En su momento me apoyé en personas con más experiencia o en el entorno más próximo',
        note: 'Apoyo cercano y coordinación con el entorno.',
        weights: {
          collaboration: 0.7,
          communication: 0.5,
          adaptability: 0.4,
          customerOrientation: 0.3,
        },
      },
    ],
  },
  {
    id: 'q11',
    type: 'scale',
    title: 'Cuando alguien te pide ayuda, ¿qué suele ocurrir?',
    help: 'Por ejemplo un compañero, un familiar o una persona que te escribe.',
    focus: ['collaboration', 'communication', 'customerOrientation'],
    importance: 1,
    min: 1,
    max: 5,
    minLabel: 'Me cuesta dedicarle tiempo si ya tengo lo mío',
    maxLabel: 'Me hago cargo de inmediato y dedico el tiempo que haga falta',
    weights: { collaboration: 0.7, communication: 0.6, customerOrientation: 0.5 },
  },
  {
    id: 'q12',
    type: 'choice',
    title: 'Te llega una tarea nueva, sin plazo ni instrucciones claras.',
    help: 'Nadie te explica qué se espera ni cuándo se entrega.',
    focus: ['initiative', 'problemSolving', 'communication'],
    importance: 1.1,
    options: [
      {
        value: 'a',
        label: 'Primero aclaro qué se espera y con quién coordino, y después arranco',
        note: 'Aclara requisitos antes de ejecutar.',
        weights: { initiative: 1, problemSolving: 0.7, communication: 0.6 },
      },
      {
        value: 'b',
        label:
          'Empiezo por lo más evidente, avanzo a mi ritmo y luego ajusto según me den más información',
        note: 'Arranca y va ajustando.',
        weights: { initiative: 0.7, adaptability: 0.5, problemSolving: 0.4 },
      },
      {
        value: 'c',
        label: 'Espero a que me den instrucciones más concretas antes de tocar nada',
        note: 'Espera instrucciones antes de actuar.',
        weights: { planning: 0.3, communication: 0.2 },
      },
      {
        value: 'd',
        label: 'Dejo la tarea en segundo plano hasta que aparezca otra cosa más urgente',
        note: 'Aplaza la tarea sin criterio propio.',
        weights: { planning: 0.2, adaptability: 0.2 },
      },
    ],
  },
  {
    id: 'q13',
    type: 'scale',
    title: 'Cambian las herramientas o la forma de trabajar en la que estás.',
    help: 'Por ejemplo una aplicación nueva, un procedimiento distinto o un sistema que no conocías.',
    focus: ['adaptability', 'selfLearning'],
    importance: 1,
    min: 1,
    max: 5,
    minLabel: 'Me cuesta hasta que me lo explican en detalle',
    maxLabel: 'Lo pruebo por mi cuenta, lo adapto y sigo trabajando',
    weights: { adaptability: 1, selfLearning: 0.7 },
  },
  {
    id: 'q14',
    type: 'choice',
    title: 'Tienes algo de tiempo libre y una tarea pendiente que no es urgente.',
    help: 'Ese momento en el que podrías descartar algo o aprovecharlo.',
    focus: ['practicalCreativity', 'initiative'],
    importance: 1,
    options: [
      {
        value: 'a',
        label: 'Busco una forma más rápida o más sencilla de hacerla y la dejo resuelta',
        note: 'Optimiza el método con iniciativa propia.',
        weights: { practicalCreativity: 1, initiative: 0.7, problemSolving: 0.4 },
      },
      {
        value: 'b',
        label: 'La hago con calma, revisando los detalles que se suelen pasar por alto',
        note: 'Mejora la calidad cuidando el detalle.',
        weights: { attentionToDetail: 0.8, planning: 0.4, practicalCreativity: 0.3 },
      },
      {
        value: 'c',
        label: 'Empiezo a prepararla para otro momento, aunque sé que se me va a acumular',
        note: 'Aplaza sin resolver.',
        weights: { planning: 0.3, initiative: 0.1 },
      },
      {
        value: 'd',
        label: 'Descarto la tarea por ahora, ya que no es urgente',
        note: 'Descarta la tarea no urgente.',
        weights: { adaptability: 0.2, planning: 0.1 },
      },
    ],
  },
  {
    id: 'q15',
    type: 'scale',
    title: 'Antes de entregar un trabajo, ¿qué haces?',
    help: 'Piensa en la última entrega importante que hiciste.',
    focus: ['attentionToDetail', 'problemSolving'],
    importance: 1.1,
    min: 1,
    max: 5,
    minLabel: 'Lo entrego en cuanto está terminado',
    maxLabel: 'Lo reviso, lo contrasto y corrijo lo que no cuadra',
    weights: { attentionToDetail: 1, problemSolving: 0.5 },
  },
];

/** Índice de preguntas por id, para acceso rápido. */
export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((question) => [question.id, question]),
);

export const TOTAL_QUESTIONS = QUESTIONS.length;
