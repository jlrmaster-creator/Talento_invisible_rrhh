/** Barra de progreso con etiqueta opcional. */
export const ProgressBar = ({
  value,
  max = 100,
  label,
  color = '#4F46E5',
  trackClassName = 'bg-slate-200',
}: {
  value: number;
  max?: number;
  label?: string;
  color?: string;
  trackClassName?: string;
}) => {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>{label}</span>
          <span className="tabular-nums text-slate-500">{Math.round(ratio * 100)}%</span>
        </div>
      ) : null}
      <div
        className={`h-2 w-full overflow-hidden rounded-full ${trackClassName}`}
        role="progressbar"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progreso'}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${ratio * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
