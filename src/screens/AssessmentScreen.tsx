import { useMemo, useState } from 'react';
import { useNavigate } from '../app/router';
import { useAssessment } from '../app/AssessmentContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Icon } from '../components/ui/Icon';
import { QUESTIONS, type Question } from '../config/questions';

const ScaleQuestionView = ({
  question,
  value,
  onChange,
}: {
  question: Extract<Question, { type: 'scale' }>;
  value: number | undefined;
  onChange: (value: number) => void;
}) => {
  const steps = Array.from({ length: question.max - question.min + 1 }, (_, index) => question.min + index);
  return (
    <div className="space-y-5">
      <div className="flex items-stretch gap-2">
        {steps.map((step) => {
          const active = value === step;
          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              aria-pressed={active}
              className={`h-12 flex-1 rounded-xl border text-base font-semibold transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
      <div className="flex items-start justify-between gap-4 text-xs text-slate-500">
        <span className="max-w-[45%] text-left">{question.minLabel}</span>
        <span className="max-w-[45%] text-right">{question.maxLabel}</span>
      </div>
    </div>
  );
};

const ChoiceQuestionView = ({
  question,
  value,
  onChange,
}: {
  question: Extract<Question, { type: 'choice' }>;
  value: string | undefined;
  onChange: (value: string) => void;
}) => (
  <fieldset className="space-y-2.5">
    <legend className="sr-only">{question.title}</legend>
    {question.options.map((option) => {
      const active = value === option.value;
      return (
        <label
          key={option.value}
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all ${
            active
              ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
              : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={active}
            onChange={() => onChange(option.value)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-indigo-600"
          />
          <span className="text-sm leading-relaxed text-slate-700">{option.label}</span>
        </label>
      );
    })}
  </fieldset>
);

export const AssessmentScreen = () => {
  const { navigate } = useNavigate();
  const { answers, setAnswer, currentIndex, setCurrentIndex, saveCurrent, hasCompleted } =
    useAssessment();
  const [showExit, setShowExit] = useState(false);

  const question = QUESTIONS[currentIndex];
  const answer = answers.find((item) => item.questionId === question?.id);
  const answeredCount = answers.length;
  const isLast = currentIndex === QUESTIONS.length - 1;

  const currentValue = useMemo(() => answer?.value, [answer]);

  if (!question) {
    return (
      <Card>
        <p className="text-sm text-slate-600">No hay preguntas disponibles.</p>
      </Card>
    );
  }

  const handleNext = () => {
    if (isLast) {
      saveCurrent();
      navigate('results');
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      setShowExit(true);
      return;
    }
    setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            Pregunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="text-slate-500">Respondidas: {answeredCount}</span>
        </div>
        <ProgressBar value={currentIndex + 1} max={QUESTIONS.length} color="#4F46E5" />
      </div>

      <Card className="p-6 sm:p-8">
        <h1 className="text-xl font-semibold leading-snug text-slate-900">{question.title}</h1>
        {question.help ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{question.help}</p>
        ) : null}

        <div className="mt-6">
          {question.type === 'scale' ? (
            <ScaleQuestionView
              question={question}
              value={typeof currentValue === 'number' ? currentValue : undefined}
              onChange={(value) => setAnswer(question.id, value)}
            />
          ) : (
            <ChoiceQuestionView
              question={question}
              value={typeof currentValue === 'string' ? currentValue : undefined}
              onChange={(value) => setAnswer(question.id, value)}
            />
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleBack}>
          <Icon name="arrowLeft" className="h-4 w-4" />
          {currentIndex === 0 ? 'Salir' : 'Atrás'}
        </Button>
        <Button onClick={handleNext} disabled={currentValue === undefined} size="lg">
          {isLast ? 'Ver mi mapa de talento' : 'Continuar'}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>

      {hasCompleted ? (
        <p className="text-center text-xs text-slate-500">
          Ya tienes una evaluación completada. Al terminar esta podrás compararla con la nueva.
        </p>
      ) : null}

      {showExit ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowExit(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-2xl">
            <h2 className="text-lg font-semibold text-slate-900">¿Salir de la evaluación?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Lo que ya has respondido se guarda en este dispositivo, así que podrás continuar
              cuando quieras.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setShowExit(false)}>
                Seguir respondiendo
              </Button>
              <Button onClick={() => navigate('home')}>Salir al inicio</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
