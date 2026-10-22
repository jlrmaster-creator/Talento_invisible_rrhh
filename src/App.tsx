import { Suspense, lazy, useEffect } from 'react';
import { useRoute } from './app/router';
import { AuthProvider } from './auth/AuthContext';
import { AssessmentProvider } from './app/AssessmentContext';
import { NavBar } from './components/layout/NavBar';
import { HomeScreen } from './screens/HomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Los informes cargan jsPDF (~400 KB): se descargan solo cuando se necesitan.
const ReportsScreen = lazy(() =>
  import('./screens/ReportsScreen').then((module) => ({ default: module.ReportsScreen })),
);

const SCREENS = {
  home: HomeScreen,
  auth: AuthScreen,
  assessment: AssessmentScreen,
  results: ResultsScreen,
  reports: ReportsScreen,
  profile: ProfileScreen,
  privacy: PrivacyScreen,
} as const;

const ScreenFallback = () => (
  <div className="flex min-h-64 items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-slate-500">Cargando…</p>
    </div>
  </div>
);

const App = () => {
  const { route, navigate } = useRoute();
  const Screen = SCREENS[route];

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = 'Talento Invisible — Mapa de talento';
  }, [route]);

  return (
    <AuthProvider>
      <AssessmentProvider>
        <div className="min-h-dvh bg-slate-50 text-slate-900">
          <div className="mx-auto flex max-w-6xl">
            <NavBar current={route} onNavigate={navigate} />
            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">
              <div className="mx-auto w-full max-w-3xl">
                <Suspense fallback={<ScreenFallback />}>
                  <Screen />
                </Suspense>
              </div>
            </main>
          </div>
          <footer className="hidden border-t border-slate-200 bg-white py-6 lg:block">
            <div className="mx-auto max-w-6xl px-8 text-xs text-slate-400">
              Talento Invisible · MVP sin IA · Los datos se guardan en tu dispositivo ·{' '}
              <button
                type="button"
                onClick={() => navigate('privacy')}
                className="underline hover:text-slate-600"
              >
                Privacidad
              </button>
            </div>
          </footer>
        </div>
      </AssessmentProvider>
    </AuthProvider>
  );
};

export default App;
