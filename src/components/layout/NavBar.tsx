import { ROUTES, type RouteName } from '../../app/router';
import { Icon, type IconName } from '../ui/Icon';

interface NavItem {
  route: RouteName;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'home', label: 'Inicio', icon: 'home' },
  { route: 'assessment', label: 'Evaluación', icon: 'clipboard' },
  { route: 'results', label: 'Resultados', icon: 'chart' },
  { route: 'reports', label: 'Informes', icon: 'file' },
  { route: 'profile', label: 'Perfil', icon: 'user' },
];

export const NavBar = ({
  current,
  onNavigate,
}: {
  current: RouteName;
  onNavigate: (route: RouteName) => void;
}) => (
  <>
    {/* Navegacion lateral en pantallas grandes */}
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white/70 px-4 py-6 lg:block">
      <div className="mb-8 px-2">
        <p className="text-lg font-bold tracking-tight text-slate-900">Talento Invisible</p>
        <p className="text-xs text-slate-500">Descubre lo que tu CV no cuenta</p>
      </div>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = current === item.route;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
        <p className="mb-1 font-semibold text-slate-600">Privacidad</p>
        Los resultados se guardan solo en este dispositivo.
      </div>
    </aside>

    {/* Barra inferior en movil */}
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active = current === item.route;
          return (
            <li key={item.route} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? 'text-indigo-700' : 'text-slate-500'
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </>
);

export { ROUTES };
