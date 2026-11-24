export const locales = ["ro", "en"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "ro";

export const isLang = (v: string): v is Lang => (locales as readonly string[]).includes(v);

/** A string in both languages. Content files use it at the leaves. */
export type L = { ro: string; en: string };

/** A content type whose strings may be given in both languages. */
export type Loc<T> = T extends string
  ? T | L
  : T extends number | boolean | null | undefined
    ? T
    : { [K in keyof T]: Loc<T[K]> };

const isL = (v: unknown): v is L =>
  typeof v === "object" && v !== null && "ro" in v && "en" in v && Object.keys(v).length === 2;

/** Picks one language throughout a localized structure. */
export function resolve<T>(value: Loc<T>, lang: Lang): T {
  if (isL(value)) return value[lang] as T;
  if (Array.isArray(value)) return value.map((v) => resolve(v, lang)) as T;
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v as Loc<unknown>, lang)])) as T;
  }
  return value as T;
}

/** Romanian lives at the root, English under /en. */
export function href(lang: Lang, path = "/") {
  if (lang === defaultLang) return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export const ui = {
  ro: {
    skip: "Sari la conținut",
    nav: { work: "Proiecte", studies: "Studii", about: "Despre" },
    role: "Arhitect",
    city: "Timișoara",
    heroLine:
      "Clădiri care protejează un nucleu: o sală de concert într-un foaier translucid, mansarda unei artiste într-o carcasă itinerantă, un turn de piatră lângă un pavilion de sticlă.",
    indexOfWork: "Index proiecte",
    index: "Index",
    projectsCount: (n: number) => `${n} proiecte · 2023–2026`,
    viewProject: "Vezi proiectul",
    next: "Următorul",
    studies: "Studii",
    studiesLead: "Piese mai mici și desenele din spatele clădirilor.",
    sketchbook: "Caiet de schițe",
    scrollSideways: "Derulează lateral",
    about: "Despre",
    experience: "Experiență",
    recognition: "Distincții",
    publication: "Publicație",
    educationTools: "Educație și instrumente",
    tools: "Instrumente",
    languages: "Limbi",
    interests: "Interese",
    facts: { type: "Tip", year: "An", context: "Context", location: "Locație", topics: "Teme" },
    enlarge: "Mărește",
    drawing: "Desen",
    fit: "Încadrează",
    fullSize: "Mărime reală",
    close: "Închide",
    viewport: "Zona desenului, derulează pentru a te deplasa",
    floor: "Nivel",
    plan: "Plan",
    section: "Secțiune",
    scrollToCut: (label: string) => `derulează pentru a tăia după ${label}`,
    model: {
      label: "Model liniar al pavilionului, care se rotește. Folosește săgețile stânga și dreapta pentru a-l roti.",
      hint: "Model liniar. Trage sau folosește săgețile",
      fallback: "Axonometrie explodată",
      attic: "mansarda",
      apart: "Desfă",
      assemble: "Asamblează",
    },
    modelText: ["O carcasă în jurul unei camere. Pereții exteriori înclinați poartă structura; în interiorul lor, ", "mansarda", " este refăcută la dimensiunile originale."],
    navigator: "Navigare pe pagină",
    sections: "Secțiuni",
    motion: "Animații",
    on: "Pornite",
    off: "Oprite",
    language: "Limbă",
    footer: {
      practice: "Practică",
      based: "Sediu",
      sheet: "Planșă",
      sheetValue: "Portofoliu",
      period: "Perioadă",
      projects: "Proiecte",
      credit:
        "Desene și randări © Sabine Lieb, dacă nu se menționează altfel. Proiecte academice și de concurs, Facultatea de Arhitectură și Urbanism, Universitatea Politehnica Timișoara.",
    },
    notFound: { title: "Nu e pe această planșă.", back: "Înapoi la index" },
    chapters: { cover: "Copertă", overview: "Prezentare", next: "Următorul proiect", cut: "Plan → secțiune", model: "Model 3D", start: "Început" },
  },
  en: {
    skip: "Skip to content",
    nav: { work: "Work", studies: "Studies", about: "About" },
    role: "Architect",
    city: "Timișoara",
    heroLine:
      "Buildings that hold a core: a concert hall inside a translucent foyer, an artist’s attic inside a travelling shell, a stone tower beside a glass pavilion.",
    indexOfWork: "Index of work",
    index: "Index",
    projectsCount: (n: number) => `${n} projects · 2023–2026`,
    viewProject: "View project",
    next: "Next",
    studies: "Studies",
    studiesLead: "Smaller pieces and the drawings behind the buildings.",
    sketchbook: "Sketchbook",
    scrollSideways: "Scroll sideways",
    about: "About",
    experience: "Experience",
    recognition: "Recognition",
    publication: "Publication",
    educationTools: "Education & tools",
    tools: "Tools",
    languages: "Languages",
    interests: "Interests",
    facts: { type: "Type", year: "Year", context: "Context", location: "Location", topics: "Topics" },
    enlarge: "Enlarge",
    drawing: "Drawing",
    fit: "Fit to screen",
    fullSize: "Full size",
    close: "Close",
    viewport: "Drawing viewport, scroll to pan",
    floor: "Floor",
    plan: "Plan",
    section: "Section",
    scrollToCut: (label: string) => `scroll to cut along ${label}`,
    model: {
      label: "Rotating line model of the pavilion. Use the left and right arrow keys to turn it.",
      hint: "Line model. Drag or use arrow keys to turn",
      fallback: "Exploded axonometric",
      attic: "attic room",
      apart: "Take apart",
      assemble: "Assemble",
    },
    modelText: ["A shell around a room. The tapered outer walls carry the structure; inside them, the ", "attic", " is rebuilt at its original size."],
    navigator: "Page navigation",
    sections: "Sections",
    motion: "Motion",
    on: "On",
    off: "Off",
    language: "Language",
    footer: {
      practice: "Practice",
      based: "Based",
      sheet: "Sheet",
      sheetValue: "Portfolio",
      period: "Period",
      projects: "Projects",
      credit:
        "Drawings and renderings © Sabine Lieb unless noted. Academic and competition work, Faculty of Architecture and Urbanism, Politehnica University of Timișoara.",
    },
    notFound: { title: "Not on this sheet.", back: "Back to the index" },
    chapters: { cover: "Cover", overview: "Overview", next: "Next project", cut: "Plan → section", model: "3D model", start: "Start" },
  },
};

export type Dict = (typeof ui)["ro"];
