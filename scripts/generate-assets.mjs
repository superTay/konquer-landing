/**
 * Genera los iconos derivados del favicon de marca y la og-image.
 * Uso: node scripts/generate-assets.mjs
 * Requiere sharp (ya presente como dependencia de Astro).
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const PUB = "public";

// ── Favicons derivados de public/favicon.svg ──
const fav = `${PUB}/favicon.svg`;

await sharp(fav).resize(180, 180).png().toFile(`${PUB}/apple-touch-icon.png`);
await sharp(fav).resize(96, 96).png().toFile(`${PUB}/favicon-96x96.png`);

// favicon.ico (envuelve un PNG 48x48 en contenedor ICO — válido en navegadores modernos)
const ico48 = await sharp(fav).resize(48, 48).png().toBuffer();
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: icono
  header.writeUInt16LE(1, 4); // nº imágenes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // ancho
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // alto
  entry.writeUInt8(0, 2); // colores paleta
  entry.writeUInt8(0, 3); // reservado
  entry.writeUInt16LE(1, 4); // planos
  entry.writeUInt16LE(32, 6); // bits por pixel
  entry.writeUInt32LE(png.length, 8); // tamaño datos
  entry.writeUInt32LE(6 + 16, 12); // offset
  return Buffer.concat([header, entry, png]);
}
writeFileSync(`${PUB}/favicon.ico`, pngToIco(ico48, 48));

// ── og-image.png (1200x630) ──
const og = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00D1B2"/>
      <stop offset="1" stop-color="#009B89"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.12" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orange" cx="0.94" cy="0.9" r="0.55">
      <stop offset="0" stop-color="#FF8A00" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#FF8A00" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#orange)"/>
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" fill="#ffffff">
    <text x="80" y="118" font-size="38" font-weight="700" letter-spacing="0.5">KonquerAI</text>
    <rect x="82" y="196" width="64" height="6" rx="3" fill="#FF8A00"/>
    <text x="80" y="300" font-size="62" font-weight="800">Tu cuadrilla administrativa,</text>
    <text x="80" y="378" font-size="62" font-weight="800">ahora digital.</text>
    <text x="80" y="466" font-size="29" font-weight="500" fill-opacity="0.92">Recupera hasta 30 horas al mes y controla cada obra al céntimo.</text>
    <text x="80" y="566" font-size="24" font-weight="600" fill-opacity="0.85">konquerai.com</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(`${PUB}/og-image.png`);

console.log("Generado: apple-touch-icon.png, favicon-96x96.png, favicon.ico, og-image.png");
