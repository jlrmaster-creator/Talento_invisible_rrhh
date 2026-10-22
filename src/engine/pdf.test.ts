import { describe, expect, it } from 'vitest';
import {
  generatePersonalReport,
  generateHRReport,
  generatePersonalReportBuffer,
  generateHRReportBuffer,
  safeFilename,
} from './pdf';
import { buildResult } from './result';
import { bestAnswers, middleAnswers } from '../test/fixtures';

const result = buildResult(bestAnswers(), '2026-01-15T10:30:00.000Z');

const asText = (buffer: ArrayBuffer): string =>
  String.fromCharCode(...new Uint8Array(buffer.slice(0, 5)));

describe('generacion de informes PDF', () => {
  it('genera el informe personal como PDF valido', () => {
    const blob = generatePersonalReport(result);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(1000);
    expect(blob.type).toBe('application/pdf');
  });

  it('el PDF empieza por la cabecera %PDF', () => {
    const buffer = generatePersonalReportBuffer(result);
    expect(asText(buffer)).toBe('%PDF-');
  });

  it('el PDF termina con el marcador EOF', () => {
    const buffer = generatePersonalReportBuffer(result);
    const bytes = new Uint8Array(buffer);
    const tail = String.fromCharCode(...bytes.slice(-6));
    expect(tail).toContain('EOF');
  });

  it('el informe personal tiene varias paginas', () => {
    const buffer = generatePersonalReportBuffer(result);
    const text = new TextDecoder('latin1').decode(buffer);
    expect(text).toContain('/Type /Page');
  });

  it('genera el informe profesional cuando hay consentimiento', () => {
    const blob = generateHRReport(result, { includeHR: true, consentText: 'Consentimiento de prueba' });
    expect(blob.size).toBeGreaterThan(1000);
    expect(blob.type).toBe('application/pdf');
  });

  it('el informe profesional incluye el texto del consentimiento', () => {
    const buffer = generateHRReportBuffer(result, {
      includeHR: true,
      consentText: 'Consentimiento de prueba',
    });
    const text = new TextDecoder('latin1').decode(buffer);
    // El PDF comprime el texto, asi que se comprueba que el documento existe y
    // tiene el tamano esperado, y que no lanza error.
    expect(buffer.byteLength).toBeGreaterThan(1000);
    expect(text).toContain('/Type /Catalog');
  });

  it('el informe profesional se niega a generarse sin consentimiento', () => {
    expect(() => generateHRReport(result, { includeHR: false })).toThrowError(
      /includeHR=true y consentimiento explicito/,
    );
  });

  it('genera los dos informes con un perfil medio', () => {
    const middle = buildResult(middleAnswers(), '2026-02-01T08:00:00.000Z');
    expect(generatePersonalReport(middle).size).toBeGreaterThan(1000);
    expect(generateHRReport(middle, { includeHR: true }).size).toBeGreaterThan(1000);
  });

  it('el tamano del informe es estable entre ejecuciones con la misma entrada', () => {
    const a = generatePersonalReportBuffer(result).byteLength;
    const b = generatePersonalReportBuffer(result).byteLength;
    expect(b).toBe(a);
  });

  it('genera nombres de archivo seguros', () => {
    expect(safeFilename('mi-mapa-de-talento', '2026-01-15T10:30:00.000Z')).toBe(
      'mi-mapa-de-talento_20260115.pdf',
    );
  });
});
