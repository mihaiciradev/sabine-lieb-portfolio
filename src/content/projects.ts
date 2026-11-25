import { resolve, type Lang, type Loc } from "@/i18n";
import type { ImageKey } from "./img";

export type Fig = {
  image: ImageKey;
  alt: string;
  caption?: string;
  /** Plans, sections and diagrams: higher quality, on paper, zoomable. */
  drawing?: boolean;
};

export type Block =
  | { type: "lead"; text: string }
  | { type: "text"; title: string; body: string[] }
  | { type: "themes"; title: string; items: { title: string; body: string }[] }
  | { type: "figure"; fig: Fig; layout: "bleed" | "wide" | "inset" }
  | { type: "pair"; figs: [Fig, Fig] }
  | { type: "row"; figs: Fig[] }
  | { type: "planSection"; plan: Fig; section: Fig; cut: number; label: string }
  | { type: "floors"; title: string; floors: { label: string; fig: Fig }[] }
  | { type: "slats"; fig: Fig }
  | { type: "model" };

export type Project = {
  slug: string;
  number: string;
  title: string;
  original: string;
  kind: string;
  year: number;
  studio: string;
  location: string;
  topics: string[];
  summary: string;
  /** Longer description for search engines and social cards. */
  description: string;
  note?: string;
  cover: Fig;
  blocks: Block[];
};

