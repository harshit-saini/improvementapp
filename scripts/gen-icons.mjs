import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });

const svg = (size, padding = 0) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6750A4"/>
      <stop offset="1" stop-color="#4F378B"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${padding ? 0 : 120}" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="150" fill="#EADDFF"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#4F378B" stroke-width="10"/>
  <text x="256" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="180" font-weight="bold" fill="#4F378B" text-anchor="middle">$</text>
</svg>`;

const targets = [
  { file: 'public/icons/icon-192.png', size: 192, padding: 0 },
  { file: 'public/icons/icon-512.png', size: 512, padding: 0 },
  { file: 'public/icons/maskable-192.png', size: 192, padding: 1 },
  { file: 'public/icons/maskable-512.png', size: 512, padding: 1 },
  { file: 'public/icons/apple-touch-icon.png', size: 180, padding: 0 },
];

for (const t of targets) {
  const buf = Buffer.from(svg(t.size, t.padding));
  if (t.padding) {
    // maskable: add safe-zone background full-bleed (already full bleed rect, no rounding)
    await sharp(buf).resize(t.size, t.size).png().toFile(t.file);
  } else {
    await sharp(buf).resize(t.size, t.size).png().toFile(t.file);
  }
  console.log('wrote', t.file);
}

// favicon
await sharp(Buffer.from(svg(64))).resize(64, 64).png().toFile('public/favicon.png');
console.log('wrote public/favicon.png');
