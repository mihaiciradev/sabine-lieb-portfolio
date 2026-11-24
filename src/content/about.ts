// Public profile drawn from the CV and the "Despre mine" page of the portfolio.
// Phone, home address, email and postgraduate study are deliberately left out.
import { resolve, type Lang, type Loc } from "@/i18n";

type Entry = { period: string; title: string; place: string; note?: string };

type About = {
  statement: string[];
  practice: string[];
  interests: string;
  education: Entry[];
  experience: Entry[];
  recognition: { year: string; title: string }[];
  publication: { year: string; title: string; venue: string };
  tools: string[];
  languages: string[];
};

const content: Loc<About> = {
  statement: [
    {
      ro: "Activitatea mea în arhitectură este orientată spre cercetare, spre înțelegerea spațiului și a contextului antropologic în care se dezvoltă mediul construit.",
      en: "My work leans toward research: understanding space and the human context in which the built environment grows.",
    },
    {
      ro: "Abordez proiectarea nu doar prin rigoare tehnică, ci și dintr-o perspectivă intuitivă, sensibilă la emoțiile pe care le generează un spațiu, la atmosfera locului și la modul în care oamenii percep și trăiesc un mediu.",
      en: "I approach design with technical rigour, and with attention to what a space makes people feel: the atmosphere of a place, how it is perceived and lived in.",
    },
  ],
  practice: [
    {
      ro: "Sabine Lieb este arhitect în Timișoara, absolventă a Facultății de Arhitectură și Urbanism a Universității Politehnica Timișoara (2026). Portofoliul reunește proiecte de arhitectură culturală, educațională, medicală și de restaurare, de la o filarmonică hibridă și un pavilion expozițional itinerant până la un muzeu de artă contemporană într-un parc și refuncționalizarea unui turn de veghe.",
      en: "Sabine Lieb is an architect in Timișoara and a graduate of the Faculty of Architecture and Urbanism at Politehnica University of Timișoara (2026). The portfolio gathers cultural, educational, healthcare and restoration projects, from a hybrid philharmonic and a travelling exhibition pavilion to a contemporary art museum in a park and the reuse of a coastal watchtower.",
    },
    {
      ro: "Experiența din teren, care include practică în birouri de proiectare, intervenții pe patrimoniu, ateliere de meșteșug și digitalizare prin scanare laser 3D, a conturat o metodologie care îmbină precizia tehnică cu o lectură atentă a contextului uman și istoric.",
      en: "Fieldwork in design offices, heritage restoration, craft workshops and 3D laser scanning has shaped a method that joins technical precision with a careful reading of human and historical context.",
    },
  ],
  interests: {
    ro: "Arhitectură conceptuală și dinamici sociale, restaurare și protejarea patrimoniului, studii de restructurare urbană.",
    en: "Conceptual architecture and social dynamics, restoration and heritage protection, and studies of urban restructuring.",
  },
  education: [
    {
      period: "2020–2026",
      title: { ro: "Diplomă de arhitect", en: "Diploma of Architect" },
      place: {
        ro: "Universitatea Politehnica Timișoara, Facultatea de Arhitectură și Urbanism",
        en: "Politehnica University of Timișoara, Faculty of Architecture and Urbanism",
      },
    },
  ],
  experience: [
    {
      period: "2024–2026",
      title: { ro: "Student arhitect", en: "Student architect" },
      place: "Andreescu & Gaivoronschi",
      note: {
        ro: "Proiecte conceptuale, apartamentări, vizite pe șantier, ședințe cu clienți și investitori; implicare în două expoziții de specialitate.",
        en: "Concept design, apartment layouts, site visits, client and investor meetings; two architecture exhibitions.",
      },
    },
    {
      period: "2026",
      title: { ro: "Practică", en: "Internship" },
      place: "Cyberscanning",
      note: {
        ro: "Scanare laser 3D și fotogrammetrie: procesarea norilor de puncte și modelarea structurilor istorice.",
        en: "3D laser scanning and photogrammetry: processing point clouds and modelling historic structures.",
      },
    },
    {
      period: "2025",
      title: { ro: "Practică", en: "Internship" },
      place: "RD Sign Studio",
      note: {
        ro: "Studiu de fundamentare pentru o procedură de restructurare urbană.",
        en: "Background study for an urban restructuring procedure.",
      },
    },
    {
      period: "2024",
      title: { ro: "Ateliere", en: "Workshops" },
      place: "Dealul Cerului, Fundația Archaeus",
      note: {
        ro: "Atelier de filozofie despre etica spațiului și atelier de tâmplărie alături de meșteri tradiționali.",
        en: "A philosophy workshop on the ethics of space, and traditional carpentry with local craftsmen.",
      },
    },
    {
      period: "2021–2023",
      title: { ro: "Voluntar", en: "Volunteer" },
      place: "Asociația Biserici Înlemnite",
      note: {
        ro: "Școala de restaurare de la biserica de lemn din Povergina, afectată de un incendiu.",
        en: "Restoration school at the fire-damaged wooden church of Povergina.",
      },
    },
  ],
  recognition: [
    { year: "2026", title: { ro: "Anuala de Arhitectură, nominalizare", en: "Architecture Annual, nomination" } },
    { year: "2026", title: { ro: "BETA, nominalizare", en: "BETA, nomination" } },
    { year: "2024", title: "Reuse Italy, “Reuse the Watchtower”" },
    { year: "2024", title: "UrbanizeHub, „Cartier cu Caracter”, Plumbuita-Tei" },
  ],
  publication: {
    year: "2026",
    title: "The evolution of the philharmonic space and the emergence of multifunctionality in contemporary architecture",
    venue: { ro: "SCSS ARH, Sesiunea de Comunicări Științifice Studențești", en: "SCSS ARH, student scientific session" },
  },
  tools: ["ArchiCAD", "AutoCAD", "SketchUp", "Twinmotion", "Adobe Photoshop, InDesign, Illustrator", { ro: "Scanare laser 3D, nori de puncte", en: "3D laser scanning, point clouds" }],
  languages: [
    { ro: "Română, maternă", en: "Romanian, native" },
    { ro: "Engleză, C1–C2", en: "English, C1–C2" },
    { ro: "Germană, B1–B2", en: "German, B1–B2" },
  ],
};

export const getAbout = (lang: Lang) => resolve<About>(content, lang);