const content: Loc<Project>[] = [
  {
    slug: "filarmonica-banatul",
    number: "01",
    title: { ro: "Filarmonica Banatul", en: "Banatul Philharmonic" },
    original: { ro: "Banatul Philharmonic", en: "Filarmonica Banatul" },
    kind: { ro: "Sală de concert", en: "Concert hall" },
    year: 2026,
    studio: { ro: "Proiect de diplomă", en: "Diploma project" },
    location: "Timișoara, RO",
    topics: [
      { ro: "Cultură", en: "Culture" },
      { ro: "Multifuncționalitate", en: "Multifunctionality" },
      { ro: "Spațiu public", en: "Public space" },
    ],
    summary: {
      ro: "O filarmonică hibridă pentru Timișoara: o sală de concert opacă din beton, protejată de un înveliș public translucid, ridicată pe o platformă unde se întâlnesc trei țesuturi urbane.",
      en: "A hybrid philharmonic for Timișoara: an opaque concrete hall held inside a translucent public shell, raised on a platform where three city fabrics meet.",
    },
    description: {
      ro: "Proiect de diplomă de arhitectură, Timișoara 2026: Filarmonica Banatul, o filarmonică hibridă și multifuncțională cu parter public deschis, sală mare adaptabilă acustic, sală de recital, studiouri și restaurant. Planuri, secțiuni, diagrame conceptuale și randări.",
      en: "Architecture diploma project, Timișoara 2026: Banatul Philharmonic, a hybrid, multifunctional concert hall with an open public ground floor, an acoustically adaptable great hall, recital hall, studios and restaurant. Plans, sections, concept diagrams and renderings.",
    },
    note: { ro: "Nominalizare, Anuala de Arhitectură 2026", en: "Nominated, Architecture Annual 2026" },
    cover: {
      image: "filarmonica/cover",
      alt: {
        ro: "Volumul translucid, ușor plisat, al filarmonicii, ridicat deasupra unei platforme largi în trepte; oameni traversează o piață pavată, udă de ploaie.",
        en: "Translucent, softly pleated glass volume of the philharmonic rising above a wide stepped platform, people crossing a wet stone plaza in front.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Sălile de concert tradiționale sunt vulnerabile economic. Aceasta rămâne deschisă toată ziua: parterul este o dală urbană permeabilă, cu cafenele, restaurant, librărie, galerii și un centru educațional, care generează un flux continuu de vizitatori și venituri în afara biletelor.",
          en: "Traditional concert halls are economically fragile. This one stays open all day: the ground floor is a permeable urban slab with cafés, a restaurant, a bookshop, galleries and an education centre, bringing a steady flow of visitors and income beyond ticket sales.",
        },
      },
      {
        type: "figure",
        layout: "bleed",
        fig: {
          image: "filarmonica/park",
          alt: {
            ro: "Filarmonica văzută din parc la amurg, învelișul de sticlă luminat deasupra unui arc lung de beton care încadrează o intrare inferioară.",
            en: "The philharmonic seen from the park at dusk, its glass shell glowing above a long concrete arch that frames a lower entrance.",
          },
          caption: { ro: "Dinspre parc. Platforma publică se arcuiește peste o intrare inferioară.", en: "From the park. The public platform arches over a lower entrance." },
        },
      },
      {
        type: "text",
        title: { ro: "Amplasament", en: "Site" },
        body: [
          {
            ro: "Situl se află la intersecția a trei țesuturi urbane contrastante: zona de vile, blocurile dense și Iulius Mall, într-un nod important de mobilitate.",
            en: "The site sits where three contrasting fabrics meet: a district of villas, dense housing blocks and the Iulius Mall, at a major mobility node.",
          },
          {
            ro: "Pentru a tampona traficul, spațiul public este ridicat pe o platformă de protecție. Expusă din patru traiectorii majore, clădirea elimină fațadele secundare; toate fronturile sunt tratate unitar și percepute dinamic.",
            en: "To buffer the traffic, the public space is lifted onto a protective platform. Seen from four main approaches, the building has no secondary façades; every front is treated as one surface, read in motion.",
          },
        ],
      },
      {
        type: "pair",
        figs: [
          {
            image: "filarmonica/site",
            alt: {
              ro: "Plan de încadrare: filarmonica, marcată cu roșu, la joncțiunea dintre zona de vile, blocurile de locuințe și un mall.",
              en: "Figure-ground site plan: the philharmonic, marked in red, at a junction between a villa district, slab housing and a large mall.",
            },
            caption: { ro: "Plan de încadrare", en: "Site plan" },
            drawing: true,
          },
          {
            image: "filarmonica/massing",
            alt: {
              ro: "Machetă volumetrică aeriană în gri, cu filarmonica în roșu translucid, volumul rotit coborând în trepte spre platformă.",
              en: "Aerial massing model in grey with the philharmonic in translucent red, its rotated volume stepping down to the platform.",
            },
            caption: { ro: "Volumetrie în context", en: "Massing in context" },
          },
        ],
      },
      {
        type: "themes",
        title: { ro: "Patru direcții", en: "Four themes" },
        items: [
          {
            title: { ro: "Percepție multiplă", en: "Multiple perception" },
            body: {
              ro: "Volumul simetric inițial este rotit și articulat sub presiunea vectorilor urbani, generând curbe, pliuri și colțuri dinamice.",
              en: "A symmetric volume is rotated and articulated under the pressure of urban vectors, producing curves, folds and moving corners.",
            },
          },
          {
            title: { ro: "Sâmbure și înveliș", en: "Core and shell" },
            body: {
              ro: "Sala mare de concert este o incintă autonomă din beton, izolată de exterior prin foaierul-tampon.",
              en: "The great hall is an autonomous concrete enclosure, insulated from the outside by a buffer foyer.",
            },
          },
          {
            title: { ro: "Transparență și opacitate", en: "Transparency and opacity" },
            body: {
              ro: "Zonele publice sunt complet transparente și curbate spre oraș, în timp ce nucleul acustic rămâne masiv și opac.",
              en: "Public zones are fully transparent and curve toward the city; the acoustic core stays massive and opaque.",
            },
          },
          {
            title: { ro: "Continuitatea spațiului public", en: "Continuous public space" },
            body: {
              ro: "Filarmonica acționează ca o interfață și un nod de legătură între țesuturile orașului.",
              en: "The philharmonic works as an interface, stitching the surrounding fabrics together.",
            },
          },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "filarmonica/concept",
          alt: {
            ro: "Diagrame conceptuale: pătrate imbricate rotite de vectorii stradă, parc și oraș, apoi temele ca tonuri suprapuse, un nucleu ca inelele unui trunchi, transparențe stratificate și linii în mișcare.",
            en: "Concept diagrams: nested squares rotated by street, park and city vectors, then the themes drawn as overlapping tones, a tree-ring core, layered transparency and sweeping lines.",
          },
          caption: {
            ro: "Scheme conceptuale: nucleul pătrat rotit de oraș și temele limbajului arhitectural.",
            en: "Concept diagrams: the square core rotated by the city, and the themes of the architectural language.",
          },
          drawing: true,
        },
      },
      {
        type: "planSection",
        label: "S-02",
        cut: 0.341,
        plan: {
          image: "filarmonica/plan-ground",
          alt: {
            ro: "Plan parter: sala ovală în centru, foaiere, expoziție temporară, cafenea, bibliotecă și magazin de muzică în jur, arcul platformei dedesubt.",
            en: "Ground floor plan: the oval hall in the centre, foyers, temporary exhibition, café, library and music shop around it, the platform arch below.",
          },
          caption: { ro: "Plan parter", en: "Ground floor" },
          drawing: true,
        },
        section: {
          image: "filarmonica/section-cross",
          alt: {
            ro: "Secțiunea S-02 prin sala mare: orga, baldachinul acustic suspendat, balcoanele, sala de recital dedesubt și două niveluri de parcare.",
            en: "Cross section S-02 through the great hall, showing the organ, suspended acoustic canopy, balconies, recital hall beneath and two parking levels.",
          },
          caption: { ro: "Secțiunea S-02", en: "Section S-02" },
          drawing: true,
        },
      },
      {
        type: "figure",
        layout: "bleed",
        fig: {
          image: "filarmonica/hall",
          alt: {
            ro: "Sala mare în lemn cald: orchestra pe scenă, orga în spate, balcoane curbe și petale acustice mari din lemn deasupra.",
            en: "The great hall in warm timber: an orchestra on stage, the organ behind, curved balconies and large wooden acoustic petals overhead.",
          },
          caption: {
            ro: "Sala mare. Camerele de reverberație cu porți acustice pot crește volumul sălii cu până la 30%, de la muzică simfonică la jazz, concerte amplificate sau conferințe.",
            en: "Great hall. Reverberation chambers with acoustic doors can enlarge the room's volume by up to 30%, tuning it from symphonic music to jazz, amplified concerts or conferences.",
          },
        },
      },
      {
        type: "floors",
        title: { ro: "Planuri", en: "Plans" },
        floors: [
          { label: "−1", fig: { image: "filarmonica/plan-basement", alt: { ro: "Plan subsol cu sala de recital, săli de repetiții, expoziția permanentă și foaierul.", en: "Basement plan with the recital hall, rehearsal rooms, permanent exhibition and foyer." }, caption: { ro: "Nivelul −1", en: "Level −1" }, drawing: true } },
          { label: "0", fig: { image: "filarmonica/plan-ground", alt: { ro: "Plan parter cu sala, foaierele și programul public.", en: "Ground floor plan with the hall, foyers and public program." }, caption: { ro: "Parter", en: "Ground floor" }, drawing: true } },
          { label: "1", fig: { image: "filarmonica/plan-1", alt: { ro: "Plan etaj 1 cu parterul sălii, depozitul de instrumente și atelierele.", en: "First floor plan with the stalls, instrument storage and workshops." }, caption: { ro: "Etajul 1", en: "Level 1" }, drawing: true } },
          { label: "2", fig: { image: "filarmonica/plan-2", alt: { ro: "Plan etaj 2 cu balcoanele din jurul sălii și studiourile individuale.", en: "Second floor plan with balconies wrapping the hall and individual study rooms." }, caption: { ro: "Etajul 2", en: "Level 2" }, drawing: true } },
          { label: "3", fig: { image: "filarmonica/plan-3", alt: { ro: "Plan etaj 3 cu balcoanele superioare, birouri, bar și lounge VIP.", en: "Third floor plan with upper balconies, offices, bar and VIP lounge." }, caption: { ro: "Etajul 3", en: "Level 3" }, drawing: true } },
          { label: "4", fig: { image: "filarmonica/plan-4", alt: { ro: "Plan etaj 4 cu partea superioară a sălii și un restaurant orientat spre oraș.", en: "Fourth floor plan with the top of the hall and a restaurant facing the city." }, caption: { ro: "Etajul 4", en: "Level 4" }, drawing: true } },
        ],
      },
      {
        type: "pair",
        figs: [
          {
            image: "filarmonica/foyer",
            alt: { ro: "Foaier din beton cu o scară albă sculpturală care urcă printr-un oculus.", en: "Concrete foyer with a sculptural white stair rising through an oculus, visitors crossing the polished floor." },
            caption: { ro: "Foaier", en: "Foyer" },
          },
          {
            image: "filarmonica/recital",
            alt: { ro: "Sală de recital placată cu lemn, un pianist pe scenă și rânduri de scaune roșii.", en: "Timber-lined recital hall with a pianist on stage and rows of red seats." },
            caption: { ro: "Sala de recital", en: "Recital hall" },
          },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "filarmonica/section-perspective",
          alt: {
            ro: "Secțiune perspectivă prin întreaga clădire: sala și baldachinul deasupra sălii de recital, foaierele în trepte de-a lungul platformei, parcarea subterană.",
            en: "Perspective section through the whole building: the hall and its canopy above the recital hall, foyers stepping along the platform, parking below ground.",
          },
          caption: { ro: "Secțiune perspectivă", en: "Perspective section" },
          drawing: true,
        },
      },
      {
        type: "row",
        figs: [
          { image: "filarmonica/exhibition", alt: { ro: "Foaier expozițional întunecat cu tavan casetat din beton și vitrine cu instrumente.", en: "Dark exhibition foyer with a coffered concrete ceiling and displays of instruments." }, caption: { ro: "Expoziția permanentă", en: "Permanent exhibition" } },
          { image: "filarmonica/studio", alt: { ro: "Sală-studio lungă cu tavan casetat adânc din lemn, o dansatoare și un pianist în fața unui public mic.", en: "Long studio hall with a deep timber coffered ceiling, a dancer and pianist performing for a small audience." }, caption: { ro: "Sala-studio", en: "Studio hall" } },
          { image: "filarmonica/restaurant", alt: { ro: "Restaurantul de la ultimul etaj în spatele perdelelor translucide, cu stâlpi de beton și mese aranjate.", en: "Restaurant on the top floor behind translucent curtains, concrete columns and set tables." }, caption: { ro: "Restaurant", en: "Restaurant" } },
        ],
      },
      {
        type: "pair",
        figs: [
          { image: "filarmonica/elevation-a", alt: { ro: "Fațadă principală: volumul stratificat de sticlă deasupra arcului platformei.", en: "Front elevation: the layered glass volume over the platform arch." }, caption: { ro: "Fațadă", en: "Elevation" }, drawing: true },
          { image: "filarmonica/section-long", alt: { ro: "Secțiune longitudinală cu etajele superioare în trepte și două niveluri subterane.", en: "Longitudinal section showing the stepped upper floors and two basement levels." }, caption: { ro: "Secțiune longitudinală", en: "Longitudinal section" }, drawing: true },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "filarmonica/detail",
          alt: {
            ro: "Planșă de detaliu: plan mărit al cafenelei, foaierului și atriumului, tipuri de pereți, un nod structural de planșeu casetat și secțiunea fațadei.",
            en: "Detail sheet: enlarged plan of the café, foyer and atrium, wall build-ups, a waffle-slab structural node and the façade section.",
          },
          caption: { ro: "Detaliu: cafenea și foaier, tipuri de pereți, structură și fațadă", en: "Detail: café and foyer plan, wall types, structure and façade build-up" },
          drawing: true,
        },
      },
    ],
  },
  {
    slug: "pavilion-ana-lupas",
    number: "02",
    title: { ro: "Pavilion expozițional Ana Lupaș", en: "Ana Lupaș Exhibition Pavilion" },
    original: { ro: "Ana Lupaș Exhibition Pavilion", en: "Pavilion expozițional Ana Lupaș" },
    kind: { ro: "Pavilion expozițional", en: "Exhibition pavilion" },
    year: 2025,
    studio: { ro: "Anul 5", en: "Year 5" },
    location: { ro: "Itinerant", en: "Travelling" },
    topics: [
      { ro: "Reinterpretare", en: "Reinterpretation" },
      { ro: "Mobilitate", en: "Mobility" },
      { ro: "Modularitate", en: "Modularity" },
    ],
    summary: {
      ro: "Un pavilion modular care duce operele Anei Lupaș către noi publicuri, cu o replică fidelă a mansardei artistei adăpostită într-o carcasă înclinată.",
      en: "A modular pavilion that carries Ana Lupaș's work to new audiences, with a faithful replica of the artist's attic room held inside a tapered shell.",
    },
    description: {
      ro: "Pavilion expozițional modular și itinerant pentru operele artistei Ana Lupaș (anul 5, 2025): o mansardă reconstruită la dimensiunile originale într-o carcasă trunchi-piramidală. Schițe, axonometrie explodată, secțiune perspectivă și model 3D interactiv.",
      en: "Modular, travelling exhibition pavilion for the work of artist Ana Lupaș (Year 5, 2025): an attic room rebuilt at its original size inside a tapered shell. Sketches, exploded axonometric, section perspective and an interactive 3D model.",
    },
    cover: {
      image: "pavilion-ana-lupas/cover",
      alt: {
        ro: "Pavilion înclinat, fără ferestre, pe o peluză dintr-un parc, cu o intrare îngustă la bază și o grilă vitrată pe acoperiș.",
        en: "Tapered, windowless timber pavilion standing in a park lawn, a narrow entrance at its base and a glazed grid on its roof.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Pavilionul este conceput pentru a fi asamblat și dezasamblat cu ușurință, în locații urbane sau naturale, având rolul de a purta operele Anei Lupaș către noi audiențe.",
          en: "The pavilion is built to be assembled and taken down easily, in city squares or in landscape, bringing the work of Ana Lupaș to people who would not otherwise meet it.",
        },
      },
      { type: "model" },
      {
        type: "text",
        title: { ro: "Mansarda", en: "The attic" },
        body: [
          {
            ro: "În centrul propunerii se află recrearea fidelă a spațiului mansardei unuia dintre locurile de expunere ale artistei. Pavilionul este calibrat la dimensiunile exacte ale spațiului original, oferind un cadru autentic, imersiv și intim, în care lucrările își păstrează scala, atmosfera și relația cu privitorul.",
            en: "At its centre is a faithful recreation of the attic in one of the artist's exhibition spaces, built to the original's exact dimensions so the works keep their scale, atmosphere and relation to the viewer.",
          },
          {
            ro: "Accesul nu se face direct, ci printr-un spațiu de tranziție care reinterpretează arhitectura și atmosfera unei mansarde: o zonă de pregătire senzorială și conceptuală, care deconectează vizitatorul de exterior și îl transpune treptat în universul artistei.",
            en: "Visitors do not enter it directly. A transition space reinterprets the architecture and mood of an attic, a zone of sensory and conceptual preparation that disconnects them from the outside and draws them gradually into the artist's world.",
          },
        ],
      },
      {
        type: "pair",
        figs: [
          {
            image: "pavilion-ana-lupas/sketch-mansard",
            alt: { ro: "Schiță în tuș: o cameră cu acoperiș în două ape într-o carcasă înclinată, notată spațiu expozițional și spațiu intermediar „mansardă”.", en: "Pen sketch of a gabled attic room inside a larger tapered shell, labelled exhibition space and intermediate attic space." },
            caption: { ro: "Spațiul expozițional în „mansarda” intermediară", en: "Exhibition space inside the intermediate “attic”" },
            drawing: true,
          },
          {
            image: "pavilion-ana-lupas/sketch-shell",
            alt: { ro: "Schiță în tuș a conturului cu pereți groși hașurați.", en: "Pen sketch of the gabled outline with cross-hatched thick walls." },
            caption: { ro: "Carcasa ca perete gros, locuit", en: "The shell as a thick, inhabited wall" },
            drawing: true,
          },
        ],
      },
      {
        type: "figure",
        layout: "inset",
        fig: {
          image: "pavilion-ana-lupas/studies",
          alt: { ro: "Trei studii liniare de volume trunchi-piramidale cu intrări mici.", en: "Three line studies of tapered volumes with small entrances." },
          caption: { ro: "Studii de volum", en: "Volume studies" },
          drawing: true,
        },
      },
      {
        type: "pair",
        figs: [
          {
            image: "pavilion-ana-lupas/exploded",
            alt: { ro: "Axonometrie explodată: îmbinări metalice, grila acoperișului, tavanul în patru ape, fermele, camera interioară și panourile exterioare depărtate.", en: "Exploded axonometric: steel corner joints, roof grid, hipped ceiling, roof trusses, the inner room, trussed frames and the outer wall panels pulled apart." },
            caption: { ro: "Axonometrie explodată: îmbinări, acoperiș, camera interioară și carcasa", en: "Exploded axonometric: joints, roof, inner room and shell" },
            drawing: true,
          },
          {
            image: "pavilion-ana-lupas/section-perspective",
            alt: { ro: "Secțiune perspectivă: camera albă interioară sub un acoperiș cu ferme, în cadrul exterior înclinat; vizitatori privesc o instalație.", en: "Section perspective: the white inner room under a trussed roof, inside the tapering outer frame; visitors look at an installation behind a railing." },
            caption: { ro: "Secțiune perspectivă", en: "Section perspective" },
            drawing: true,
          },
        ],
      },
      {
        type: "text",
        title: { ro: "Itinerant", en: "Itinerant" },
        body: [
          {
            ro: "Prin natura sa flexibilă și itinerantă, pavilionul transcende limitele unei galerii tradiționale, devenind un spațiu mobil de memorie și expoziție, care poate reactiva operele artistei în contexte urbane extrem de variate.",
            en: "Flexible and travelling, the pavilion goes beyond the limits of a conventional gallery: a mobile space of memory and exhibition that can reactivate the artist's work in very different urban settings.",
          },
        ],
      },
    ],
  },
  {
    slug: "muzeu-paul-neagu",
    number: "03",
    title: { ro: "Muzeu de artă contemporană „Paul Neagu”", en: "Paul Neagu Museum of Contemporary Art" },
    original: { ro: "Paul Neagu Museum of Contemporary Art", en: "Muzeu de artă contemporană „Paul Neagu”" },
    kind: { ro: "Muzeu", en: "Museum" },
    year: 2023,
    studio: { ro: "Anul 3", en: "Year 3" },
    location: "Timișoara, RO",
    topics: [
      { ro: "Cultură", en: "Culture" },
      { ro: "Artă contemporană", en: "Contemporary art" },
      { ro: "Muzeu în parc", en: "Museum in a park" },
    ],
    summary: {
      ro: "Două corpuri în oglindă între o stradă și un parc, cu o fațadă care abstractizează trunchiurile copacilor și un traseu care leagă orașul de grădină.",
      en: "Two mirrored bodies between a street and a park, with a façade that abstracts tree trunks and a route that threads the city into the garden.",
    },
    description: {
      ro: "Muzeu de artă contemporană „Paul Neagu” în Timișoara (anul 3, 2023): două corpuri simetrice între Strada J.H. Pestalozzi și Parcul Regina Maria, cu fațadă inspirată de trunchiurile copacilor, grădină acvatică și pasarelă de sticlă. Schițe, plan de situație, planuri, secțiune și randări.",
      en: "Paul Neagu Museum of Contemporary Art in Timișoara (Year 3, 2023): two symmetric bodies between Strada J.H. Pestalozzi and Parcul Regina Maria, with a façade drawn from tree trunks, a water garden and a glass bridge. Sketches, site plan, plans, section and renderings.",
    },
    cover: {
      image: "muzeu-paul-neagu/aerial",
      alt: {
        ro: "Vedere aeriană a unui muzeu alb, pliat, printre copacii parcului, fațada vitrată întreruptă de stâlpi înclinați ca niște trunchiuri, o piață din lemn în față.",
        en: "Aerial view of a white, folded museum among park trees, its glazed façade broken by slanted trunk-like piers, a timber plaza in front.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Un centru de artă contemporană amplasat strategic între Strada J.H. Pestalozzi și Parcul Regina Maria. Conceptul gravitează în jurul generării unei urbanități distincte la nivelul sitului, al unui traseu de legătură între cele două corpuri și al integrării unor elemente inspirate din natură.",
          en: "A contemporary art centre between Strada J.H. Pestalozzi and Parcul Regina Maria. The concept builds a distinct urbanity on the site, a route linking two bodies, and elements drawn from nature.",
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "muzeu-paul-neagu/sketch",
          alt: { ro: "Schițe în creion cu volume pliate, trapezoidale, cu capete hașurate.", en: "Pencil sketches of folded, trapezoidal volumes with hatched ends, drifting across the page." },
          caption: { ro: "Primele schițe: forme trapezoidale", en: "First sketches: trapezoidal forms" },
          drawing: true,
        },
      },
      {
        type: "slats",
        fig: {
          image: "muzeu-paul-neagu/facade",
          alt: {
            ro: "Curtea de acces a muzeului: vitraje înalte întrerupte de stâlpi albi ramificați ca trunchiuri, vizitatori pe o piață pavată lângă un copac mare.",
            en: "The museum's entrance court: tall glazing broken by white piers that branch like tree trunks, visitors on a cobbled plaza beside a large tree.",
          },
          caption: {
            ro: "Structura și fațada reinterpretează abstract trunchiurile de copaci, întărind legătura conceptuală cu natura.",
            en: "The structure and façade abstract tree trunks, tying the building to the park.",
          },
        },
      },
      {
        type: "text",
        title: { ro: "Amplasament", en: "Site" },
        body: [
          {
            ro: "În zona frontală, o piațetă primitoare se extinde către spațiul public al străzii, facilitând accesul pietonal. În partea posterioară, spațiile verzi și conectarea la vegetația parcului creează o tranziție lină între curtea interioară și natură.",
            en: "At the front, a welcoming plaza extends into the street's public space and eases pedestrian access. At the back, green spaces connect to the park's vegetation and make a gentle transition from the inner courtyard to nature.",
          },
          {
            ro: "O porțiune din curte a fost lăsată liberă de amenajări fixe, ca zonă flexibilă pentru terasa cafenelei sau evenimente în aer liber, spectacole și expoziții. O zonă acvatică amenajată cu vegetație și faună locală (pești, rațe, broaște țestoase) ancorează situl.",
            en: "Part of the courtyard is left free of fixed furniture so it can hold the café terrace or open-air events: concerts and exhibitions. A water garden with local plants and wildlife (fish, ducks, turtles) anchors the site.",
          },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "muzeu-paul-neagu/site",
          alt: { ro: "Plan de situație cu coroane de copaci punctate: cele două corpuri pliate legate de o pasarelă, jardiniere unghiulare spre parc și un bazin.", en: "Site plan drawn with stippled tree canopies: the two folded bodies with a hatched glass link, angular planters toward the park and a pool to one side." },
          caption: { ro: "Plan de situație", en: "Site plan" },
          drawing: true,
        },
      },
      {
        type: "row",
        figs: [
          { image: "muzeu-paul-neagu/plaza", alt: { ro: "Piața din lemn din fața muzeului, cu familii îndreptându-se spre intrare.", en: "Timber plaza in front of the museum with families walking toward the entrance." }, caption: { ro: "Piațeta de acces", en: "Front plaza" } },
          { image: "muzeu-paul-neagu/garden", alt: { ro: "Pasarelă din lemn peste grădina acvatică din spatele muzeului.", en: "Boardwalk crossing the water garden behind the museum." }, caption: { ro: "Grădina acvatică", en: "Water garden" } },
          { image: "muzeu-paul-neagu/passage", alt: { ro: "Pasaj acoperit între cele două corpuri, încadrând parcul.", en: "Covered passage between the two bodies, framing the park beyond." }, caption: { ro: "Spațiul intermediar", en: "The intermediate space" } },
        ],
      },
      {
        type: "text",
        title: { ro: "Două corpuri", en: "Two bodies" },
        body: [
          {
            ro: "Din punct de vedere volumetric, ansamblul este format din două corpuri simetrice, dispuse în oglindă. Accesul principal în ambele volume se realizează din spațiul intermediar creat între acestea.",
            en: "The ensemble is formed by two symmetric bodies set in mirror. The main entrances to both are from the space created between them.",
          },
          {
            ro: "Parterul găzduiește funcțiunile dinamice și publice: un spațiu multifuncțional, o zonă educațională, birouri de cercetare, reședințe artistice și cafeneaua. Etajul este dedicat spațiilor expoziționale, conectate printr-o pasarelă de sticlă.",
            en: "The ground floor holds the dynamic, public program: a multipurpose space, an education area, research offices, artist residencies and the café. The upper floor is given to exhibition, its two halves linked by a glass bridge.",
          },
        ],
      },
      {
        type: "pair",
        figs: [
          { image: "muzeu-paul-neagu/plan-ground", alt: { ro: "Plan parter al celor două corpuri pliate, în oglindă.", en: "Ground floor plan of the two mirrored, folded bodies." }, caption: { ro: "Plan parter", en: "Ground floor" }, drawing: true },
          { image: "muzeu-paul-neagu/plan-1", alt: { ro: "Plan etaj cu sălile expoziționale și pasarela de sticlă.", en: "First floor plan with the exhibition halls and the glass bridge." }, caption: { ro: "Plan etaj 1", en: "First floor" }, drawing: true },
        ],
      },
      {
        type: "figure",
        layout: "bleed",
        fig: {
          image: "muzeu-paul-neagu/foyer",
          alt: { ro: "Foaier luminos cu un pian pe o insulă plantată, stâlpi-trunchi încadrând copacii de afară.", en: "Bright foyer with a grand piano on a planted island, trunk-like piers framing the trees outside." },
          caption: { ro: "Foaier", en: "Foyer" },
        },
      },
      {
        type: "pair",
        figs: [
          { image: "muzeu-paul-neagu/cafe", alt: { ro: "Cafenea cu fotolii roșii, tejghea din marmură și jardiniere.", en: "Café with red armchairs, marble counter and planters." }, caption: { ro: "Cafenea", en: "Café" } },
          { image: "muzeu-paul-neagu/gallery", alt: { ro: "Galeria de la etaj cu o sculptură din oțel ruginiu între stâlpi ramificați.", en: "Upper gallery with a rust-coloured steel sculpture between branching piers." }, caption: { ro: "Galeria de la etaj", en: "Upper gallery" } },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "muzeu-paul-neagu/section",
          alt: { ro: "Secțiune lungă prin ambele corpuri, cu vitrajul dublu-înalt desenat cu forme de trunchiuri.", en: "Long section through both bodies showing the double-height glazing traced with trunk shapes." },
          caption: { ro: "Secțiune", en: "Section" },
          drawing: true,
        },
      },
    ],
  },
  {
    slug: "rezidenta-turn-de-veghe",
    number: "04",
    title: { ro: "Rezidență artistică într-un turn de veghe", en: "Artist Residency in a Watchtower" },
    original: { ro: "Artist Residency in a Watchtower", en: "Rezidență artistică" },
    kind: { ro: "Restaurare și refuncționalizare", en: "Restoration and reuse" },
    year: 2024,
    studio: { ro: "Concurs Reuse Italy", en: "Reuse Italy competition" },
    location: { ro: "Lângă Napoli, IT", en: "Near Naples, IT" },
    topics: [
      { ro: "Restaurare", en: "Restoration" },
      { ro: "Refuncționalizare", en: "Re-functioning" },
      { ro: "Rezidență artistică", en: "Artist residency" },
    ],
    summary: {
      ro: "Un turn de veghe de pe coastă, restaurat ca rezidență artistică: spații comune în turnul de piatră, dormitoare într-un pavilion de sticlă așezat jos, în pantă.",
      en: "A coastal watchtower restored as an artist residency: shared rooms in the stone tower, sleeping quarters in a glass pavilion set low into the slope.",
    },
    description: {
      ro: "Propunere pentru concursul Reuse Italy „Reuse the Watchtower” (2024): restaurarea și refuncționalizarea unui turn de veghe de pe coasta din apropierea orașului Napoli ca rezidență artistică, cu un pavilion nou de dormitoare. Axonometrie, secțiune, plan și randări de interior.",
      en: "Entry to the Reuse Italy “Reuse the Watchtower” competition (2024): restoring a coastal watchtower near Naples as an artist residency, with a new sleeping pavilion. Axonometric, section, plan and interior renderings.",
    },
    cover: {
      image: "rezidenta-turn-de-veghe/site",
      alt: {
        ro: "Fotografie aeriană a unui promontoriu calcaros deasupra mării, cu un turn pătrat din piatră pe marginea falezei.",
        en: "Aerial photograph of a limestone headland over a grey sea, a square stone watchtower on the cliff edge.",
      },
      caption: { ro: "Turnul pe promontoriu. Fotografie a sitului.", en: "The tower on its headland. Site photograph." },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Propunere pentru concursul Reuse Italy „Reuse the Watchtower”. Turnul istoric își păstrează masa și perspectivele; programul nou se adaugă alături, ușor, de-a lungul curbei de nivel a falezei.",
          en: "An entry to the Reuse Italy “Reuse the Watchtower” competition. The historic tower keeps its mass and its views; new program is added beside it, lightly, along the contour of the cliff.",
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "rezidenta-turn-de-veghe/axonometric",
          alt: { ro: "Axonometrie liniară a promontoriului: turnul pe faleză, o scară spre o terasă inferioară și pavilionul cu acoperiș plat în pantă.", en: "Line axonometric of the headland: the tower on the cliff, a stair down to a lower terrace and the flat-roofed pavilion set into the slope behind." },
          caption: { ro: "Axonometrie", en: "Axonometric" },
          drawing: true,
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "rezidenta-turn-de-veghe/section",
          alt: { ro: "Secțiune de la mare în sus pe pantă: turnul cu încăperi boltite, o masă de dining sus și o cameră cu pian jos, pavilionul mai sus pe deal.", en: "Section from the sea up the slope: the tower with vaulted rooms, a dining table above and a piano room below, the pavilion further up the hill." },
          caption: { ro: "Secțiune prin turn și pantă", en: "Section through tower and slope" },
          drawing: true,
        },
      },
      {
        type: "figure",
        layout: "bleed",
        fig: {
          image: "rezidenta-turn-de-veghe/interior",
          alt: { ro: "Încăpere cu pereți de piatră în turn, cu o masă lungă din lemn, lămpi de sticlă și o fereastră adâncă spre mare.", en: "Stone-walled room in the tower with a long timber table, glass pendant lamps and a deep window opening onto the sea." },
          caption: { ro: "Spațiu comun în turn", en: "Shared room in the tower" },
        },
      },
      {
        type: "pair",
        figs: [
          {
            image: "rezidenta-turn-de-veghe/plan",
            alt: { ro: "Planul pavilionului, 13,5 pe 12 metri: șase dormitoare și trei băi în jurul unei bucătării comune și a unui living, plus spălătorie.", en: "Pavilion plan, 13.5 by 12 metres: six bedrooms and three bathrooms around a central communal kitchen and living space, with a laundry room." },
            caption: { ro: "Plan pavilion: șase dormitoare în jurul bucătăriei și livingului comun", en: "Pavilion plan: six bedrooms around a communal kitchen and living space" },
            drawing: true,
          },
          {
            image: "rezidenta-turn-de-veghe/bedroom",
            alt: { ro: "Dormitor în pavilion, cu vitraj pe toată înălțimea spre mare, perdele gri și un birou.", en: "Bedroom in the pavilion with full-height glazing onto the sea, grey curtains and a desk." },
            caption: { ro: "Dormitor cu vedere spre mare", en: "Bedroom facing the sea" },
          },
        ],
      },
    ],
  },
  {
    slug: "scoala-lipovei",
    number: "05",
    title: { ro: "Școală generală în Lipovei", en: "General School in Lipovei" },
    original: { ro: "General School in Lipovei", en: "Școală generală în Lipovei" },
    kind: { ro: "Școală", en: "School" },
    year: 2025,
    studio: { ro: "Anul 5", en: "Year 5" },
    location: "Timișoara, RO",
    topics: [
      { ro: "Educație", en: "Education" },
      { ro: "Parc", en: "Park" },
    ],
    summary: {
      ro: "O școală a cărei organizare pe verticală urmează parcursul elevilor, cu holuri și curte transformate într-un „al treilea spațiu” de învățare în jurul unei biblioteci-nucleu.",
      en: "A school whose vertical organisation follows the pupils' path through it, with corridors and courtyard turned into a third learning space around a library core.",
    },
    description: {
      ro: "Școală generală în parc, în zona Lipovei din Timișoara (anul 5, 2025): învățare extinsă în holuri și curtea interioară, bibliotecă pe două niveluri în atrium, sală de sport deschisă comunității. Schițe, planuri, secțiune și randări.",
      en: "General school in a park in the Lipovei area of Timișoara (Year 5, 2025): extended learning in halls and an inner courtyard, a two-level library in the atrium, a sports hall open to the community. Sketches, plans, section and renderings.",
    },
    cover: {
      image: "scoala-lipovei/cover",
      alt: {
        ro: "Școală lungă, cu trei niveluri, într-o pajiște, fațadă deschisă la culoare cu ferestre încadrate în galben și roșu, copii jucându-se pe un teren de sport roșu.",
        en: "Long three-storey school in a meadow, pale façade with windows framed in yellow and red, children playing on a red sports court.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Conceptul gravitează în jurul ideii de învățare extinsă: curtea interioară și spațiul holurilor devin un veritabil „al treilea spațiu”, o componentă educațională și socială esențială.",
          en: "The concept is extended learning: the inner courtyard and the halls become a genuine “third space”, as important educationally and socially as the classroom.",
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "scoala-lipovei/sketches",
          alt: { ro: "Schițe în pix albastru: holuri curbe, o fereastră de bibliotecă, gradene și bănci, plus o diagramă cu blocuri hașurate deplasate pe săgeți.", en: "Blue pen sketches of curved corridors, a library window, stepped seating and benches, with a diagram of hatched blocks moving along arrows." },
          caption: { ro: "Schițe", en: "Sketches" },
          drawing: true,
        },
      },
      {
        type: "text",
        title: { ro: "Al treilea spațiu", en: "Third space" },
        body: [
          {
            ro: "Holurile își depășesc funcția strictă de circulație și devin zone ample de relaxare, joacă și interacțiune. Aceste spații intermediare reduc tensiunea și aglomerația din pauze, încurajând comunicarea spontană și dezvoltarea personală a elevilor.",
            en: "Halls go beyond circulation and become generous areas for rest, play and interaction. They ease tension and crowding during breaks and encourage spontaneous conversation.",
          },
          {
            ro: "Curtea interioară funcționează ca o extensie în aer liber a acestor activități, asigurând o tranziție lină între interior și mediul natural înconjurător.",
            en: "The courtyard carries these activities outdoors, a smooth transition between inside and the surrounding landscape.",
          },
        ],
      },
      {
        type: "figure",
        layout: "bleed",
        fig: {
          image: "scoala-lipovei/courtyard",
          alt: { ro: "Curte interioară plantată cu o alee de pietriș spre o aripă-pasarelă vitrată, cu benzi roșii, elevi pe trepte.", en: "Planted inner courtyard with a gravel path leading to a glazed bridge wing banded in red, pupils on steps beneath." },
          caption: { ro: "Curtea interioară", en: "Inner courtyard" },
        },
      },
      {
        type: "pair",
        figs: [
          { image: "scoala-lipovei/library", alt: { ro: "Bibliotecă pe două niveluri în atrium, sub un luminator rotund, cu o scară spirală între etaje.", en: "Two-level library in the atrium under a round skylight, with a spiral stair between floors." }, caption: { ro: "Biblioteca", en: "Library" } },
          { image: "scoala-lipovei/library-stair", alt: { ro: "Biblioteca văzută de sus: scară din lemn, nișe de lectură și balustradă de sticlă.", en: "Library seen from above: timber stair, reading niches and a glass balustrade." }, caption: { ro: "Nucleul bibliotecii", en: "The library core" } },
        ],
      },
      {
        type: "text",
        title: { ro: "Biblioteca", en: "The library" },
        body: [
          {
            ro: "În centrul compoziției se află corpul bibliotecii, proiectat ca nucleu vizual și funcțional al întregii clădiri. Desfășurată pe două niveluri în cadrul atriumului central, biblioteca devine inima școlii, un simbol al cunoașterii și al introspecției, cu o legătură vizuală și fizică directă între atrium și holuri.",
            en: "At the centre of the composition is the library, the school's visual and functional core. Spread over two levels in the central atrium, it is the heart of the building, a symbol of knowledge and introspection, with a direct visual and physical link to the atrium and halls.",
          },
          {
            ro: "Clădirea este poziționată în partea de nord a sitului, formând o barieră vizuală și fonică față de zona industrială din apropiere, cu expunere sudică pentru sălile de clasă și deschidere directă către parc.",
            en: "The building sits on the north of the site as a visual and acoustic barrier to the nearby industrial zone, giving classrooms a southern exposure and direct access to the park.",
          },
        ],
      },
      {
        type: "pair",
        figs: [
          { image: "scoala-lipovei/site", alt: { ro: "Plan de situație: școala pe latura nordică, terenul de sport și un parc mare plantat spre sud.", en: "Site plan: the school along the north edge, sports court and a large planted park to the south." }, caption: { ro: "Plan de situație", en: "Site plan" }, drawing: true },
          { image: "scoala-lipovei/plan-ground", alt: { ro: "Plan parter: aripi de clase în jurul a două curți, sala de sport la vest, cantina și administrația la est.", en: "Ground floor plan: classroom wings around two courtyards, the gym to the west, canteen and administration to the east." }, caption: { ro: "Plan parter", en: "Ground floor" }, drawing: true },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "scoala-lipovei/section",
          alt: { ro: "Secțiune lungă: sala de sport dublu-înaltă, atriumul bibliotecii cu scara, curți cu copaci și trei niveluri de clase.", en: "Long section: the double-height gym, the library atrium with its stair, courtyards with trees and three classroom levels." },
          caption: { ro: "Secțiune", en: "Section" },
          drawing: true,
        },
      },
      {
        type: "row",
        figs: [
          { image: "scoala-lipovei/classroom", alt: { ro: "Sală de clasă din beton cu un vitraj pe toată lățimea spre parc.", en: "Concrete classroom with a full-width window onto the park." }, caption: { ro: "Sală de clasă", en: "Classroom" } },
          { image: "scoala-lipovei/canteen", alt: { ro: "Cantină dublu-înaltă cu mese rotunde din lemn și lampioane de hârtie.", en: "Double-height canteen with round timber tables and paper lanterns." }, caption: { ro: "Cantina", en: "Canteen" } },
          { image: "scoala-lipovei/gym", alt: { ro: "Sală de sport cu pardoseală roșie, pereți din lemn și vitraje înalte.", en: "Sports hall with a red floor, timber walls and high clerestory glazing." }, caption: { ro: "Sala de sport, deschisă cartierului", en: "Sports hall, open to the neighbourhood" } },
        ],
      },
      {
        type: "figure",
        layout: "inset",
        fig: {
          image: "scoala-lipovei/plans-upper",
          alt: { ro: "Plan subsol cu sala de sport și planurile etajelor cu clase în jurul atriumului.", en: "Basement plan with the sports hall and upper floor plans with classrooms around the atrium." },
          caption: {
            ro: "Subsol, etajul 1 și etajul 2. Parterul concentrează administrația, cantina și sala de spectacole; sala de sport de la subsol poate fi folosită de comunitatea locală.",
            en: "Basement, first and second floors. The ground floor holds administration, the canteen and the performance hall; the sports hall below is open to the local community.",
          },
          drawing: true,
        },
      },
    ],
  },
  {
    slug: "clinica-recuperare",
    number: "06",
    title: { ro: "Clinică de recuperare", en: "Sports Rehabilitation Clinic" },
    original: { ro: "Sports Rehabilitation Clinic", en: "Clinică de recuperare" },
    kind: { ro: "Refuncționalizare", en: "Adaptive reuse" },
    year: 2024,
    studio: { ro: "Anul 4", en: "Year 4" },
    location: "Timișoara, RO",
    topics: [
      { ro: "Refuncționalizare", en: "Re-functioning" },
      { ro: "Regenerare", en: "Regeneration" },
      { ro: "Sănătate", en: "Health" },
    ],
    summary: {
      ro: "O clădire existentă din beton primește o a doua viață ca clinică de recuperare sportivă, alături de un corp nou, ușor, din oțel, atașat ca un parazit.",
      en: "An existing concrete building gets a second life as a rehabilitation clinic, joined by a light steel addition that attaches to it like a parasite.",
    },
    description: {
      ro: "Clinică de recuperare sportivă în Timișoara (anul 4, 2024): refuncționalizarea unei structuri existente din beton cu un corp nou metalic, după o strategie parazitară, curte interioară și pasarele. Schițe, planuri, secțiuni și randări.",
      en: "Sports rehabilitation clinic in Timișoara (Year 4, 2024): adaptive reuse of an existing concrete structure with a new steel body following a parasitic strategy, an inner courtyard and bridges. Sketches, plans, sections and renderings.",
    },
    cover: {
      image: "clinica-recuperare/cover",
      alt: {
        ro: "Clinica văzută de pe o alee curbă: un corp nou placat cu cupru lângă o clădire existentă deschisă la culoare, legate de un portic alb.",
        en: "Clinic seen from a curving drive: a copper-clad new wing beside a pale existing building, joined by a white portal.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Intervenția pornește de la păstrarea și valorificarea corpului existent și construiește în jurul său o structură nouă, adaptată cerințelor unei clinici de fizioterapie.",
          en: "The intervention starts by keeping and valuing the existing body, then builds a new structure around it, adapted to the needs of a physiotherapy clinic.",
        },
      },
      {
        type: "figure",
        layout: "inset",
        fig: {
          image: "clinica-recuperare/sketches",
          alt: { ro: "Schițe conceptuale: două volume care se îndepărtează, un volum nou hașurat peste cel vechi, o explozie roșie în spațiul dintre ele și o scară într-un hol dublu-înalt.", en: "Concept sketches: two boxes pulling apart, a new hatched volume wrapping over the old, a red burst in the gap, and a stair crossing a double-height hall." },
          caption: { ro: "Schițe conceptuale", en: "Concept sketches" },
          drawing: true,
        },
      },
      {
        type: "text",
        title: { ro: "O strategie parazitară", en: "A parasitic strategy" },
        body: [
          {
            ro: "Noul volum, o structură metalică ușoară, se atașează corpului de beton și se dezvoltă deasupra acestuia, generând un nivel retras. Intervenția rămâne lizibilă ca adaos contemporan, fără a încerca să imite sau să ascundă construcția existentă.",
            en: "The new volume, a lightweight steel structure, attaches to the concrete body and rises above it as a setback storey. It stays legible as a contemporary addition, without imitating or hiding what was there.",
          },
          {
            ro: "Clădirea existentă concentrează funcțiunile medicale și de recuperare: cabinete de proceduri, spații terapeutice și sala de sport. Corpul nou găzduiește funcțiunile administrative și spațiile personalului, alături de săli de clasă și spații educaționale.",
            en: "The existing building takes the medical and rehabilitation program: treatment rooms, therapy spaces and the gym. The new body holds administration, staff areas, classrooms and education.",
          },
        ],
      },
      {
        type: "row",
        figs: [
          { image: "clinica-recuperare/aerial", alt: { ro: "Vedere aeriană a clinicii între o sală de sport mare și stradă.", en: "Aerial of the clinic between a large sports hall and the street." }, caption: { ro: "În context", en: "In context" } },
          { image: "clinica-recuperare/lounge", alt: { ro: "Recepție cu canapele din piele și ferestre cu rame din lemn.", en: "Reception lounge with leather sofas and timber-framed windows." }, caption: { ro: "Recepție", en: "Reception" } },
          { image: "clinica-recuperare/hall", alt: { ro: "Hol de așteptare dublu-înalt, luminat de soare, cu o scară metalică și tavan casetat din beton.", en: "Sunlit double-height waiting hall with a steel stair and coffered concrete ceiling." }, caption: { ro: "Hol de așteptare", en: "Waiting hall" } },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "clinica-recuperare/section-perspective",
          alt: { ro: "Secțiune perspectivă prin ambele corpuri: sala de sport și terapia la stânga, nucleul de scări, un hol dublu-înalt și sălile de clasă la dreapta.", en: "Perspective section through both bodies: gym and therapy rooms on the left, the stair core, a double-height hall and classrooms on the right." },
          caption: { ro: "Secțiune perspectivă", en: "Perspective section" },
          drawing: true,
        },
      },
      {
        type: "text",
        title: { ro: "Curtea", en: "The courtyard" },
        body: [
          {
            ro: "Între cele două clădiri este introdusă o curte interioară, care devine principalul spațiu de acces. La nivelurile superioare, cele două corpuri sunt conectate prin două pasarele care traversează curtea și se leagă de spațiile de așteptare, transformând circulația într-un element vizibil al arhitecturii.",
            en: "Between the two buildings is an inner courtyard, which becomes the main entrance. On the upper levels two bridges cross it and meet the waiting areas, making circulation a visible part of the architecture.",
          },
        ],
      },
      {
        type: "pair",
        figs: [
          { image: "clinica-recuperare/site", alt: { ro: "Plan de situație cu bucla de acces auto, bazin de retenție și o grădină publică comună.", en: "Site plan with the drop-off loop, retention basin and a shared public garden." }, caption: { ro: "Plan de situație", en: "Site plan" }, drawing: true },
          { image: "clinica-recuperare/plan-ground", alt: { ro: "Plan parter al clădirii existente, lungi, și al aripii noi.", en: "Ground floor plan of the long existing building and the new wing." }, caption: { ro: "Plan parter", en: "Ground floor" }, drawing: true },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "clinica-recuperare/section",
          alt: { ro: "Secțiune longitudinală: aripa nouă, mai joasă, la stânga, clădirea existentă cu patru niveluri și scara la dreapta.", en: "Longitudinal section: the lower new wing at left, the four-storey existing building with stair at right." },
          caption: { ro: "Secțiune longitudinală", en: "Longitudinal section" },
          drawing: true,
        },
      },
    ],
  },
  {
    slug: "ciupercuta",
    number: "07",
    title: "Ciupercuța",
    original: { ro: "Instalații cu caracter urban", en: "Urban installations" },
    kind: { ro: "Instalație urbană", en: "Urban installation" },
    year: 2024,
    studio: { ro: "Anul 4", en: "Year 4" },
    location: { ro: "Cartiere de blocuri", en: "Housing estates" },
    topics: [
      { ro: "Educație", en: "Education" },
      { ro: "Parc", en: "Park" },
      { ro: "Spațiu public", en: "Public space" },
    ],
    summary: {
      ro: "Un baldachin roșu, trunchi-piramidal, cu luminator, care înlocuiește foișoarele uzate din parcurile cartierelor și adună vecinii în jurul unei mese de șah.",
      en: "A red, tapered canopy with a skylight that replaces the worn gazebos of estate parks and gathers neighbours around a chess table.",
    },
    description: {
      ro: "Ciupercuța (anul 4, 2024): instalație urbană modulară pentru parcurile cartierelor de blocuri, un baldachin roșu trunchi-piramidal cu luminator deasupra unei mese de șah, care înlocuiește foișoarele uzate. Din aceeași serie: The Line, un cadru metalic modular pentru expoziții, joacă și șezut. Axonometrii, situația existentă și desene.",
      en: "Ciupercuța (Year 4, 2024): a modular urban installation for housing-estate parks, a red tapered canopy with a skylight over a chess table, replacing worn gazebos. From the same series: The Line, a modular steel frame for exhibitions, play and seating. Axonometrics, existing site and drawings.",
    },
    cover: {
      image: "ciupercuta/axonometric",
      alt: {
        ro: "Axonometrie: un baldachin roșu trunchi-piramidal pe picioare roșii subțiri, deasupra unei mese de șah, pe o alee dintr-un parc; trecători cu un câine.",
        en: "Axonometric: a red tapered canopy on slender red legs over a chess table on a park path, passers-by walking a dog.",
      },
    },
    blocks: [
      {
        type: "lead",
        text: {
          ro: "Obiecte modulare, ușor de montat și transportat, dedicate spațiilor cartierelor de blocuri, care oferă spațiul și prilejul de apropiere și formare a comunităților.",
          en: "Modular objects, easy to install and move, made for the shared spaces of housing estates, giving neighbours the room and the occasion to meet and form a community.",
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "ciupercuta/axonometric",
          alt: {
            ro: "Axonometrie a Ciupercuței pe o alee: baldachin roșu cu luminator, masă de șah și scaune, o femeie citind sub el.",
            en: "Axonometric of Ciupercuța on a park path: red canopy with a skylight, a chess table and stools, a woman reading beneath it.",
          },
          caption: { ro: "Ciupercuța în parcul cartierului", en: "Ciupercuța in the estate park" },
          drawing: true,
        },
      },
      {
        type: "text",
        title: { ro: "De la foișor la Ciupercuță", en: "From gazebo to Ciupercuța" },
        body: [
          {
            ro: "Parcurile dintre blocuri păstrează foișoare din lemn obosite, folosite rar. Ciupercuța le înlocuiește cu un singur obiect, ușor de recunoscut: un baldachin roșu trunchi-piramidal, deschis spre cer printr-un luminator, așezat pe picioare metalice subțiri.",
            en: "The parks between housing blocks keep tired timber gazebos that are rarely used. Ciupercuța replaces them with one recognisable object: a red tapered canopy, opened to the sky by a skylight and set on slender steel legs.",
          },
          {
            ro: "Sub el, o masă de șah cu patru locuri devine un punct de întâlnire pentru vecini de toate vârstele.",
            en: "Beneath it, a four-seat chess table becomes a meeting point for neighbours of every age.",
          },
        ],
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "ciupercuta/before-after",
          alt: {
            ro: "Fotografii alb-negru ale foișoarelor existente din parc și, după o săgeată roșie, același foișor înlocuit de baldachinul roșu.",
            en: "Black and white photographs of the existing park gazebos and, after a red arrow, the same spot with the red canopy in place.",
          },
          caption: { ro: "Situația existentă și propunerea", en: "Existing gazebos and the proposal" },
          drawing: true,
        },
      },
      {
        type: "figure",
        layout: "wide",
        fig: {
          image: "ciupercuta/drawings",
          alt: {
            ro: "Plan al acoperișului roșu cu luminatorul, plan al mesei de șah cu patru scaune și fațada cu o persoană așezată.",
            en: "Roof plan of the red canopy with its skylight, plan of the chess table with four stools, and an elevation with a seated figure.",
          },
          caption: { ro: "Plan acoperiș, plan masă și fațadă", en: "Roof plan, table plan and elevation" },
          drawing: true,
        },
      },
      {
        type: "text",
        title: { ro: "Din aceeași serie: The Line", en: "From the same series: The Line" },
        body: [
          {
            ro: "Cadrul metalic modular este un element multifuncțional, care poate servi simultan mai multor categorii de utilizatori. Panourile rotative permit expoziții de artă, fotografie sau lucrări locale, transformându-l într-un spațiu cultural în aer liber.",
            en: "The modular steel frame serves several kinds of users at once. Rotating panels hold exhibitions of art, photography or local work, turning it into an open-air cultural space.",
          },
          {
            ro: "Panourile pot fi folosite de copii ca suprafețe pentru desen sau scris, ca masă de joc pentru activități fizice, iar cadrele oferă bănci și locuri de relaxare, spații de întâlnire care facilitează dialogul între vecini.",
            en: "Children can draw and write on the panels, they work as a game table for play, and the frames form benches and places to rest, meeting spaces that open conversation between neighbours.",
          },
        ],
      },
      {
        type: "figure",
        layout: "inset",
        fig: {
          image: "ciupercuta/the-line",
          alt: {
            ro: "Axonometrie a unui cadru roșu din oțel în zigzag cu panouri rotative, folosit pentru desen, expoziții, jocuri și șezut, cu detalii de pivot și fațade.",
            en: "Axonometric of a zigzagging red steel frame carrying rotating panels, used for drawing, exhibitions, games and seating, with pivot details and elevations.",
          },
          caption: { ro: "The Line: axonometrie, pivoturile panourilor și fațade", en: "The Line: axonometric, panel pivots and elevations" },
          drawing: true,
        },
      },
    ],
  },
];

export const getProjects = (lang: Lang) => content.map((p) => resolve<Project>(p, lang));
export const getProject = (slug: string, lang: Lang) => getProjects(lang).find((p) => p.slug === slug);
/** A figure used somewhere in a project, by image key. */
export function findFig(p: Project, image: ImageKey): Fig | undefined {
  for (const b of p.blocks) {
    if (b.type === "figure" || b.type === "slats") {
      if (b.fig.image === image) return b.fig;
    } else if (b.type === "pair" || b.type === "row") {
      const hit = b.figs.find((x) => x.image === image);
      if (hit) return hit;
    }
  }
}

export const slugs = content.map((p) => p.slug as string);
