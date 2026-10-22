import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

const fieldClasses =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50';

export const Field = ({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
    {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
  </div>
);

export const TextInput = ({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${fieldClasses} ${className}`} {...rest} />
);

export const TextArea = ({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`${fieldClasses} min-h-24 resize-y ${className}`} {...rest} />
);

export const Select = ({
  className = '',
  children,
  ...rest
}: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) => (
  <select className={`${fieldClasses} ${className}`} {...rest}>
    {children}
  </select>
);
