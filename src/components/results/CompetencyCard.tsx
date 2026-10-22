import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Icon } from '../ui/Icon';
import type { CompetencyScore } from '../../engine/types';

const toneFor = (score: number): 'emerald' | 'sky' | 'amber' | 'rose' => {
  if (score >= 80) return 'emerald';
  if (score >= 60) return 'sky';
  if (score >= 45) return 'amber';
  return 'rose';
};

export const CompetencyCard = ({
  score,
  showEvidence = true,
}: {
  score: CompetencyScore;
  showEvidence?: boolean;
}) => {
  const evidence = score.evidence.slice(0, 2);
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{score.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{score.levelDescription}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold tabular-nums text-slate-900">{score.score}</p>
          <Badge tone={toneFor(score.score)} className="mt-1">
            {score.levelLabel}
          </Badge>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={score.score} color={score.color} />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Confianza orientativa: {Math.round(score.confidence * 100)}% · basada en{' '}
        {score.evidenceCount} {score.evidenceCount === 1 ? 'pregunta' : 'preguntas'}
      </p>

      {showEvidence && evidence.length > 0 ? (
        <details className="mt-3 rounded-xl bg-slate-50 p-3">
          <summary className="cursor-pointer list-none text-xs font-semibold text-indigo-700">
            Ver respuestas que respaldan este resultado
          </summary>
          <ul className="mt-2 space-y-2">
            {evidence.map((item) => (
              <li key={item.questionId} className="text-xs leading-relaxed text-slate-600">
                <span className="font-medium text-slate-700">“{item.answerLabel}”</span>
                {item.note ? <span className="block text-slate-500">{item.note}</span> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </li>
  );
};

export const ScoreRing = ({ value, label, sublabel }: { value: number; label: string; sublabel?: string }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, value / 100)));

  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-slate-900">{value}</span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">/ 100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {sublabel ? <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p> : null}
      </div>
    </Card>
  );
};

export const InfoNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
    <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
    <div>{children}</div>
  </div>
);
