/**
 * Enrutador minimo basado en hash.
 *
 * Se usa hash en lugar de History API porque GitHub Pages sirve archivos
 * estaticos: con hash, cualquier ruta interna funciona al recargar la pagina
 * sin necesidad de reglas de reescritura en el servidor.
 */

import { useCallback, useEffect, useState } from 'react';

export const ROUTES = {
  home: '/',
  auth: '/entrar',
  assessment: '/evaluacion',
  results: '/resultados',
  reports: '/informes',
  profile: '/perfil',
  privacy: '/privacidad',
} as const;

export type RouteName = keyof typeof ROUTES;

const toHash = (route: RouteName): string => `#${ROUTES[route]}`;

const parseHash = (): RouteName => {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const entry = (Object.entries(ROUTES) as [RouteName, string][]).find(([, path]) => path === hash);
  return entry ? entry[0] : 'home';
};

export const useRoute = () => {
  const [route, setRoute] = useState<RouteName>(() => parseHash());

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: RouteName) => {
    if (parseHash() === next) {
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = ROUTES[next];
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = ROUTES.home;
    }
  }, []);

  return { route, navigate, goBack };
};

export { toHash };

/**
 * Envoltorio de `useRoute` para los componentes que solo necesitan navegar.
 * Se mantiene separado para que los componentes de presentacion no dependan
 * del estado completo de la ruta.
 */
export const useNavigate = () => {
  const { navigate } = useRoute();
  return { navigate };
};
