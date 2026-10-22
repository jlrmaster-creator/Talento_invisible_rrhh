import type { ReactNode } from 'react';

export const Card = ({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}) => (
  <Tag
    className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 ${className}`}
  >
    {children}
  </Tag>
);

export const CardTitle = ({
  children,
  subtitle,
  className = '',
}: {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}) => (
  <div className={`mb-3 ${className}`}>
    <h2 className="text-base font-semibold text-slate-900">{children}</h2>
    {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
  </div>
);
