/**
 * Configuracion de las pruebas.
 *
 * jsdom simula el navegador para poder probar los PDF (jsPDF necesita DOM)
 * y la persistencia en localStorage.
 */

import { afterEach, vi } from 'vitest';

// React 18 necesita esta marca para que act() funcione sin avisos.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom no implementa scrollTo: se sustituye por un no-op.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});
