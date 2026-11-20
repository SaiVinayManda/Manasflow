import fs from "node:fs/promises";
import sharp from "sharp";

// Preserve the logo's paths, crop transparent margins, and center the white mark
// on an opaque dark square so it remains legible on search and browser surfaces.
const source = await fs.readFile("public/logo.svg");
const mark = await sharp(source).trim().negate({ alpha: false }).png().toBuffer();
async function iconImage(size) {
  const foreground = await sharp(mark).resize({ width: Math.round(size * 0.82), height: Math.round(size * 0.82), fit: "inside" }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#0f0f15" } }).composite([{ input: foreground, gravity: "centre" }]);
}
for (const [size, filename] of [[48, "favicon-48x48.png"], [96, "favicon-96x96.png"], [180, "apple-touch-icon.png"]]) {
  await (await iconImage(size)).png().toFile(`public/${filename}`);
}

// A conventional Windows ICO with 16, 32, and 48px uncompressed 32-bit DIBs.
// DIB payloads retain compatibility with decoders that do not read PNG-in-ICO.
const sizes = [16, 32, 48];
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
const frames = [];
let offset = header.length;
for (const [index, size] of sizes.entries()) {
  const pixels = await (await iconImage(size)).ensureAlpha().raw().toBuffer();
  const maskStride = Math.ceil(size / 32) * 4;
  const dib = Buffer.alloc(40 + size * size * 4 + maskStride * size);
  dib.writeUInt32LE(40, 0);
  dib.writeInt32LE(size, 4);
  dib.writeInt32LE(size * 2, 8);
  dib.writeUInt16LE(1, 12);
  dib.writeUInt16LE(32, 14);
  dib.writeUInt32LE(size * size * 4, 20);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const input = (y * size + x) * 4;
    const output = 40 + ((size - y - 1) * size + x) * 4;
    dib[output] = pixels[input + 2];
    dib[output + 1] = pixels[input + 1];
    dib[output + 2] = pixels[input];
    dib[output + 3] = pixels[input + 3];
  }
  const directory = 6 + index * 16;
  header[directory] = size;
  header[directory + 1] = size;
  header.writeUInt16LE(1, directory + 4);
  header.writeUInt16LE(32, directory + 6);
  header.writeUInt32LE(dib.length, directory + 8);
  header.writeUInt32LE(offset, directory + 12);
  frames.push(dib);
  offset += dib.length;
}
await fs.writeFile("public/favicon.ico", Buffer.concat([header, ...frames]));
console.log("Generated 48/96px PNGs, 180px Apple icon, and 16/32/48px ICO from public/logo.svg.");
