import { useNavigate } from '../app/router';
import { Button } from '../components/ui/Button';
import { Card, CardTitle } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Icon } from '../components/ui/Icon';

const SECTIONS = [
  {
    title: 'Qué guardamos',
    icon: 'shield' as const,
    body: [
      'En este dispositivo: tus respuestas a la evaluación, el resultado calculado, un historial de hasta 10 evaluaciones, el perfil profesional opcional y el registro de consentimiento para el informe de RR. HH.',
      'En Firebase: únicamente tu cuenta (correo electrónico, identificador de usuario y, si lo indicas, tu nombre). Firebase Authentication guarda esos datos en su propia infraestructura; no hay base de datos de evaluaciones.',
    ],
  },
  {
    title: 'Qué NO guardamos',
    icon: 'lock' as const,
    body: [
      'No hay analítica, ni seguimiento, ni publicidad, ni perfiles públicos.',
      'No se envían tus respuestas, ni tus resultados, ni tus informes a ningún servidor. Los PDF se generan en tu navegador con jsPDF y se descargan directamente en tu equipo.',
      'No se comparte nada con empresas de forma automática.',
    ],
  },
  {
    title: 'Minimización de datos',
    icon: 'info' as const,
    body: [
      'Solo pedimos información profesional que tú decides rellenar, y ninguna es obligatoria.',
      'La evaluación se puede usar sin identificarse: si no quieres crear una cuenta, puedes hacerla igual.',
      'No se solicitan datos sensibles ni se realizan inferencias sobre características personales.',
    ],
  },
  {
    title: 'Tus derechos',
    icon: 'user' as const,
    body: [
      'Puedes consultar, exportar (descargar los PDF) y eliminar todos tus datos en cualquier momento desde la pantalla de Perfil.',
      'La eliminación borra el contenido de este dispositivo. Para eliminar tu cuenta de Firebase, puedes hacerlo desde la propia aplicación o desde la consola de Firebase.',
      'La base legal del tratamiento es tu consentimiento, y la puedes retirar cuando quieras.',
    ],
  },
];

export const PrivacyScreen = () => {
  const { navigate } = useNavigate();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Privacidad y datos</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Explicación clara de qué hace esta aplicación con tus datos, escrita sin letra pequeña.
        </p>
      </header>

      <Alert tone="info" title="Resumen en una frase">
        Tus respuestas y tus resultados nunca salen de tu dispositivo. Lo único que viaja a internet
        es tu inicio de sesión en Firebase Authentication.
      </Alert>

      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon name={section.icon} className="h-5 w-5" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
          </div>
          <ul className="space-y-2.5">
            {section.body.map((paragraph) => (
              <li key={paragraph} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                {paragraph}
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <Card>
        <CardTitle subtitle="Cosas que esta versión no puede hacer.">
          Limitaciones conocidas
        </CardTitle>
        <ul className="space-y-2.5">
          {[
            'Los datos son locales a un dispositivo y a un navegador. Si borras los datos del navegador, pierdes la evaluación, y si cambias de dispositivo no se sincroniza.',
            'No existe un panel para empresas: no hay forma segura de que RR. HH. consulte evaluaciones de otras personas, porque no hay base de datos remota con control de acceso.',
            'Los resultados son orientativos. No miden rendimiento real en un puesto y no sustituyen una prueba práctica ni una entrevista.',
            'El consentimiento del informe profesional es un control de la interfaz, no una protección criptográfica. Una vez generado, el PDF puede compartirse con quien tú decidas.',
            'Sin conexión, la aplicación sigue funcionando en la evaluación, el cálculo y la generación de PDF; la autenticación sí necesita conexión.',
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle subtitle="Tecnologías usadas.">Stack y decisiones</CardTitle>
        <ul className="space-y-2.5">
          {[
            'React, TypeScript y Vite para la aplicación web instalable (PWA).',
            'Tailwind CSS para el diseño, sin dependencias de interfaz adicionales.',
            'Firebase Authentication, y ningún otro producto de Firebase.',
            'jsPDF y jsPDF-AutoTable para generar los informes en el navegador.',
            'localStorage para guardar los datos en el dispositivo, con opción de borrado completo.',
            'Sin IA, sin backend propio, sin base de datos remota, sin analítica.',
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate('profile')}>Ir a mis datos</Button>
        <Button variant="secondary" onClick={() => navigate('home')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};
