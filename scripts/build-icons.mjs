// Renders the favicon set from scripts/icon.svg.
// Run with: node scripts/build-icons.mjs
import sharp from "sharp";
import fs from "node:fs/promises";

const svg = await fs.readFile("scripts/icon.svg");
const png = (size) => sharp(svg, { density: 72 * (size / 64) * 2 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// Maskable icons need the mark inside the central safe zone on a full-bleed ground.
const maskable = async (size) => {
  const inner = await sharp(svg, { density: 72 * 8 }).resize(Math.round(size * 0.62)).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: "#3d4891" } })
    .composite([{ input: inner, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// ICO container holding PNG frames (supported by every current browser and by Windows).
const ico = (frames) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const entries = frames.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]);
};

await fs.mkdir("public/icons", { recursive: true });
await fs.copyFile("scripts/icon.svg", "src/app/icon.svg");
await fs.writeFile("src/app/favicon.ico", ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })))));
await fs.writeFile("src/app/apple-icon.png", await maskable(180));
await fs.writeFile("public/icons/icon-192.png", await png(192));
await fs.writeFile("public/icons/icon-512.png", await png(512));
await fs.writeFile("public/icons/maskable-512.png", await maskable(512));
console.log("icons written");
