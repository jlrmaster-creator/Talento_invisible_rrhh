import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import App from './App';

/**
 * Prueba de humo: la aplicacion completa se monta sin errores.
 *
 * No sustituye a una prueba de interfaz, pero detecta fallos de importacion,
 * de renderizado o de inicializacion de providers.
 */
const mountApp = async (hash = '#/') => {
  window.location.hash = hash;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<App />);
  });
  return {
    container,
    unmount: async () => {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
};

describe('montaje de la aplicacion', () => {
  it('renderiza la pantalla de inicio sin errores', async () => {
    const { container, unmount } = await mountApp('#/');
    expect(container.textContent).toContain('Talento Invisible');
    expect(container.textContent).toContain('currículum');
    await unmount();
  });

  it('renderiza la pantalla de resultados sin datos sin romperse', async () => {
    const { container, unmount } = await mountApp('#/resultados');
    expect(container.textContent).toContain('mapa de talento');
    await unmount();
  });

  it('renderiza la pantalla de privacidad', async () => {
    const { container, unmount } = await mountApp('#/privacidad');
    expect(container.textContent).toContain('Privacidad');
    await unmount();
  });

  it('renderiza la pantalla de perfil', async () => {
    const { container, unmount } = await mountApp('#/perfil');
    expect(container.textContent).toContain('Perfil');
    await unmount();
  });

  it('renderiza la evaluacion con la primera pregunta', async () => {
    const { container, unmount } = await mountApp('#/evaluacion');
    expect(container.textContent).toContain('Pregunta 1 de');
    await unmount();
  });

  it('cambia de pantalla al cambiar el hash', async () => {
    const { container, unmount } = await mountApp('#/');
    expect(container.textContent).toContain('Cómo funciona');

    await act(async () => {
      window.location.hash = '#/privacidad';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(container.textContent).toContain('Privacidad y datos');
    await unmount();
  });
});
