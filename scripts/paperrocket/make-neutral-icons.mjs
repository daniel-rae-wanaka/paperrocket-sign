// paperrocket-sign: draws the neutral document glyph used for the favicon, apple-touch icon and manifest icons when
// NEXT_PUBLIC_FAVICON_URL / NEXT_PUBLIC_APPLE_TOUCH_ICON_URL are unset. No dependencies: node's zlib and a tiny PNG
// writer. Run from the repo root: node scripts/paperrocket/make-neutral-icons.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const OUT = 'apps/remix/public';
const SAMPLES = 4;

const inRoundRect = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};

// Colour at a point of the unit square, or null for transparent.
const shade = (x, y) => {
  if (!inRoundRect(x, y, 0, 0, 1, 1, 0.18)) return null;
  const ink = [31, 41, 55];
  const paper = [255, 255, 255];
  const fold = [203, 213, 225];
  if (x >= 0.28 && x <= 0.72 && y >= 0.2 && y <= 0.8) {
    // Folded top-right corner.
    if (x > 0.58 && y < 0.34) {
      // Above the diagonal is cut away (ink), below it is the turned-over flap.
      return x - 0.58 > y - 0.2 ? ink : fold;
    }
    for (const ly of [0.44, 0.54, 0.64]) {
      if (y >= ly && y <= ly + 0.04 && x >= 0.36 && x <= 0.64) return ink;
    }
    return paper;
  }
  return ink;
};

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const png = (size) => {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let py = 0; py < size; py++) {
    raw[py * (size * 4 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const c = shade((px + (sx + 0.5) / SAMPLES) / size, (py + (sy + 0.5) / SAMPLES) / size);
          if (c) { r += c[0]; g += c[1]; b += c[2]; a += 1; }
        }
      }
      const o = py * (size * 4 + 1) + 1 + px * 4;
      const n = SAMPLES * SAMPLES;
      raw[o] = a ? Math.round(r / a) : 0;
      raw[o + 1] = a ? Math.round(g / a) : 0;
      raw[o + 2] = a ? Math.round(b / a) : 0;
      raw[o + 3] = Math.round((a / n) * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

const files = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};
for (const [name, size] of Object.entries(files)) writeFileSync(`${OUT}/${name}`, png(size));

// favicon.ico: one 32x32 PNG entry.
const p32 = png(32);
const head = Buffer.alloc(22);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(1, 4);
head[6] = 32;
head[7] = 32;
head.writeUInt16LE(1, 10);
head.writeUInt16LE(32, 12);
head.writeUInt32LE(p32.length, 14);
head.writeUInt32LE(22, 18);
writeFileSync(`${OUT}/favicon.ico`, Buffer.concat([head, p32]));
console.log('wrote', Object.keys(files).length + 1, 'icons');
