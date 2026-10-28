import fs from "node:fs";
import sharp from "sharp";

const mark = fs.readFileSync("public/brand/mark.svg");
await sharp(mark)
  .resize(180, 180)
  .png()
  .toFile("public/brand/apple-touch-icon.png");
await sharp(mark).resize(512, 512).png().toFile("public/brand/icon-512.png");
const png = await sharp(mark).resize(32, 32).png().toBuffer();
fs.writeFileSync("public/brand/favicon-32.png", png);
const icon = Buffer.alloc(22);
icon.writeUInt16LE(1, 2);
icon.writeUInt16LE(1, 4);
icon[6] = 32;
icon[7] = 32;
icon.writeUInt16LE(1, 10);
icon.writeUInt16LE(32, 12);
icon.writeUInt32LE(png.length, 14);
icon.writeUInt32LE(22, 18);
fs.writeFileSync("public/favicon.ico", Buffer.concat([icon, png]));
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#F5F1E8"/><path d="M65 91V68c0-10 15-10 15 0v23-30c0-10 16-10 16 0v30-23c0-10 16-10 16 0v23" stroke="#173D32" stroke-width="5" fill="none" stroke-linecap="round"/><text x="132" y="89" font-size="35" font-family="Arial,sans-serif" fill="#173D32">manasflow.</text><text x="64" y="270" font-size="83" font-family="Georgia,serif" fill="#173D32">A little clarity.</text><text x="64" y="365" font-size="83" font-style="italic" font-family="Georgia,serif" fill="#B85438">A lot of possibility.</text><text x="67" y="481" font-size="19" font-family="Arial,sans-serif" fill="#68736B">Thoughtful digital products, connected tools</text><text x="67" y="511" font-size="19" font-family="Arial,sans-serif" fill="#68736B">and practical automation.</text><path d="M900 489c-140-91-145-233-38-286 104-50 191 65 119 135-81 80-158-90-77-169 88-86 249 7 209 134" stroke="#173D32" stroke-width="49" fill="none" stroke-linecap="round"/><path d="M859 493c-38-90 21-171 77-119s-8 140 67 148c44 4 74-26 91-48" stroke="#D18B65" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M65 565h1070" stroke="#173D32" stroke-opacity=".2"/><text x="67" y="600" font-size="12" font-family="Arial,sans-serif" fill="#68736B">MILAN, ITALY / REMOTE-FIRST ACROSS EUROPE</text></svg>`;
fs.writeFileSync("public/brand/social-card.svg", social);
await sharp(Buffer.from(social)).png().toFile("public/brand/social-card.png");
fs.writeFileSync(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Manasflow",
      short_name: "Manasflow",
      start_url: "/",
      display: "standalone",
      background_color: "#F5F1E8",
      theme_color: "#173D32",
      icons: [
        {
          src: "/brand/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    null,
    2,
  ),
);
console.log(
  "Generated original Manasflow social image, favicons and web manifest.",
);
