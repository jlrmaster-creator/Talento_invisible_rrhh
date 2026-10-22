/**
 * Generacion de informes PDF en el navegador.
 *
 * Usa jsPDF y jsPDF-AutoTable. No se envian datos a ningun servidor.
 * Todo se ejecuta localmente en el cliente.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COMPETENCIES } from '../config/competencies';
import { recommendationFor, joinCompetencies } from './talentMap';
import { PLAN_INTRO, PLAN_WEEK_TEMPLATES } from '../config/plan';
import type { AssessmentResult, CompetencyScore } from './types';

export interface PdfOptions {
  /** Incluir el informe para RRHH (requiere consentimiento explícito). */
  includeHR?: boolean;
  /** Texto del consentimiento, para dejar constancia. */
  consentText?: string;
  /** Información profesional opcional de la persona participante. */
  profile?: PdfProfile;
}

/** Datos de perfil que se incrustan en el informe, todos opcionales. */
export interface PdfProfile {
  displayName?: string;
  headline?: string;
  sector?: string;
  yearsExperience?: number;
}

/** Añade el bloque de datos de perfil bajo la cabecera. */
const addProfileBlock = (
  doc: jsPDF,
  profile: PdfProfile | undefined,
  margin: number,
  y: number,
): number => {
  if (!profile) return y;
  const lines: string[] = [];
  if (profile.displayName) lines.push(profile.displayName);
  if (profile.headline) lines.push(profile.headline);
  if (profile.sector) lines.push(`Área: ${profile.sector}`);
  if (profile.yearsExperience !== undefined) {
    lines.push(`Años de experiencia: ${profile.yearsExperience}`);
  }
  if (lines.length === 0) return y;

  doc.setFontSize(9);
  doc.setTextColor('#374151');
  for (const line of lines) {
    doc.text(line, margin, y);
    y += 4;
  }
  return y + 3;
};

/** Dibuja una barra de progreso simple. */
const drawBar = (doc: jsPDF, x: number, y: number, width: number, height: number, score: number, color: string) => {
  doc.setFillColor('#E5E7EB');
  doc.roundedRect(x, y, width, height, 1, 1, 'F');
  const ratio = Math.min(1, Math.max(0, score / 100));
  if (ratio > 0) {
    const [r, g, b] = hexToRgb(color);
    doc.setFillColor(r, g, b);
    doc.roundedRect(x, y, width * ratio, height, 1, 1, 'F');
  }
};

/** Convierte hex a RGB. */
const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const value = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

/** Formatea una fecha corta en español. */
const formatDate = (iso: string): string => {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
};

/**
 * Construye el documento del informe personal.
 * Se separa del `output` para poder inspeccionar los bytes en las pruebas.
 */
