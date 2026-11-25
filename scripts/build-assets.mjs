// Builds web derivatives from src/raw. Crops are given in the coordinate space of a
// 1400px-long-edge preview of each source, then scaled to the original's resolution.
// Run with: node scripts/build-assets.mjs
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const RAW = "src/raw";
const OUT = "public/work";
const MANIFEST = "src/content/images.json";
const P = "portofoliu complet mai iei de aici chestii";

// [slug, name, source, crop | null, kind]
// kind "image": max 2400px, q80. kind "drawing": max 3200px, q88, 4:4:4 so linework stays crisp.
const jobs = [
  // Filarmonica Banatul (diploma)
  ["filarmonica", "cover", "Proiect de diploma 06/Coperta dreptunghi.jpg", null, "image"],
  ["filarmonica", "park", "Proiect de diploma 06/09 primul.jpg", null, "image"],
  ["filarmonica", "concept", "Proiect de diploma 06/02.jpg", null, "drawing"],
  ["filarmonica", "site", "Proiect de diploma 06/03.jpg", null, "drawing"],
  ["filarmonica", "massing", `${P}/Portofoliu31.jpg`, [672, 40, 1360, 556], "image"],
  ["filarmonica", "elevation-a", "Proiect de diploma 06/04.jpeg", null, "drawing"],
  ["filarmonica", "elevation-b", "Proiect de diploma 06/05.jpg", null, "drawing"],
  ["filarmonica", "hall", "Proiect de diploma 06/06.jpg", null, "image"],
  ["filarmonica", "recital", "Proiect de diploma 06/07 (1).jpg", null, "image"],
  ["filarmonica", "section-perspective", "Proiect de diploma 06/08.jpg", null, "drawing"],
  ["filarmonica", "foyer", "Proiect de diploma 06/09 al doilea.jpg", null, "image"],
  ["filarmonica", "exhibition", "Proiect de diploma 06/10.jpg", null, "image"],
  ["filarmonica", "section-cross", "Proiect de diploma 06/11.jpg", null, "drawing"],
  ["filarmonica", "studio", "Proiect de diploma 06/12.jpg", null, "image"],
  ["filarmonica", "plan-basement", "Proiect de diploma 06/13.jpg", null, "drawing"],
  ["filarmonica", "plan-ground", "Proiect de diploma 06/14.jpg", null, "drawing"],
  ["filarmonica", "plan-1", "Proiect de diploma 06/15.jpg", null, "drawing"],
  ["filarmonica", "plan-2", "Proiect de diploma 06/16.jpg", null, "drawing"],
  ["filarmonica", "plan-3", "Proiect de diploma 06/17.jpg", null, "drawing"],
  ["filarmonica", "plan-4", "Proiect de diploma 06/18.jpg", null, "drawing"],
  ["filarmonica", "restaurant", "Proiect de diploma 06/19.jpg", null, "image"],
  ["filarmonica", "section-long", "Proiect de diploma 06/20.jpg", null, "drawing"],
  ["filarmonica", "detail", "Proiect de diploma 06/21.jpg", null, "drawing"],

  // Pavilion Ana Lupas: only present in the complete portfolio
  ["pavilion-ana-lupas", "cover", `${P}/Portofoliu18.jpg`, [453, 40, 1360, 752], "image"],
  ["pavilion-ana-lupas", "studies", `${P}/Portofoliu19.jpg`, [850, 40, 1360, 200], "drawing"],
  ["pavilion-ana-lupas", "sketch-mansard", `${P}/Portofoliu19.jpg`, [850, 205, 1365, 490], "drawing"],
  ["pavilion-ana-lupas", "sketch-shell", `${P}/Portofoliu19.jpg`, [900, 492, 1240, 756], "drawing"],
  ["pavilion-ana-lupas", "exploded", `${P}/Portofoliu20.jpg`, [36, 36, 664, 756], "drawing"],
  ["pavilion-ana-lupas", "section-perspective", `${P}/Portofoliu20.jpg`, [745, 36, 1364, 756], "drawing"],

  // Muzeu Paul Neagu
  ["muzeu-paul-neagu", "aerial", "muzeu 01/titlu sa vezi ce trebe scris la el.jpg", [457, 299, 1360, 752], "image"],
  ["muzeu-paul-neagu", "sketch", "muzeu 01/01 muzeu.jpg", null, "drawing"],
  ["muzeu-paul-neagu", "plaza", "muzeu 01/02.jpg", [42, 40, 449, 268], "image"],
  ["muzeu-paul-neagu", "garden", "muzeu 01/02.jpg", [42, 281, 449, 508], "image"],
  ["muzeu-paul-neagu", "passage", "muzeu 01/02.jpg", [42, 523, 449, 751], "image"],
  ["muzeu-paul-neagu", "site", "muzeu 01/02.jpg", [480, 40, 1360, 752], "drawing"],
  ["muzeu-paul-neagu", "facade", "muzeu 01/03.jpg", [40, 40, 1360, 752], "image"],
  ["muzeu-paul-neagu", "plan-ground", "muzeu 01/04.jpg", [40, 40, 533, 383], "drawing"],
  ["muzeu-paul-neagu", "plan-1", "muzeu 01/04.jpg", [40, 408, 533, 751], "drawing"],
  ["muzeu-paul-neagu", "foyer", "muzeu 01/04.jpg", [573, 40, 1360, 383], "image"],
  ["muzeu-paul-neagu", "cafe", "muzeu 01/04.jpg", [573, 408, 958, 605], "image"],
  ["muzeu-paul-neagu", "gallery", "muzeu 01/04.jpg", [975, 408, 1360, 605], "image"],
  ["muzeu-paul-neagu", "section", "muzeu 01/04.jpg", [573, 624, 1360, 752], "drawing"],

  // Watchtower residency (Reuse Italy)
  ["rezidenta-turn-de-veghe", "site", "Warchtower 02/Copie a fișierului Portofoliu10.jpg", null, "image"],
  ["rezidenta-turn-de-veghe", "axonometric", "Warchtower 02/Copie a fișierului Portofoliu11.jpg", [36, 36, 670, 418], "drawing"],
  ["rezidenta-turn-de-veghe", "section", "Warchtower 02/Copie a fișierului Portofoliu11.jpg", [36, 440, 882, 745], "drawing"],
  ["rezidenta-turn-de-veghe", "bedroom", "Warchtower 02/Copie a fișierului Portofoliu11.jpg", [932, 39, 1359, 342], "image"],
  ["rezidenta-turn-de-veghe", "plan", "Warchtower 02/Copie a fișierului Portofoliu11.jpg", [925, 350, 1385, 752], "drawing"],
  ["rezidenta-turn-de-veghe", "interior", "Warchtower 02/Copie a fișierului Portofoliu12.jpg", [194, 40, 1209, 752], "image"],

  // Scoala Lipovei
  ["scoala-lipovei", "cover", "scoala 05/titlu sa stii ce e.jpg", [448, 299, 1360, 752], "image"],
  ["scoala-lipovei", "courtyard", "scoala 05/03.jpg", null, "image"],
  ["scoala-lipovei", "sketches", "scoala 05/01.jpg", null, "drawing"],
  ["scoala-lipovei", "library", "scoala 05/Copie a fișierului 1.jpg", null, "image"],
  ["scoala-lipovei", "library-stair", "scoala 05/Copie a fișierului 2.jpg", null, "image"],
  ["scoala-lipovei", "canteen", "scoala 05/Copie a fișierului 4.jpg", null, "image"],
  ["scoala-lipovei", "classroom", "scoala 05/05.jpg", [756, 40, 1360, 377], "image"],
  ["scoala-lipovei", "gym", "scoala 05/05.jpg", [756, 415, 1360, 752], "image"],
  ["scoala-lipovei", "section", "scoala 05/02.jpg", [36, 496, 1364, 708], "drawing"],
  ["scoala-lipovei", "site", "scoala 05/04.jpg", [38, 38, 446, 735], "drawing"],
  ["scoala-lipovei", "plan-ground", "scoala 05/04.jpg", [452, 38, 1362, 598], "drawing"],
  ["scoala-lipovei", "plans-upper", "scoala 05/05.jpg", [38, 38, 600, 752], "drawing"],

  // Clinica de recuperare
  ["clinica-recuperare", "cover", "clinica 03/coperta.jpg", null, "image"],
  ["clinica-recuperare", "sketches", "clinica 03/01.jpg", null, "drawing"],
  ["clinica-recuperare", "site", "clinica 03/02.jpg", [292, 60, 1108, 730], "drawing"],
  ["clinica-recuperare", "aerial", "clinica 03/03.jpg", [40, 40, 469, 311], "image"],
  ["clinica-recuperare", "lounge", "clinica 03/03.jpg", [486, 40, 914, 311], "image"],
  ["clinica-recuperare", "hall", "clinica 03/03.jpg", [932, 40, 1360, 311], "image"],
  ["clinica-recuperare", "section-perspective", "clinica 03/03.jpg", [36, 405, 1364, 722], "drawing"],
  ["clinica-recuperare", "section", "clinica 03/04.jpg", [36, 58, 758, 250], "drawing"],
  ["clinica-recuperare", "plan-ground", "clinica 03/04.jpg", [36, 290, 758, 754], "drawing"],

  // Ciupercuța and The Line: urban installations for housing estates
  ["ciupercuta", "axonometric", "interventii stradale 04/01.jpg", [0, 0, 1400, 600], "drawing"],
  ["ciupercuta", "before-after", "interventii stradale 04/01.jpg", [80, 640, 1064, 950], "drawing"],
  ["ciupercuta", "drawings", "interventii stradale 04/01.jpg", [78, 955, 1342, 1315], "drawing"],
  ["ciupercuta", "the-line", "interventii stradale 04/02.jpg", null, "drawing"],

  // About
  ["about", "portrait", `${P}/Portofoliu2.jpg`, [40, 40, 475, 480], "image"],
];

