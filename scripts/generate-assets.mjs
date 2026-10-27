/**
 * Genera los iconos derivados del favicon de marca.
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

// La imagen para compartir (public/og-konquerai.jpg) ya no se genera aquí: se diseña
// aparte con el mensaje vigente de la home y el logo oficial (public/logo.svg).

console.log("Generado: apple-touch-icon.png, favicon-96x96.png, favicon.ico");
