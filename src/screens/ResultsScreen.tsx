import { useState } from 'react';
import { useNavigate } from '../app/router';
import { useAssessment } from '../app/AssessmentContext';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Icon } from '../components/ui/Icon';
import { CompetencyCard, InfoNote, ScoreRing } from '../components/results/CompetencyCard';
import { recommendationFor } from '../engine/talentMap';
import { PLAN_INTRO, PLAN_WEEK_TEMPLATES } from '../config/plan';
import { COMPETENCIES } from '../config/competencies';
import { SCORING_CONFIG } from '../config/scoring';
import { loadProfile } from '../storage/localStorage';

export const ResultsScreen = () => {
  const { navigate } = useNavigate();
  const { map, answers, completedAt, saveCurrent } = useAssessment();
  const [showMethod, setShowMethod] = useState(false);
  const [profile] = useState(() => loadProfile());

  if (!map || answers.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon="📊"
          title="Todavia no tienes un mapa de talento"
          description="Completa la evaluacion para ver tus competencias, fortalezas y areas de desarrollo."
          action={<Button onClick={() => navigate('assessment')}>Empezar la evaluacion</Button>}
        />
      </div>
    );
  }

  const developmentArea = map.development[0] ?? map.complementary[0] ?? map.strengths[0];
  const devCompetency = COMPETENCIES[developmentArea.id as keyof typeof COMPETENCIES];
  const devRecommendation =
    recommendationFor(developmentArea, 'development') ??
    recommendationFor(developmentArea, 'complementary') ??
    recommendationFor(developmentArea, 'strength');

  const recommendations = [
    ...map.strengths.slice(0, 2).map((score) => ({ score, kind: 'strength' as const })),
    ...map.complementary.slice(0, 2).map((score) => ({ score, kind: 'complementary' as const })),
    ...map.development.slice(0, 2).map((score) => ({ score, kind: 'development' as const })),
  ]
    .map(({ score, kind }) => ({ score, recommendation: recommendationFor(score, kind) }))
    .filter((item) => item.recommendation);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="indigo">Mapa de talento</Badge>
          <Badge tone="slate">Cuestionario v{map.questionnaireVersion}</Badge>
          {completedAt ? (
            <Badge tone="slate">
              {new Date(completedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Badge>
          ) : null}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Tu mapa de talento</h1>
        {profile?.displayName ? (
          <p className="mt-1 text-sm font-medium text-indigo-700">{profile.displayName}</p>
        ) : null}
        {profile?.headline ? <p className="text-sm text-slate-500">{profile.headline}</p> : null}
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{map.summary}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreRing
          value={map.overallIndex}
          label="Índice de talento visible"
          sublabel={map.overallLevelLabel}
        />
        <Card className="flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Cómo se ha calculado</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Cada respuesta aporta puntos a una o varias competencias. La puntuación final es la
              suma de esos puntos dividida por el máximo posible, con un ajuste que evita que una
              competencia explorada por una sola pregunta dé un resultado extremo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMethod((value) => !value)}
            className="self-start text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            {showMethod ? 'Ocultar detalle' : 'Ver el detalle del cálculo'}
          </button>
          {showMethod ? (
            <div className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
              <p className="mb-2 font-semibold text-slate-700">Fórmula aplicada</p>
              <p>
                puntos = Σ (peso de la pregunta × valor de la respuesta × importancia de la
                pregunta)
              </p>
              <p className="mt-1">
                puntuación = (puntos + {SCORING_CONFIG.priorStrength} ×{' '}
                {SCORING_CONFIG.priorRatio}) ÷ (máximo posible + {SCORING_CONFIG.priorStrength}) × 100
              </p>
              <p className="mt-3">
                Las respuestas se guardan y el resultado se recalcula siempre con las mismas reglas,
                de modo que dos personas con las mismas respuestas obtienen el mismo mapa.
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Principales fortalezas</h2>
          <span className="text-xs text-slate-500">Lo que mejor te define ahora mismo</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {map.strengths.map((score) => (
            <CompetencyCard key={score.id} score={score} />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Habilidades complementarias</h2>
          <span className="text-xs text-slate-500">Apoyan tu perfil y tienen recorrido</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {map.complementary.map((score) => (
            <CompetencyCard key={score.id} score={score} />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Áreas que puedes desarrollar</h2>
          <span className="text-xs text-slate-500">Dónde hay más margen</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {map.development.map((score) => (
            <CompetencyCard key={score.id} score={score} />
          ))}
        </ul>
      </section>

      <section>
        <CardTitle subtitle="Sugerencias de un catálogo predefinido, no generadas por IA.">
          Recomendaciones profesionales
        </CardTitle>
        <ul className="grid gap-3 sm:grid-cols-2">
          {recommendations.map(({ score, recommendation }) => (
            <li
              key={`${score.id}-${recommendation!.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: score.color }}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {score.name}
                </span>
              </div>
              <p className="font-semibold leading-snug text-slate-900">{recommendation!.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{recommendation!.action}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {recommendation!.rationale}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <CardTitle subtitle={PLAN_INTRO}>Plan de desarrollo personal</CardTitle>
        <ol className="space-y-3">
          {PLAN_WEEK_TEMPLATES.map((week) => {
            const objective = week.objective
              .replace('{competency}', devCompetency?.name ?? developmentArea.name)
              .replace('{action}', devRecommendation?.action ?? '');
            const actions = week.actions.map((action) =>
              action
                .replace('{competency}', devCompetency?.name ?? developmentArea.name)
                .replace('{action}', devRecommendation?.action ?? ''),
            );
            return (
              <li key={week.week}>
                <Card>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                      {week.week}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Semana {week.week} · {week.focus}
                      </p>
                      <p className="text-xs text-slate-500">
                        Área principal: {devCompetency?.name ?? developmentArea.name}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{objective}</p>
                  <ul className="mt-3 space-y-1.5">
                    {actions.map((action) => (
                      <li key={action} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <InfoNote>Evidencia a guardar: {week.evidence}</InfoNote>
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <CardTitle subtitle="El detalle completo, ordenado de mayor a menor.">
          Todas las competencias
        </CardTitle>
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {map.ranking.map((score) => (
            <li key={score.id} className="flex items-center gap-4 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {score.name}
                </span>
                <span className="block text-xs text-slate-500">{score.levelLabel}</span>
              </span>
              <span className="w-28 shrink-0">
                <ProgressBar value={score.score} color={score.color} />
              </span>
              <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums text-slate-900">
                {score.score}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Alert tone="info" title="Cómo leer estos resultados">
        Describen cómo has tendido a actuar en situaciones concretas, no lo que puedes hacer en un
        puesto determinado. No son un diagnóstico ni una clasificación de las personas. Úsalos como
        punto de partida para una conversación, y contrasta siempre con tu experiencia real.
      </Alert>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate('reports')} size="lg">
          <Icon name="file" className="h-5 w-5" />
          Generar mis informes PDF
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            saveCurrent();
            navigate('assessment');
          }}
        >
          Repetir la evaluacion
        </Button>
      </div>
    </div>
  );
};
