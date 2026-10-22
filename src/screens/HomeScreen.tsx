import { useNavigate } from '../app/router';
import { useAssessment } from '../app/AssessmentContext';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { TOTAL_QUESTIONS } from '../config/questions';

export const HomeScreen = () => {
  const { navigate } = useNavigate();
  const { answers, hasCompleted, loadDemo } = useAssessment();
  const { isAuthenticated, user, mode } = useAuth();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-6 py-10 text-white shadow-lg shadow-indigo-600/20 sm:px-10 sm:py-14">
        <Badge className="bg-white/15 text-white ring-white/25">Sin IA · Sin base de datos · 100% local</Badge>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          El talento que no aparece en tu currículum
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-50/90">
          Una evaluación breve y neutra que describe cómo resuelves, te organizas y te comunicas.
          Sin experiencia previa en un puesto concreto, sin etiquetas, sin filtros.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-white text-indigo-700 hover:bg-indigo-50 focus-visible:outline-white"
            onClick={() => navigate('assessment')}
          >
            {answers.length > 0 ? 'Continuar evaluación' : 'Empezar evaluación'}
            <Icon name="arrowRight" className="h-5 w-5" />
          </Button>
          {hasCompleted ? (
            <Button
              size="lg"
              variant="secondary"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={() => navigate('results')}
            >
              Ver mi mapa de talento
            </Button>
          ) : null}
        </div>
        <p className="mt-6 text-xs text-indigo-100/80">
          {TOTAL_QUESTIONS} preguntas · unos 5 minutos · resultados reproducibles
        </p>
      </section>

      {mode === 'local' ? (
        <Alert tone="warning" title="Modo local: Firebase no está configurado">
          La aplicación funciona por completo, pero sin registro ni inicio de sesión. Añade las
          variables <code className="rounded bg-amber-100 px-1">VITE_FIREBASE_*</code> al archivo{' '}
          <code className="rounded bg-amber-100 px-1">.env.local</code> para activarlo.
        </Alert>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: 'clipboard' as const,
            title: 'Responde desde tu experiencia real',
            body: 'Preguntas sobre situaciones concretas, incluidas las que ocurren fuera del trabajo remunerado.',
          },
          {
            icon: 'chart' as const,
            title: 'Recibe un mapa, no una etiqueta',
            body: 'Diez competencias con nivel orientativo, evidencia concreta y areas de mejora.',
          },
          {
            icon: 'file' as const,
            title: 'Descarga tus informes',
            body: 'Un informe personal y otro profesional para RR. HH., generados en tu navegador.',
          },
        ].map((item) => (
          <Card key={item.title} className="flex flex-col gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon name={item.icon} />
            </span>
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{item.body}</p>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Cómo funciona</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Registrate',
              body: 'Con correo y contraseña o con Google. Solo se usa Firebase Authentication.',
            },
            {
              step: '02',
              title: 'Responde',
              body: 'El cuestionario se puede dejar y retomar. Se guarda únicamente en tu dispositivo.',
            },
            {
              step: '03',
              title: 'Revisa y decide',
              body: 'Ves tu mapa de talento y decides si descargas o compartes los informes.',
            },
          ].map((item) => (
            <li key={item.step} className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs font-bold tracking-widest text-indigo-500">{item.step}</span>
              <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {!isAuthenticated ? (
        <Card className="flex flex-col items-start justify-between gap-4 bg-slate-50 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Crea tu cuenta</h2>
            <p className="mt-1 text-sm text-slate-600">
              Identificarte no cambia dónde se guardan tus resultados: siguen en este dispositivo.
            </p>
          </div>
          <Button onClick={() => navigate('auth')}>
            {user ? 'Ver mi sesion' : 'Entrar o registrarme'}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </Card>
      ) : null}

      <Card className="border-dashed border-indigo-300 bg-indigo-50/40">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="text-base font-semibold text-slate-900">¿Quieres verlo con un ejemplo?</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Cargamos la evaluación de <strong>Marta</strong>, un perfil ficticio con datos de
              demostración. Todo queda en este dispositivo y puedes borrarlo cuando quieras.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                loadDemo();
                navigate('results');
              }}
            >
              Ver ejemplo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                loadDemo();
                navigate('assessment');
              }}
            >
              Ver sus respuestas
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