export const buildPersonalReportDoc = (result: AssessmentResult, options: PdfOptions = {}): jsPDF => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const map = result.map;
  const margin = 14;
  let y = margin;

  // Cabecera
  doc.setFontSize(18);
  doc.setTextColor('#111827');
  doc.text('Mi mapa de talento', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor('#4B5563');
  doc.text(`Talento Invisible - Generado el ${formatDate(result.createdAt)}`, margin, y);
  y += 4;
  doc.text(`Cuestionario v${result.questionnaireVersion}`, margin, y);
  y += 8;

  y = addProfileBlock(doc, options.profile, margin, y);

  // Resumen
  doc.setFontSize(12);
  doc.setTextColor('#111827');
  doc.text('Resumen', margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor('#374151');
  const summaryLines = doc.splitTextToSize(map.summary, 182);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 6;

  // Indice global
  doc.setFillColor('#F9FAFB');
  doc.roundedRect(margin, y, 182, 16, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor('#111827');
  doc.text(`Índice de talento visible: ${map.overallIndex}/100 - ${map.overallLevelLabel}`, margin + 4, y + 7);
  y += 22;

  // Principales fortalezas
  y = addCompetencySection(doc, 'Principales fortalezas', map.strengths, margin, y, true);
  y = addCompetencySection(doc, 'Habilidades complementarias', map.complementary, margin, y, true);
  y = addCompetencySection(doc, 'Áreas que se pueden desarrollar', map.development, margin, y, true);

  // Recomendaciones
  doc.addPage();
  y = margin;
  doc.setFontSize(14);
  doc.setTextColor('#111827');
  doc.text('Recomendaciones profesionales', margin, y);
  y += 7;

  const recs = [
    ...map.strengths.slice(0, 2).map((s) => recommendationFor(s, 'strength')),
    ...map.complementary.slice(0, 2).map((s) => recommendationFor(s, 'complementary')),
    ...map.development.slice(0, 2).map((s) => recommendationFor(s, 'development')),
  ].filter(Boolean);

  for (const rec of recs) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(10);
    doc.setTextColor('#111827');
    doc.text(`• ${rec!.title}`, margin, y);
    y += 4;
    doc.setFontSize(9);
    doc.setTextColor('#374151');
    const actionLines = doc.splitTextToSize(`Acción: ${rec!.action}`, 174);
    doc.text(actionLines, margin + 4, y);
    y += actionLines.length * 4 + 2;
    const rationaleLines = doc.splitTextToSize(`Por qué: ${rec!.rationale}`, 174);
    doc.text(rationaleLines, margin + 4, y);
    y += rationaleLines.length * 4 + 6;
  }

  // Plan de desarrollo
  doc.addPage();
  y = margin;
  doc.setFontSize(14);
  doc.setTextColor('#111827');
  doc.text('Plan de desarrollo personal (4 semanas)', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor('#4B5563');
  const planIntroLines = doc.splitTextToSize(PLAN_INTRO, 182);
  doc.text(planIntroLines, margin, y);
  y += planIntroLines.length * 4 + 6;

  const dev = map.development[0] ?? map.complementary[0] ?? map.strengths[0];
  const comp = COMPETENCIES[dev.id as keyof typeof COMPETENCIES];
  const recDev = recommendationFor(dev, 'development') ?? recommendationFor(dev, 'complementary') ?? recommendationFor(dev, 'strength');

  for (const week of PLAN_WEEK_TEMPLATES) {
    if (y > 245) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(10);
    doc.setTextColor('#111827');
    doc.text(`Semana ${week.week} - ${week.focus}`, margin, y);
    y += 4;
    doc.setFontSize(9);
    doc.setTextColor('#374151');
    const obj = week.objective
      .replace('{competency}', comp?.name ?? dev.name)
      .replace('{action}', recDev?.action ?? '');
    const objLines = doc.splitTextToSize(`Objetivo: ${obj}`, 182);
    doc.text(objLines, margin, y);
    y += objLines.length * 4 + 2;
    for (const action of week.actions) {
      const act = action.replace('{competency}', comp?.name ?? dev.name).replace('{action}', recDev?.action ?? '');
      const actLines = doc.splitTextToSize(`  • ${act}`, 178);
      doc.text(actLines, margin + 4, y);
      y += actLines.length * 4;
    }
    y += 2;
    const evLines = doc.splitTextToSize(`Evidencia a guardar: ${week.evidence}`, 182);
    doc.text(evLines, margin, y);
    y += evLines.length * 4 + 6;
  }

  // Pie
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#9CA3AF');
    doc.text(
      'Talento Invisible | MVP sin IA | Datos almacenados localmente | No sustituye un proceso de selección',
      margin,
      285,
    );
    doc.text(`Página ${i} / ${pageCount}`, 196, 285);
  }

  return doc;
};

/**
 * Genera el informe personal "Mi mapa de talento".
 * Puede generarse sin consentimiento.
 */
export const generatePersonalReport = (result: AssessmentResult, options: PdfOptions = {}): Blob =>
  buildPersonalReportDoc(result, options).output('blob');

/** Bytes del informe personal, utiles para pruebas y para previsualizar. */
export const generatePersonalReportBuffer = (
  result: AssessmentResult,
  options: PdfOptions = {},
): ArrayBuffer => buildPersonalReportDoc(result, options).output('arraybuffer');

/** Añade una sección de competencias al PDF. */
const addCompetencySection = (
  doc: jsPDF,
  title: string,
  items: CompetencyScore[],
  margin: number,
  y: number,
  showBars: boolean,
): number => {
  if (items.length === 0) return y;
  if (y > 220) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(12);
  doc.setTextColor('#111827');
  doc.text(title, margin, y);
  y += 5;

  for (const item of items) {
    if (y > 265) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(9);
    doc.setTextColor('#111827');
    doc.text(`${item.name}`, margin, y);
    y += 2;
    if (showBars) {
      drawBar(doc, margin, y, 182, 3, item.score, item.color);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor('#6B7280');
      doc.text(`${item.score}/100 - ${item.levelLabel} (confianza orientativa: ${Math.round(item.confidence * 100)}%)`, margin, y);
      y += 4;
    }
    if (item.evidence.length > 0) {
      const topEvidence = item.evidence.slice(0, 2);
      for (const ev of topEvidence) {
        const lines = doc.splitTextToSize(`  Evidencia: ${ev.answerLabel}`, 174);
        doc.setFontSize(8);
        doc.setTextColor('#4B5563');
        doc.text(lines, margin + 4, y);
        y += lines.length * 3.5;
        if (ev.note) {
          const noteLines = doc.splitTextToSize(`    Nota: ${ev.note}`, 170);
          doc.setFontSize(7);
          doc.setTextColor('#6B7280');
          doc.text(noteLines, margin + 6, y);
          y += noteLines.length * 3.2;
        }
      }
    }
    y += 4;
  }
  y += 2;
  return y;
};

/**
 * Construye el documento del informe profesional para RRHH.
 * Requiere consentimiento explícito según las especificaciones.
 */
export const buildHRReportDoc = (
  result: AssessmentResult,
  options: PdfOptions = {},
): jsPDF => {
  if (!options.includeHR) {
    throw new Error('generateHRReport requiere includeHR=true y consentimiento explícito.');
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const map = result.map;
  const margin = 14;
  let y = margin;

  // Cabecera
  doc.setFontSize(16);
  doc.setTextColor('#111827');
  doc.text('Informe profesional para RR. HH.', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor('#4B5563');
  doc.text(`Talento Invisible - Generado el ${formatDate(result.createdAt)}`, margin, y);
  y += 4;
  doc.text('Documento orientativo. Las competencias se han evaluado con un cuestionario breve y determinista.', margin, y);
  y += 8;

  y = addProfileBlock(doc, options.profile, margin, y);

  // Consentimiento
  if (options.consentText) {
    doc.setFillColor('#FEFCE8');
    doc.roundedRect(margin, y, 182, 14, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor('#92400E');
    const consentLines = doc.splitTextToSize(`Consentimiento expreso: ${options.consentText}`, 174);
    doc.text(consentLines, margin + 4, y + 5);
    y += 18;
  }

  // Resumen estructurado
  doc.setFontSize(12);
  doc.setTextColor('#111827');
  doc.text('Resumen estructurado', margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor('#374151');
  doc.text(`Índice de talento visible: ${map.overallIndex}/100 (${map.overallLevelLabel})`, margin, y);
  y += 4;
  doc.text(`Principales fortalezas: ${joinCompetencies(map.strengths.slice(0, 3).map((s) => s.name))}`, margin, y);
  y += 4;
  doc.text(`Áreas a desarrollar (orientativas): ${joinCompetencies(map.development.slice(0, 2).map((s) => s.name))}`, margin, y);
  y += 10;

  // Tabla de competencias
  autoTable(doc, {
    startY: y,
    head: [['Competencia', 'Puntuación', 'Nivel', 'Confianza']],
    body: map.ranking.map((score) => [
      score.name,
      `${score.score}/100`,
      score.levelLabel,
      `${Math.round(score.confidence * 100)}%`,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
    margin: { left: margin, right: margin },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Evidencias estructuradas
  doc.setFontSize(12);
  doc.setTextColor('#111827');
  doc.text('Evidencias asociadas (por competencia)', margin, y);
  y += 6;

  for (const score of map.ranking.slice(0, 6)) {
    if (y > 250) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(9);
    doc.setTextColor('#111827');
    doc.text(`${score.name} - ${score.score}/100`, margin, y);
    y += 4;
    doc.setFontSize(8);
    doc.setTextColor('#4B5563');
    if (score.evidence.length === 0) {
      doc.text('  Sin evidencia registrada por respuestas.', margin + 4, y);
      y += 4;
    } else {
      for (const ev of score.evidence.slice(0, 3)) {
        const lines = doc.splitTextToSize(`  • ${ev.answerLabel}`, 174);
        doc.text(lines, margin + 4, y);
        y += lines.length * 3.5;
        if (ev.note) {
          const noteLines = doc.splitTextToSize(`    ${ev.note}`, 170);
          doc.setFontSize(7);
          doc.setTextColor('#6B7280');
          doc.text(noteLines, margin + 6, y);
          y += noteLines.length * 3.2;
          doc.setFontSize(8);
          doc.setTextColor('#4B5563');
        }
      }
    }
    y += 4;
  }

  // Limites y advertencias
  doc.addPage();
  y = margin;
  doc.setFontSize(12);
  doc.setTextColor('#111827');
  doc.text('Limitaciones del informe', margin, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor('#374151');
  const limits = [
    ' - Es orientativo y no constituye un diagnóstico, ni un veredicto sobre idoneidad para un puesto concreto.',
    ' - Se basa exclusivamente en respuestas a un cuestionario breve, sin prueba práctica ni entrevista.',
    ' - La evaluación es determinista y reproducible, pero no exhaustiva.',
    ' - Los datos se almacenan localmente en el dispositivo; este informe no se ha enviado automáticamente a ninguna empresa.',
    ' - No sustituye un proceso de selección formal. Debe usarse como una conversación entre iguales, con consentimiento.',
  ];
  for (const line of limits) {
    const l = doc.splitTextToSize(line, 182);
    doc.text(l, margin, y);
    y += l.length * 4;
  }

  if (options.consentText) {
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor('#111827');
    doc.text('Consentimiento registrado:', margin, y);
    y += 4;
    doc.setFontSize(8);
    doc.setTextColor('#374151');
    const c = doc.splitTextToSize(options.consentText, 182);
    doc.text(c, margin, y);
    y += c.length * 4;
  }

  // Pie
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#9CA3AF');
    doc.text(
      'Talento Invisible | Informe para RR. HH. | Generado localmente | Sin IA | Sin base de datos remota',
      margin,
      285,
    );
    doc.text(`Página ${i} / ${pageCount}`, 196, 285);
  }

  return doc;
};

/**
 * Genera el informe profesional para RRHH.
 * Requiere consentimiento explícito según las especificaciones.
 */
export const generateHRReport = (result: AssessmentResult, options: PdfOptions = {}): Blob =>
  buildHRReportDoc(result, options).output('blob');

/** Bytes del informe profesional, utiles para pruebas. */
export const generateHRReportBuffer = (
  result: AssessmentResult,
  options: PdfOptions = {},
): ArrayBuffer => buildHRReportDoc(result, options).output('arraybuffer');

/** Utilidad para descargar un blob como archivo. */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Genera un nombre de archivo seguro. */
export const safeFilename = (prefix: string, date: string): string => {
  const d = date.slice(0, 10).replace(/-/g, '');
  return `${prefix}_${d}.pdf`;
};
