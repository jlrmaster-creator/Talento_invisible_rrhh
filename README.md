# Talento Invisible

**Descubre, evalúa y visualiza las competencias profesionales que no aparecen en un currículum.**

Talento Invisible es una PWA (aplicación web instalable) que plantea una evaluación breve de
situaciones reales y construye un **mapa de talento** con diez competencias, evidencias concretas y
un plan de desarrollo personal. No analiza el CV: explora cómo resuelves, organizas, comunicas y
colaboras, incluyendo la experiencia que se adquiere fuera de un empleo formal.

- Sin inteligencia artificial: la puntuación es **determinista, reproducible y explicable**.
- Sin backend propio ni base de datos remota: todo se calcula y se guarda **en el dispositivo**.
- Sin analítica, sin publicidad y sin perfiles públicos.
- Firebase se usa **solo** para Authentication.

---

## Índice

1. [Stack](#stack)
2. [Puesta en marcha](#puesta-en-marcha)
3. [Configurar Firebase Authentication](#configurar-firebase-authentication)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Motor de evaluación](#motor-de-evaluación)
6. [Cómo modificar preguntas, pesos y criterios](#cómo-modificar-preguntas-pesos-y-criterios)
7. [Informes PDF](#informes-pdf)
8. [Privacidad y seguridad](#privacidad-y-seguridad)
9. [Pruebas](#pruebas)
10. [Despliegue en GitHub Pages](#despliegue-en-github-pages)
11. [Datos de demostración](#datos-de-demostración)
12. [Limitaciones conocidas](#limitaciones-conocidas)

---

## Stack

| Pieza | Tecnología |
| --- | --- |
| Frontend | React 18 + TypeScript + Vite 6 |
| Estilos | Tailwind CSS 3 |
| PWA | `vite-plugin-pwa` (Workbox) |
| Autenticación | Firebase Authentication (solo `firebase/app` y `firebase/auth`) |
| Persistencia | `localStorage` con borrado completo desde la interfaz |
| PDF | jsPDF + jsPDF-AutoTable |
| Pruebas | Vitest + jsdom |
| Despliegue | GitHub Pages + GitHub Actions |

**Requisitos:** Node.js 20 o superior y npm 10 o superior.

### Qué NO se usa

Firestore, Realtime Database, Storage, Cloud Functions, Firebase Hosting, Analytics, Remote Config,
cualquier otro producto de Firebase, cualquier API de IA y cualquier backend propio.

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar la configuración de ejemplo
cp .env.example .env.local     # en Windows: copy .env.example .env.local

# 3. Rellenar .env.local con tu configuración pública de Firebase (ver más abajo)

# 4. Arrancar en desarrollo
npm run dev
```

La aplicación estará en `http://localhost:5173`.

> **Sin Firebase también funciona.** Si las variables `VITE_FIREBASE_*` están vacías, la aplicación
> arranca en *modo local*: la evaluación, el mapa de talento y los PDF funcionan, y la pantalla de
> acceso muestra un aviso claro de que el registro no está disponible. No se simula ninguna
> protección que no exista.

### Scripts disponibles

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprobación de tipos + compilación de producción en `dist/` |
| `npm run preview` | Sirve `dist/` para probar la compilación |
| `npm run typecheck` | Solo comprobación de tipos (`tsc -b`) |
| `npm run test` | Ejecuta la batería de pruebas una vez |
| `npm run test:watch` | Pruebas en modo vigilancia |
| `npm run icons` | Regenera los iconos PNG de la PWA |

---

## Configurar Firebase Authentication

### 1. Crear el proyecto y la app web

1. Entra en la [consola de Firebase](https://console.firebase.google.com/) y crea un proyecto.
2. En **Project settings → Your apps**, añade una aplicación web.
3. Copia los valores de `firebaseConfig`.

### 2. Rellenar `.env.local`

```dotenv
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxx
```

> Estos datos son **públicos por diseño**. La clave de API de Firebase identifica el proyecto, no
> autoriza operaciones. Nunca pongas en el frontend claves privadas, credenciales de servicio ni
> secretos. `.env.local` está en `.gitignore` y **no se sube al repositorio**.

### 3. Activar los proveedores de acceso

En **Authentication → Sign-in method**:

- Activa **Correo electrónico/Contraseña** (obligatorio para el registro e inicio de sesión con
  email).
- Activa **Google** si quieres el botón «Continuar con Google» (opcional; el botón devuelve un error
  explicativo si no está activado).

### 4. Autorizar los dominios

En **Authentication → Settings → Authorized domains**, añade:

- `localhost` (ya viene por defecto, para desarrollo).
- `TU_USUARIO.github.io` para el despliegue en GitHub Pages.
- Tu dominio propio, si lo usas.

Sin este paso, el acceso con Google y el restablecimiento de contraseña fallarán desde la URL
pública.

### 5. Sobre las Security Rules

Esta versión **no incluye ningún recurso de Firebase que las necesite**: no hay Firestore, ni
Storage, ni Realtime Database. Por eso no hay reglas que subir.

Si en el futuro se añade un servicio de almacenamiento para compartir informes con empresas, habrá
que escribir Security Rules y **subirlas manualmente** desde la consola. Este repositorio no ejecuta
ningún comando de Firebase CLI ni despliega reglas de forma automática.

> Importante: las Security Rules **no protegen** `localStorage`. Protegen los recursos de Firebase.
> Los datos locales dependen de la seguridad del dispositivo y del navegador.

---

## Estructura del proyecto

```
Talento_invisible/
├── .github/workflows/deploy.yml   # Compilación y publicación en GitHub Pages
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── icons/                     # Iconos PWA (generados con npm run icons)
├── scripts/generate-icons.mjs     # Generador de PNG sin dependencias
├── src/
│   ├── app/
│   │   ├── router.ts              # Enrutador por hash (compatible con Pages)
│   │   └── AssessmentContext.tsx  # Estado de la evaluación e historial
│   ├── auth/
│   │   ├── firebase.ts            # Inicialización de Firebase Auth
│   │   └── AuthContext.tsx        # Estado de sesión y errores traducidos
│   ├── components/
│   │   ├── layout/NavBar.tsx
│   │   ├── results/CompetencyCard.tsx
│   │   └── ui/                    # Button, Card, Badge, Alert, Modal, etc.
│   ├── config/
│   │   ├── competencies.ts        # Catálogo de las 10 competencias
│   │   ├── questions.ts           # Banco de 15 preguntas y pesos
│   │   ├── scoring.ts             # Umbrales, niveles y parámetros de cálculo
│   │   ├── recommendations.ts     # Catálogo estático de recomendaciones
│   │   ├── plan.ts                # Plantillas del plan de 4 semanas
│   │   └── demo.ts                # Perfil ficticio de demostración
│   ├── engine/
│   │   ├── scoring.ts             # Motor determinista de puntuación
│   │   ├── talentMap.ts           # Fortalezas / complementarias / desarrollo
│   │   ├── result.ts              # Reconstrucción de un resultado completo
│   │   ├── pdf.ts                 # Informes personales y profesionales
│   │   └── types.ts               # Tipos del dominio
│   ├── screens/                   # Una pantalla por archivo
│   ├── storage/localStorage.ts    # Persistencia y borrado
│   ├── styles/index.css
│   ├── test/                      # Configuración y fixtures de pruebas
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── vite.config.ts                 # Incluye manifest y service worker de la PWA
├── vitest.config.ts
└── .env.example
```

La separación sigue el criterio del prompt: interfaz, pantallas, configuración de competencias,
motor de puntuación, autenticación, persistencia local, generación de PDF y estilos.

---

## Motor de evaluación

### Cómo se calcula la puntuación

Cada respuesta declara qué competencias evidencia y con qué peso:

- **Preguntas de escala (1–5)**: el peso se aplica proporcionalmente al valor elegido.
  `valor normalizado = (respuesta − mínimo) / (máximo − mínimo)`.
- **Preguntas de elección**: cada opción lleva sus propios pesos por competencia.

Para cada competencia se calcula:

```
puntos      = Σ (peso × valor_normalizado × importancia_pregunta)
maxPuntos   = Σ (peso × 1 × importancia_pregunta)
ratio       = puntos / maxPuntos
shrinkage   = (puntos + 0,75 × 0,55) / (maxPuntos + 0,75)
puntuación  = redondeo(shrinkage × 100)      // 0..100
```

La **contracción** (`shrinkage`) evita que una competencia explorada por una sola pregunta obtenga
un resultado extremo: cuanto menor es `maxPuntos`, más se acerca el resultado a 55.

- **Índice de talento visible**: media ponderada de las diez competencias
  (`competencyWeights`, todas a 1 por defecto).
- **Niveles**: 0–39 *Por desarrollar*, 40–59 *En construcción*, 60–79 *Competencia sólida*,
  80–100 *Punto fuerte*.
- **Fortalezas**: puntuación ≥ 65. **Áreas de desarrollo**: < 45. El resto son
  **habilidades complementarias**. Si un bloque queda vacío se rellena con las competencias más
  próximas para que el mapa siempre sea informativo.
- **Confianza orientativa**: combina el número de preguntas que informaban de la competencia y el
  peso acumulado. No es una medida estadística; avisa de cuán sólida es la lectura.

El resultado se recalcula siempre desde las respuestas guardadas, nunca desde un resultado
almacenado en caché. Dos personas con las mismas respuestas obtienen exactamente el mismo mapa.

### Las diez competencias

Resolución de problemas · Organización y planificación · Comunicación · Colaboración ·
Adaptabilidad · Aprendizaje autónomo · Atención al detalle · Orientación a la persona usuaria ·
Iniciativa · Creatividad práctica.

### Las quince preguntas

Ocho preguntas de escala y siete de elección. Incluyen una pregunta específica sobre experiencia
fuera de un empleo formal (cuidados, hogar, pequeño negocio, voluntariado), que es el núcleo del
planteamiento de «talento invisible». Todas están redactadas para responderse desde el móvil en
unos cinco minutos.

---

## Cómo modificar preguntas, pesos y criterios

Todo el contenido evaluable es declarativo y vive en `src/config/`:

| Quiero cambiar… | Archivo |
| --- | --- |
| Las competencias evaluadas | `config/competencies.ts` |
| Las preguntas, opciones y pesos | `config/questions.ts` |
| Umbrales, niveles y contracción | `config/scoring.ts` |
| Las recomendaciones profesionales | `config/recommendations.ts` |
| El plan de desarrollo | `config/plan.ts` |

Pasos:

1. Edita el archivo correspondiente.
2. Actualiza `SCORING_CONFIG.questionnaireVersion` si cambian preguntas o pesos, para poder
   distinguir evaluaciones antiguas.
3. Ejecuta `npm run test`. Las pruebas comprueban que cada competencia aparece al menos en dos
   preguntas, que todos los pesos son válidos y que cada opción aporta a alguna competencia.
4. No hace falta tocar el motor, los componentes ni los PDF.

---

## Informes PDF

Se generan **en el navegador** con jsPDF; no se envía ningún dato a ningún servidor.

### «Mi mapa de talento» (informe personal)

Portada con el índice, resumen, competencias con barras y nivel, evidencias de las respuestas,
recomendaciones y plan de desarrollo de cuatro semanas. **No requiere consentimiento**: es la
persona quien decide descargarlo.

### Informe profesional para RR. HH.

Lenguaje profesional y neutral, con resumen estructurado, tabla de competencias con nivel y
confianza, evidencias por competencia y un apartado explícito de limitaciones.

**Protección:** requiere iniciar sesión (cuando Firebase está configurado) y un **consentimiento
explícito** con dos confirmaciones registradas en `localStorage`: autorización del informe y
confirmación de identidad. El consentimiento se puede retirar en cualquier momento. La función
`generateHRReport` lanza un error si no se pasa `includeHR: true`.

> Honestidad sobre la protección: son **controles de la interfaz**, no una barrera criptográfica.
> Una vez generado, el PDF puede compartirse con quien la persona decida. La aplicación garantiza
> que **no se envía nada automáticamente**; no existe un panel de empresa porque no hay base de
> datos remota.

---

## Privacidad y seguridad

- **Minimización de datos**: el perfil profesional es opcional; la evaluación puede hacerse sin
  identificarse; no se piden datos sensibles.
- **Almacenamiento local** (`localStorage`, prefijo `ti.v1`): respuestas, historial (máximo 10
  evaluaciones), perfil opcional y registro de consentimiento.
- **Borrado completo** desde *Perfil → Borrar todos mis datos*. También se puede revocar el
  consentimiento por separado.
- **Aviso explícito** en la interfaz de que los datos no se sincronizan entre dispositivos y de que
  borrar los datos del navegador los elimina.
- **Los resultados no se usan** como mecanismo de autenticación ni de autorización.
- **No hay secretos** en el frontend: solo la configuración pública del cliente de Firebase.
- **Accesibilidad y seguridad en React**: sin `dangerouslySetInnerHTML`, navegación por hash,
  etiquetas y `aria-*` en los controles, foco visible y respeto por `prefers-reduced-motion`.
- **RGPD**: consentimiento como base legal, finalidad limitada, información comprensible,
  posibilidad de acceso, portabilidad (descarga de PDF) y supresión.

---

## Pruebas

```bash
npm run test
```

**64 pruebas** repartidas en:

| Archivo | Qué comprueba |
| --- | --- |
| `src/engine/scoring.test.ts` | Determinismo, rangos 0–100, orden correcto entre perfiles, aporte de escalas y opciones, evidencias, confianza, configuración personalizada |
| `src/engine/talentMap.test.ts` | Clasificación en los tres bloques, bloques nunca vacíos, orden del ranking, redacción del resumen |
| `src/engine/pdf.test.ts` | Cabecera `%PDF`, tamaño, marcador EOF, informe profesional, rechazo sin consentimiento, nombres de archivo |
| `src/config/config.test.ts` | Integridad del banco (10–15 preguntas), unicidad, pesos válidos, cobertura de competencias, catálogo de recomendaciones |
| `src/storage/localStorage.test.ts` | Guardado, historial limitado, borrado selectivo y total, consentimiento |
| `src/App.test.tsx` | Montaje completo de la aplicación y navegación por hash |

---

## Despliegue en GitHub Pages

### 1. Crear el repositorio y subir el código

```bash
git init
git add .
git commit -m "Talento Invisible: MVP"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

`.gitignore` ya excluye `node_modules`, `dist` y `.env.local`.

### 2. Activar GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.

### 3. El workflow ya está incluido

`.github/workflows/deploy.yml` se ejecuta en cada `push` a `main`:

1. Instala con `npm ci`.
2. Ejecuta las pruebas y la comprobación de tipos.
3. Compila con `BASE_PATH` calculado automáticamente como `/<nombre-del-repo>/`.
4. Publica solo el contenido de `dist/`.

Permisos: `contents: read`, `pages: write`, `id-token: write`. Nada más.

### 4. Ajustar `base` (importante)

El workflow calcula `BASE_PATH` a partir del nombre del repositorio, de modo que los recursos
cargan desde `https://TU_USUARIO.github.io/TU_REPO/`.

- **Proyecto de GitHub Pages** (`usuario.github.io/mi-repo/`): funciona sin cambios.
- **Dominio propio o `usuario.github.io`**: crea una variable de repositorio `BASE_PATH` con el
  valor `/` en **Settings → Secrets and variables → Actions → Variables**, o cambia el `env` del
  workflow.

Para compilar localmente apuntando a un proyecto de Pages:

```bash
# PowerShell
$env:BASE_PATH="/mi-repo/"; npm run build
```

### 5. Navegación de la SPA

La aplicación usa **rutas por hash** (`#/evaluacion`, `#/resultados`…). Así cualquier pantalla
interna funciona al recargar en un alojamiento estático, sin reglas de reescritura ni `404.html`.
El service worker incluye un `navigateFallback` a `index.html` como refuerzo.

### 6. Dominio autorizado en Firebase

Añade `TU_USUARIO.github.io` a **Authentication → Settings → Authorized domains** antes de probar
el acceso con Google en producción.

### 7. Comprobaciones después del despliegue

- [ ] La página carga con los estilos y los iconos correctos.
- [ ] Se puede crear una cuenta y cerrar sesión.
- [ ] La evaluación se completa y muestra el mapa de talento.
- [ ] Los dos PDF se descargan y se abren.
- [ ] La opción «Añadir a la pantalla de inicio» aparece en el móvil.
- [ ] Recargar en `#/resultados` no da error.

---

## Datos de demostración

La pantalla de inicio incluye **«Ver ejemplo»**, que carga un perfil ficticio:

> **Marta** — 9 años en cuidados de personas mayores y atención al cliente. Sin titulación
> universitaria. Es una persona inventada.

Carga sus respuestas, su perfil y su evaluación, y puedes borrarla desde *Perfil → Borrar todos mis
datos*. Los datos están en `src/config/demo.ts`.

---

## Limitaciones conocidas

1. **Los datos son locales al dispositivo y al navegador.** No se sincronizan. Borrar los datos del
   navegador elimina la evaluación.
2. **No existe un panel de empresa.** No hay forma segura de que RR. HH. consulte evaluaciones de
   otras personas sin una base de datos remota con control de acceso real. La persona descarga y
   comparte su informe manualmente.
3. **Los resultados son orientativos.** No miden rendimiento real en un puesto, no son un
   diagnóstico y no sustituyen una prueba práctica ni una entrevista.
4. **El consentimiento del informe profesional es un control de interfaz**, no una protección
   criptográfica. Una vez generado, el PDF puede compartirse.
5. **Cobertura desigual entre competencias.** La contracción lo hace explícito, pero algunas
   competencias se apoyan en menos preguntas que otras.
6. **Sin conexión** funcionan la evaluación, el cálculo, el historial y los PDF. La autenticación
   necesita conexión.
7. **Sin Firebase configurado** no hay registro: la aplicación funciona en modo local y lo indica.
8. **Un único idioma**: español.
9. **Sin verificación de identidad real.** El correo se verifica desde Firebase, pero la aplicación
   no impone la verificación para usar la evaluación.

---

## Licencia

Código de demostración para uso educativo y de prototipado. Añade la licencia que prefieras antes de
publicarlo.
