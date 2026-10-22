import { useMemo, useState } from 'react';
import { useNavigate } from '../app/router';
import { useAssessment, resultFromStored } from '../app/AssessmentContext';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/Icon';
import { downloadBlob, generateHRReport, generatePersonalReport, safeFilename } from '../engine/pdf';
import { buildResult } from '../engine/result';
import { clearConsent, loadConsent, loadProfile, saveConsent, type StoredConsent } from '../storage/localStorage';

/** Versión del texto de consentimiento. Si cambia, hay que volver a consentir. */
export const CONSENT_VERSION = '1.0.0';

export const CONSENT_TEXT =
  'Autorizo la elaboración del informe profesional para RR. HH. a partir de mis respuestas a la ' +
  'evaluación de Talento Invisible. Entiendo que el informe se genera en mi dispositivo, que no ' +
  'se envía a ninguna empresa de forma automática y que yo decido si lo comparto y con quién.';

export const ReportsScreen = () => {
  const { navigate } = useNavigate();
  const { answers, completedAt, history } = useAssessment();
  const { isAuthenticated, mode } = useAuth();

  const [consent, setConsent] = useState<StoredConsent>(() => {
    const stored = loadConsent();
    // Un consentimiento aceptado con una versión anterior del texto no vale.
    return stored.granted && stored.version !== CONSENT_VERSION ? { granted: false } : stored;
  });
  const [profile] = useState(() => loadProfile());
  const [modalOpen, setModalOpen] = useState(false);
  const [authorise, setAuthorise] = useState(false);
  const [confirmIdentity, setConfirmIdentity] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(() =>
    // Si no hay evaluación actual, se usa la entrada más reciente del historial.
    answers.length > 0 ? null : history[0]?.id ?? null,
  );

  const result = useMemo(() => {
    if (selectedHistoryId) {
      const entry = history.find((item) => item.id === selectedHistoryId);
      if (entry) return resultFromStored(entry);
    }
    if (answers.length === 0) return null;
    return buildResult(answers, completedAt ?? new Date().toISOString());
  }, [answers, completedAt, history, selectedHistoryId]);

  const hasResult = answers.length > 0 || history.length > 0;
  // Control de acceso: con Firebase configurado exigimos una sesión identificada.
  const needsLogin = mode === 'firebase' && !isAuthenticated;

  const downloadPersonal = () => {
    if (!result) return;
    setBusy('personal');
    try {
      const blob = generatePersonalReport(result, { profile: profile ?? undefined });
      downloadBlob(blob, safeFilename('mi-mapa-de-talento', result.createdAt));
    } finally {
      setBusy(null);
    }
  };

  const downloadHR = () => {
    if (!result || !consent.granted || needsLogin) return;
    setBusy('hr');
    try {
      const blob = generateHRReport(result, {
        includeHR: true,
        profile: profile ?? undefined,
        consentText: `${CONSENT_TEXT} (Consentimiento registrado el ${new Date(
          consent.grantedAt ?? Date.now(),
        ).toLocaleString('es-ES')}, versión ${consent.version ?? CONSENT_VERSION}.)`,
      });
      downloadBlob(blob, safeFilename('informe-profesional-rrhh', result.createdAt));
    } finally {
      setBusy(null);
    }
  };

  const grantConsent = () => {
    const stored = saveConsent({
      granted: true,
      grantedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
    setConsent(stored);
    setAuthorise(false);
    setConfirmIdentity(false);
    setModalOpen(false);
  };

  const revokeConsent = () => {
    clearConsent();
    setConsent({ granted: false });
  };

  if (!hasResult) {
    return (
      <EmptyState
        icon="📄"
        title="No hay ningún informe que generar"
        description="Completa la evaluación para poder crear tu informe personal y el informe profesional para RR. HH."
        action={<Button onClick={() => navigate('assessment')}>Empezar la evaluación</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Informes</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Los dos documentos se generan en tu navegador, con jsPDF. No hay servidor, no hay base de
          datos y no se envía nada a ninguna empresa. Tú decides qué archivo descargas y a quién se
          lo compartes.
        </p>
      </header>

      {history.length > 0 ? (
        <Card>
          <label htmlFor="report-source" className="mb-2 block text-sm font-medium text-slate-700">
            Evaluación a usar en los informes
          </label>
          <select
            id="report-source"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            value={selectedHistoryId ?? 'current'}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedHistoryId(value === 'current' ? null : value);
            }}
          >
            {answers.length > 0 ? (
              <option value="current">
                Evaluación actual
                {completedAt
                  ? ` (${new Date(completedAt).toLocaleDateString('es-ES')})`
                  : ''}
              </option>
            ) : null}
            {history.map((entry) => (
              <option key={entry.id} value={entry.id}>
                Guardada del {new Date(entry.completedAt).toLocaleDateString('es-ES')} (
                {new Date(entry.completedAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                )
              </option>
            ))}
          </select>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="indigo">Informe personal</Badge>
              <Badge tone="emerald">Sin restricciones</Badge>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Mi mapa de talento</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Tu informe personal: resumen del índice, competencias con su nivel orientativo, las
              respuestas que respaldan cada resultado, recomendaciones y un plan de desarrollo de
              cuatro semanas.
            </p>
          </div>
          <Button onClick={downloadPersonal} disabled={busy !== null}>
            <Icon name="download" className="h-4 w-4" />
            {busy === 'personal' ? 'Generando...' : 'Descargar PDF'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="violet">Informe profesional</Badge>
              {needsLogin ? (
                <Badge tone="amber">Requiere sesión</Badge>
              ) : consent.granted ? (
                <Badge tone="emerald">Consentimiento activo</Badge>
              ) : (
                <Badge tone="amber">Requiere consentimiento</Badge>
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Informe para RR. HH.</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Versión con lenguaje profesional y neutral: resumen estructurado de competencias,
              niveles orientativos y evidencias asociadas. Incluye un apartado con las
              limitaciones del informe.
            </p>
            {consent.granted ? (
              <p className="mt-3 text-xs text-slate-500">
                Consentimiento registrado el{' '}
                {new Date(consent.grantedAt ?? Date.now()).toLocaleString('es-ES')} (versión{' '}
                {consent.version ?? CONSENT_VERSION}).
              </p>
            ) : null}
          </div>
          {needsLogin ? (
            <div className="flex max-w-xs flex-col gap-2">
              <Button onClick={() => navigate('auth')}>
                <Icon name="lock" className="h-4 w-4" />
                Inicia sesión para desbloquear
              </Button>
              <p className="text-xs leading-relaxed text-slate-500">
                El informe profesional exige una sesión identificada y tu consentimiento explícito.
              </p>
            </div>
          ) : consent.granted ? (
            <div className="flex flex-col gap-2">
              <Button onClick={downloadHR} disabled={busy !== null}>
                <Icon name="download" className="h-4 w-4" />
                {busy === 'hr' ? 'Generando...' : 'Descargar PDF'}
              </Button>
              <Button variant="ghost" size="sm" onClick={revokeConsent}>
                Retirar consentimiento
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              <Icon name="lock" className="h-4 w-4" />
              Autorizar y desbloquear
            </Button>
          )}
        </div>
      </Card>

      <Alert tone="warning" title="Sobre la protección de este informe">
        El consentimiento y la confirmación de identidad son controles de acceso de la interfaz, no
        una barrera de seguridad real: en cuanto el informe existe en tu dispositivo puede
        ejecutarse cualquier software que tengas instalado. Lo que sí garantiza esta aplicación es
        que <strong>no se envía nada de forma automática</strong> y que el archivo solo se genera si
        lo pides expresamente. En esta versión no existe un panel de empresa ni un sistema de envío
        seguro porque no hay base de datos remota que lo permita.
      </Alert>

      {mode === 'local' ? (
        <Alert tone="info" title="Sesión no identificada">
          En este entorno no hay Firebase Authentication configurado, así que la autorización se
          apoya únicamente en la confirmación explícita de la persona participante. Al conectar
          Firebase, la sesión pasa a aportar una identificación verificable.
        </Alert>
      ) : isAuthenticated ? (
        <Alert tone="success" title="Sesión identificada">
          Has iniciado sesión en este dispositivo. La autorización para el informe profesional
          combina la confirmación explícita con la identidad de la sesión.
        </Alert>
      ) : (
        <Alert tone="warning" title="Sesión no identificada">
          Para desbloquear el informe profesional necesitas iniciar sesión con Firebase
          Authentication. La evaluación y el informe personal siguen funcionando sin cuenta: la
          identificación solo protege el documento que está pensado para compartir con una empresa.
        </Alert>
      )}

      <Card>
        <CardTitle subtitle="Documentos cortos que explican qué hace y qué no hace esta aplicación.">
          Documentación
        </CardTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => navigate('privacy')}>
            <Icon name="shield" className="h-4 w-4" />
            Privacidad y datos
          </Button>
          <Button variant="secondary" onClick={() => navigate('profile')}>
            <Icon name="user" className="h-4 w-4" />
            Perfil y almacenamiento
          </Button>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Autorizar el informe profesional"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={grantConsent} disabled={!authorise || !confirmIdentity}>
              Autorizar y desbloquear
            </Button>
          </>
        }
      >
        <p className="leading-relaxed">{CONSENT_TEXT}</p>

        <div className="mt-5 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              checked={authorise}
              onChange={(event) => setAuthorise(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-indigo-600"
            />
            <span className="text-slate-700">
              Autorizo la elaboración del informe profesional para RR. HH. con mis resultados.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm">
            <input
              type="checkbox"
              checked={confirmIdentity}
              onChange={(event) => setConfirmIdentity(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-indigo-600"
            />
            <span className="text-slate-700">
              Confirmo que soy la persona que ha realizado esta evaluación y que la comparto yo de
              forma voluntaria.
            </span>
          </label>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Puedes retirar el consentimiento en cualquier momento desde esta misma pantalla. El
          registro se guarda solo en este dispositivo.
        </p>
      </Modal>
    </div>
  );
};
