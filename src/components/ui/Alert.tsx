import type { ReactNode } from 'react';

type Tone = 'info' | 'warning' | 'error' | 'success';

const TONES: Record<Tone, { wrap: string; title: string }> = {
  info: {
    wrap: 'border-sky-200 bg-sky-50 text-sky-900',
    title: 'text-sky-800',
  },
  warning: {
    wrap: 'border-amber-200 bg-amber-50 text-amber-900',
    title: 'text-amber-800',
  },
  error: {
    wrap: 'border-rose-200 bg-rose-50 text-rose-900',
    title: 'text-rose-800',
  },
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    title: 'text-emerald-800',
  },
};

export const Alert = ({
  tone = 'info',
  title,
  children,
  className = '',
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) => {
  const styles = TONES[tone];
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles.wrap} ${className}`} role="note">
      {title ? <p className={`mb-1 font-semibold ${styles.title}`}>{title}</p> : null}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
};
