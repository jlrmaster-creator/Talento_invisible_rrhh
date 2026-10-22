/** Iconos SVG inline. Sin dependencias externas ni fuentes de iconos. */

export type IconName =
  | 'home'
  | 'clipboard'
  | 'chart'
  | 'user'
  | 'file'
  | 'shield'
  | 'download'
  | 'trash'
  | 'check'
  | 'arrowRight'
  | 'arrowLeft'
  | 'lock'
  | 'sparkles'
  | 'info'
  | 'plus'
  | 'logout';

const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5.25 9.75V20a1 1 0 0 0 1 1h3.5v-5.5h4.5V21h3.5a1 1 0 0 0 1-1V9.75',
  clipboard:
    'M9 4.5h6M8 3h8a1 1 0 0 1 1 1v1H7V4a1 1 0 0 1 1-1ZM7 5H5.5A1.5 1.5 0 0 0 4 6.5v13A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 5H17M8.5 11h7M8.5 15h4.5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5a7.5 7.5 0 0 1 15 0',
  file: 'M14 3v5h5M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-4-5ZM9 13h6M9 17h4',
  shield: 'M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Zm-2.5 9 2 2 4-4',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10ZM10 11v6M14 11v6',
  check: 'M4.5 12.5 9 17l10.5-10.5',
  arrowRight: 'M5 12h14m0 0-6-6m6 6-6 6',
  arrowLeft: 'M19 12H5m0 0 6-6m-6 6 6 6',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2M5.5 10h13A1.5 1.5 0 0 1 20 11.5v7A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-7A1.5 1.5 0 0 1 5.5 10Z',
  sparkles: 'M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9 12 3.5ZM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9.5V16M12 7.8v.4',
  plus: 'M12 5v14M5 12h14',
  logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h9',
};

export const Icon = ({
  name,
  className = 'h-5 w-5',
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={PATHS[name]} />
  </svg>
);
