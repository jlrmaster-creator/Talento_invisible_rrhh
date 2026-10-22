import type { ReactNode } from 'react';

export const EmptyState = ({
  title,
  description,
  action,
  icon = '📋',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
}) => (
  <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
    <span className="mb-3 text-3xl" aria-hidden="true">
      {icon}
    </span>
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    {description ? (
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-600">{description}</p>
    ) : null}
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
