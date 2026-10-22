import { useEffect, useState } from 'react';
import { useNavigate } from '../app/router';
import { useAssessment } from '../app/AssessmentContext';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Field, TextInput } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';
import { DEMO_PROFILE } from '../config/demo';
import {
  clearAllData,
  estimateStorageBytes,
  formatBytes,
  loadProfile,
  saveProfile,
  type StoredProfile,
} from '../storage/localStorage';

const SECTORS = [
  'Salud y cuidados',
  'Educación',
  'Hostelería y turismo',
  'Comercio y retail',
  'Logística y transporte',
  'Administración y oficinas',
  'Construcción e industria',
  'Servicios digitales',
  'Agricultura y medio ambiente',
  'Artes y comunicación',
  'Otros',
];

export const ProfileScreen = () => {
  const { navigate } = useNavigate();
  const { user, isAuthenticated, signOut, mode } = useAuth();
  const {
    history,
    deleteFromHistory,
    clearAllHistory,
    deleteCurrent,
    restoreFrom,
    answers,
    loadDemo,
  } = useAssessment();

  const [profile, setProfile] = useState<StoredProfile | null>(() => loadProfile());
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [headline, setHeadline] = useState(profile?.headline ?? '');
  const [sector, setSector] = useState(profile?.sector ?? '');
  const [yearsExperience, setYearsExperience] = useState(
    profile?.yearsExperience !== undefined ? String(profile.yearsExperience) : '',
  );
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bytes, setBytes] = useState(0);

  useEffect(() => {
    setBytes(estimateStorageBytes());
  }, [history, profile]);

  const handleSave = () => {
    const years = yearsExperience.trim() === '' ? undefined : Number(yearsExperience);
    const stored = saveProfile({
      displayName: displayName.trim() || undefined,
      headline: headline.trim() || undefined,
      sector: sector || undefined,
      yearsExperience: years !== undefined && Number.isFinite(years) ? years : undefined,
    });
    setProfile(stored);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('home');
    } catch {
      // El error se muestra en el contexto de autenticacion.
    }
  };

  const handleDeleteAll = () => {
    clearAllData();
    setProfile(null);
    setDisplayName('');
    setHeadline('');
    setSector('');
    setYearsExperience('');
    clearAllHistory();
    deleteCurrent();
    setBytes(0);
    setConfirmDelete(false);
    navigate('home');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Perfil y datos</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Todo lo que escribas aquí se guarda únicamente en este dispositivo. La información
          profesional es opcional y se usa solo para dar contexto a los informes PDF.
        </p>
      </header>

      <Card>
        <CardTitle subtitle="La identificación la gestiona Firebase Authentication.">
          Sesión
        </CardTitle>
        {isAuthenticated ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user?.displayName || 'Cuenta sin nombre'}
              </p>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
            <Button variant="secondary" onClick={handleSignOut}>
              <Icon name="logout" className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-amber-50 p-4">
            <div>
              <p className="text-sm font-medium text-amber-900">No has iniciado sesión</p>
              <p className="text-sm text-amber-800">
                {mode === 'local'
                  ? 'Firebase no está configurado en este entorno.'
                  : 'Puedes usar la aplicación sin identificarse.'}
              </p>
            </div>
            <Button onClick={() => navigate('auth')}>Entrar o registrarme</Button>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle subtitle="Todos los campos son opcionales.">
          Información profesional
        </CardTitle>
        <div className="space-y-4">
          <Field label="Nombre" htmlFor="profile-name">
            <TextInput
              id="profile-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Como quieres aparecer en el informe"
              maxLength={80}
            />
          </Field>

          <Field
            label="Titular o descripción en una línea"
            htmlFor="profile-headline"
            hint={'Por ejemplo: "Cuidado de personas mayores y gestión de turnos".'}
          >
            <TextInput
              id="profile-headline"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Tu perfil en una línea"
              maxLength={120}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Área o sector" htmlFor="profile-sector">
              <select
                id="profile-sector"
                value={sector}
                onChange={(event) => setSector(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Sin especificar</option>
                {SECTORS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Años de experiencia"
              htmlFor="profile-years"
              hint="Incluye la experiencia no remunerada que tú consideres relevante."
            >
              <TextInput
                id="profile-years"
                type="number"
                min={0}
                max={70}
                value={yearsExperience}
                onChange={(event) => setYearsExperience(event.target.value)}
                placeholder="Ej. 7"
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Guardar</Button>
            {saved ? (
              <span className="text-sm font-medium text-emerald-700">Guardado en este dispositivo</span>
            ) : null}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs leading-relaxed text-slate-500">
              ¿Quieres probar la aplicación con datos de demostración? Se cargará el perfil ficticio
              de Marta y su evaluación, y podrás borrarlo después.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => {
                loadDemo();
                setProfile(loadProfile());
                setDisplayName(DEMO_PROFILE.displayName);
                setHeadline(DEMO_PROFILE.headline);
                setSector(DEMO_PROFILE.sector);
                setYearsExperience(String(DEMO_PROFILE.yearsExperience));
                navigate('results');
              }}
            >
              Cargar perfil de demostración
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle
          subtitle="Las evaluaciones guardadas en este dispositivo. Puedes abrir una para ver sus resultados o eliminarla."
        >
          Evaluaciones guardadas
        </CardTitle>
        {history.length === 0 ? (
          <p className="text-sm text-slate-600">Todavía no has guardado ninguna evaluación.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(entry.completedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}{' '}
                    · {new Date(entry.completedAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {entry.answers.length} respuestas · cuestionario v{entry.questionnaireVersion}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      restoreFrom(entry);
                      navigate('results');
                    }}
                  >
                    Abrir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFromHistory(entry.id)}
                    aria-label="Eliminar evaluación"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {history.length > 1 ? (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={clearAllHistory}>
              Borrar todo el historial
            </Button>
          </div>
        ) : null}
      </Card>

      <Card className="border-rose-200">
        <CardTitle subtitle="Puedes borrar en cualquier momento todos los datos guardados en este dispositivo.">
          Privacidad y borrado
        </CardTitle>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Datos almacenados actualmente en este navegador: aproximadamente{' '}
          <strong className="text-slate-800">{formatBytes(bytes)}</strong>. Incluye tu perfil, tus
          respuestas, el historial de evaluaciones y el registro de consentimiento.
          {answers.length > 0 ? ' La evaluación en curso también se guarda aquí.' : ''}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate('privacy')}>
            <Icon name="shield" className="h-4 w-4" />
            Ver la política de privacidad
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Icon name="trash" className="h-4 w-4" />
            Borrar todos mis datos
          </Button>
        </div>
      </Card>

      {mode === 'local' ? (
        <Alert tone="info" title="Modo local">
          Sin Firebase Authentication configurado, tu cuenta no existe: no hay nada que borrar en
          la nube. Todo está en este dispositivo.
        </Alert>
      ) : null}

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Borrar todos mis datos"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteAll}>
              Sí, borrar todo
            </Button>
          </>
        }
      >
        <p>
          Se eliminarán de este dispositivo tu perfil, tus respuestas, el historial de evaluaciones y
          el registro de consentimiento. Esta acción no se puede deshacer.
        </p>
        <p className="mt-3">
          Tu cuenta de Firebase no se eliminará: eso se hace desde la consola de Firebase o
          eliminándote desde la propia pantalla de acceso.
        </p>
      </Modal>
    </div>
  );
};
