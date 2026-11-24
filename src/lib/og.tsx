import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const ogSize = { width: 1200, height: 630 };

// Each subset is its own family so basic Latin always comes from the Latin file.
const DISPLAY = "Fraunces, \"Fraunces Ext\", \"Fraunces Vi\"";
const SANS = "\"Inter Tight\", \"Inter Tight Ext\", \"Inter Tight Vi\"";

const font = async (pkg: string, file: string) =>
  (await readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file))).toString("base64");

// File reads are cached so the image routes can prerender under Cache Components.
// Returned as base64 because cached values must be serializable.
async function assets(cover: string) {
  "use cache";
  // Romanian needs three subsets: ș and ț are in latin-ext, ă and Ă in vietnamese.
  const [display, displayExt, displayVi, sans, sansExt, sansVi, photo] = await Promise.all([
    font("fraunces", "fraunces-latin-700-normal.woff"),
    font("fraunces", "fraunces-latin-ext-700-normal.woff"),
    font("fraunces", "fraunces-vietnamese-700-normal.woff"),
    font("inter-tight", "inter-tight-latin-500-normal.woff"),
    font("inter-tight", "inter-tight-latin-ext-500-normal.woff"),
    font("inter-tight", "inter-tight-vietnamese-500-normal.woff"),
    sharp(join(process.cwd(), "public", cover)).resize(720, 630, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer().then((b) => b.toString("base64")),
  ]);
  return { display, displayExt, displayVi, sans, sansExt, sansVi, photo };
}

const buf = (b64: string) => {
  const b = Buffer.from(b64, "base64");
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
};

/*
 * Share card in the site's own language: paper title block on the left, the
 * project's cover on the right, the core-and-shell mark in the corner.
 * Rendered at build time for every page in both languages.
 */
export async function ogImage({ eyebrow, title, cover, footer }: { eyebrow: string; title: string; cover: string; footer: string }) {
  const { display, displayExt, displayVi, sans, sansExt, sansVi, photo } = await assets(cover);
  // Fit the longest word to the 384px text column; Fraunces Bold averages ~0.6em per glyph.
  const longest = Math.max(...title.split(" ").map((w) => w.length));
  const titleSize = Math.min(76, Math.floor(384 / (longest * 0.6)), title.length > 34 ? 56 : 76);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f2f0eb" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 480, padding: "56px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="44" height="44" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="14" fill="#3d4891" />
              <rect x="15" y="15" width="34" height="34" fill="none" stroke="#f2f0eb" strokeWidth="5" transform="rotate(-12 32 32)" />
              <rect x="25.5" y="25.5" width="13" height="13" fill="#c0392b" />
            </svg>
            <span style={{ fontFamily: DISPLAY, fontSize: 30, color: "#16171c" }}>Sabine Lieb</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 2.5, textTransform: "uppercase", color: "#8e1d1d" }}>{eyebrow}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: titleSize, lineHeight: 0.95, letterSpacing: -1.5, color: "#3d4891" }}>{title}</span>
          </div>
          <span style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 2.5, textTransform: "uppercase", color: "#5d5e63" }}>{footer}</span>
        </div>
        <div style={{ display: "flex", position: "relative", width: 720, height: 630 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
          <img src={`data:image/jpeg;base64,${photo}`} width={720} height={630} alt="" />
          <div style={{ position: "absolute", left: 34, top: 34, right: 34, bottom: 34, border: "2px solid rgba(242,240,235,0.75)", transform: "rotate(-2deg)" }} />
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: buf(display), weight: 700, style: "normal" },
        { name: "Fraunces Ext", data: buf(displayExt), weight: 700, style: "normal" },
        { name: "Fraunces Vi", data: buf(displayVi), weight: 700, style: "normal" },
        { name: "Inter Tight", data: buf(sans), weight: 500, style: "normal" },
        { name: "Inter Tight Ext", data: buf(sansExt), weight: 500, style: "normal" },
        { name: "Inter Tight Vi", data: buf(sansVi), weight: 500, style: "normal" },
      ],
    },
  );
}