const open = (input) => sharp(input, { limitInputPixels: false });

const run = async () => {
  const manifest = {};
  for (const [slug, name, src, crop, kind] of jobs) {
    const file = path.join(RAW, src);
    const meta = await open(file).metadata();
    let buf = await open(file).rotate().toBuffer();
    if (crop) {
      const s = Math.max(meta.width, meta.height) / 1400;
      const [x0, y0, x1, y1] = crop.map((v) => Math.round(v * s));
      const left = Math.max(0, x0);
      const top = Math.max(0, y0);
      buf = await open(buf)
        .extract({ left, top, width: Math.min(meta.width, x1) - left, height: Math.min(meta.height, y1) - top })
        .toBuffer();
    }
    // Drop the white page margin so drawings sit on the site's own ground.
    if (kind === "drawing") buf = await open(buf).trim({ background: "#ffffff", threshold: 18 }).toBuffer();
    const max = kind === "drawing" ? 3200 : 2400;
    const out = path.join(OUT, slug, `${name}.jpg`);
    await fs.mkdir(path.dirname(out), { recursive: true });
    // sharp writes no EXIF/XMP/IPTC unless asked; colour is converted to sRGB.
    const info = await open(buf)
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .toColourspace("srgb")
      .jpeg({
        quality: kind === "drawing" ? 88 : 80,
        mozjpeg: true,
        chromaSubsampling: kind === "drawing" ? "4:4:4" : "4:2:0",
      })
      .toFile(out);
    const blur = await open(out).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    manifest[`${slug}/${name}`] = {
      src: `/work/${slug}/${name}.jpg`,
      width: info.width,
      height: info.height,
      blur: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    console.log(`${slug}/${name}\t${info.width}x${info.height}\t${(info.size / 1024).toFixed(0)}KB`);
  }
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
};

run();
