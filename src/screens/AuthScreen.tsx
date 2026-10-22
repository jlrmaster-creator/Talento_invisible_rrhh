import { useState, type FormEvent } from 'react';
import { useNavigate } from '../app/router';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Field, TextInput } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { loadProfile } from '../storage/localStorage';

type Mode = 'signin' | 'signup';

export const AuthScreen = () => {
  const { navigate } = useNavigate();
  const { signIn, signUp, signInWithGoogle, error, clearError, mode: authMode, isAuthenticated, user } =
    useAuth();

  const [tab, setTab] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [profile] = useState(() => loadProfile());

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Card>
          <CardTitle subtitle="Tu sesión esta activa">Sesión iniciada</CardTitle>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              {profile?.displayName || user?.displayName || displayName || 'Cuenta sin nombre'}
            </p>
            <p className="text-sm text-slate-600">{user?.email}</p>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => navigate('assessment')}>Ir a la evaluación</Button>
            <Button variant="secondary" onClick={() => navigate('profile')}>
              Ver mi perfil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearError();
    setBusy(true);
    try {
      if (tab === 'signup') {
        await signUp(email.trim(), password, displayName.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      navigate('assessment');
    } catch {
      // El error ya se muestra desde el contexto.
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    clearError();
    setBusy(true);
    try {
      await signInWithGoogle();
      navigate('assessment');
    } catch {
      // El error ya se muestra desde el contexto.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {tab === 'signup' ? 'Crea tu cuenta' : 'Entra en tu cuenta'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Usamos Firebase Authentication y nada más: no hay base de datos, ni perfiles públicos, ni
          uso de tus datos con fines comerciales.
        </p>
      </div>

      {authMode === 'local' ? (
        <Alert tone="warning" title="Identidad no disponible en este entorno">
          Este despliegue no tiene configurado Firebase Authentication, así que el registro no
          funcionará. La evaluación y los informes siguen siendo utilizables sin identificarse.
        </Alert>
      ) : null}

      {error ? <Alert tone="error">{error}</Alert> : null}

      <Card>
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(
            [
              ['signup', 'Crear cuenta'],
              ['signin', 'Ya tengo cuenta'],
            ] as [Mode, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTab(value);
                clearError();
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === value ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {tab === 'signup' ? (
            <Field label="Nombre (opcional)" htmlFor="displayName" hint="Solo se usa dentro de la aplicación.">
              <TextInput
                id="displayName"
                name="name"
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Cómo quieres que te llamen"
              />
            </Field>
          ) : null}

          <Field label="Correo electrónico" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@ejemplo.com"
            />
          </Field>

          <Field
            label="Contraseña"
            htmlFor="password"
            hint={tab === 'signup' ? 'Mínimo 6 caracteres.' : undefined}
          >
            <TextInput
              id="password"
              type="password"
              name="password"
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={tab === 'signup' ? 6 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <Button type="submit" fullWidth size="lg" disabled={busy || authMode === 'local'}>
            {busy ? 'Un momento...' : tab === 'signup' ? 'Crear cuenta' : 'Entrar'}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          o
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Button
          variant="secondary"
          fullWidth
          size="lg"
          onClick={handleGoogle}
          disabled={busy || authMode === 'local'}
        >
          <Icon name="sparkles" className="h-4 w-4" />
          Continuar con Google
        </Button>

        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Al identificarte aceptas que se guarde tu correo en Firebase Authentication. Tus
          respuestas a la evaluación no salen de este dispositivo.
        </p>
      </Card>
    </div>
  );
};
