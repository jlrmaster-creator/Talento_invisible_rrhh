/**
 * Generador de iconos PWA.
 *
 * Escribe PNG reales sin dependencias externas: se dibuja el logo pixel a
 * pixel y se codifica el PNG con el modulo `zlib` de Node.
 *
 * Uso: npm run icons
 */

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const ICONS_DIR = join(PUBLIC_DIR, 'icons');

// --- Codificacion PNG ---

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

const crc32 = (buffer) => {
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
};

const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
};

const encodePng = (width, height, rgba) => {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bits per channel
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filtro none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// --- Dibujo ---

const hexToRgb = (hex) => {
  const value = parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

const inRoundedRect = (x, y, left, top, width, height, radius) => {
  if (x < left || x > left + width || y < top || y > top + height) return false;
  const cx = Math.min(Math.max(x, left + radius), left + width - radius);
  const cy = Math.min(Math.max(y, top + radius), top + height - radius);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
};

const inCircle = (x, y, cx, cy, r) => {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
};

/**
 * Logo: fondo con degradado violeta y tres barras ascendentes (mapa de
 * competencias) con un punto de acento.
 */
const drawIcon = (size, { maskable = false } = {}) => {
  const rgba = Buffer.alloc(size * size * 4);
  const samples = 3; // supermuestreo 3x3 para suavizar los bordes

  const from = hexToRgb('#4F46E5');
  const to = hexToRgb('#8B5CF6');
  const accent = hexToRgb('#FBBF24');

  const radius = maskable ? 0 : size * 0.22;
  const contentScale = maskable ? 0.62 : 0.78;
  const barWidth = size * 0.13 * contentScale;
  const gap = size * 0.085 * contentScale;
  const barsHeight = [0.26, 0.42, 0.58];
  const baseY = size * (maskable ? 0.62 : 0.68);
  const startX = size * 0.5 - (barWidth * 3 + gap * 2) / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const px = x + (sx + 0.5) / samples;
          const py = y + (sy + 0.5) / samples;

          let sample = [0, 0, 0];
          let alpha = 0;

          const inBackground = maskable
            ? true
            : inRoundedRect(px, py, 0, 0, size, size, radius);

          if (inBackground) {
            const t = (px / size) * 0.4 + (py / size) * 0.6;
            sample = mix(from, to, Math.min(1, t));
            alpha = 255;
          }

          // Barras
          for (let index = 0; index < 3; index++) {
            const left = startX + index * (barWidth + gap);
            const height = size * barsHeight[index] * contentScale;
            const top = baseY - height;
            if (inRoundedRect(px, py, left, top, barWidth, height, barWidth * 0.35)) {
              sample = [255, 255, 255];
              alpha = 255;
            }
          }

          // Punto de acento
          if (inCircle(px, py, size * 0.74, size * 0.27, size * 0.055)) {
            sample = accent;
            alpha = 255;
          }

          r += sample[0] * (alpha / 255);
          g += sample[1] * (alpha / 255);
          b += sample[2] * (alpha / 255);
          a += alpha;
        }
      }

      const total = samples * samples;
      const offset = (y * size + x) * 4;
      if (a > 0) {
        const avgAlpha = a / total;
        rgba[offset] = Math.round(r / total);
        rgba[offset + 1] = Math.round(g / total);
        rgba[offset + 2] = Math.round(b / total);
        rgba[offset + 3] = Math.round(avgAlpha);
      }
    }
  }

  return rgba;
};

const write = (path, size, options) => {
  const rgba = drawIcon(size, options);
  const png = encodePng(size, size, rgba);
  writeFileSync(path, png);
  console.log(`  ${path.replace(PUBLIC_DIR, 'public')} (${size}x${size}, ${png.length} bytes)`);
};

mkdirSync(ICONS_DIR, { recursive: true });

console.log('Generando iconos PWA...');
write(join(ICONS_DIR, 'icon-192.png'), 192);
write(join(ICONS_DIR, 'icon-512.png'), 512);
write(join(ICONS_DIR, 'icon-maskable-512.png'), 512, { maskable: true });
write(join(PUBLIC_DIR, 'apple-touch-icon.png'), 180);
console.log('Listo.');
