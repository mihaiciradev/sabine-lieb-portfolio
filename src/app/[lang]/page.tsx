import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { HeroShells } from "@/components/hero-shells";
import { Pic } from "@/components/pic";
import { ProjectIndex } from "@/components/project-index";
import { SlatReveal } from "@/components/slat-reveal";
import { ModelFigure } from "@/components/project-blocks";
import { Words } from "@/components/words";
import { getAbout } from "@/content/about";
import { img } from "@/content/img";
import { findFig, getProjects, getSketches, getStudies, type Project } from "@/content/projects";
import { href, isLang, ui, type Lang } from "@/i18n";
import { abs, alternates, ogLocale } from "@/lib/site";

const meta = {
  ro: {
    title: "Sabine Lieb, arhitect · Portofoliu de arhitectură, Timișoara",
    description:
      "Portofoliul arhitectei Sabine Lieb din Timișoara: Filarmonica Banatul (proiect de diplomă 2026), un pavilion expozițional itinerant, un muzeu de artă contemporană în parc, o rezidență artistică într-un turn de veghe, o școală și o clinică de recuperare. Planuri, secțiuni, schițe și randări.",
  },
  en: {
    title: "Sabine Lieb, architect · Architecture portfolio, Timișoara",
    description:
      "Architecture portfolio of Sabine Lieb, Timișoara: the Banatul Philharmonic (2026 diploma project), a travelling exhibition pavilion, a contemporary art museum in a park, an artist residency in a watchtower, a school and a rehabilitation clinic. Plans, sections, sketches and renderings.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: meta[lang].title,
    description: meta[lang].description,
    alternates: alternates(lang),
    openGraph: {
      type: "profile",
      locale: ogLocale(lang),
      title: meta[lang].title,
      description: meta[lang].description,
      siteName: "Sabine Lieb",
      images: [{ url: "/work/filarmonica/cover.jpg", width: 2400, height: 1350 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];
  const projects = getProjects(lang);
  const p = (slug: string) => projects.find((x) => x.slug === slug) as Project;
  const phil = p("filarmonica-banatul");
  const pav = p("pavilion-ana-lupas");
  const muz = p("muzeu-paul-neagu");
  const tower = p("rezidenta-turn-de-veghe");
  const school = p("scoala-lipovei");
  const clinic = p("clinica-recuperare");
  const vectors: [string, string, string] = lang === "ro" ? ["Parc", "Oraș", "Stradă"] : ["Park", "City", "Street"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": abs("/#sabine-lieb"),
        name: "Sabine Lieb",
        jobTitle: t.role,
        url: abs(href(lang)),
        image: abs("/work/about/portrait.jpg"),
        address: { "@type": "PostalAddress", addressLocality: "Timișoara", addressCountry: "RO" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Universitatea Politehnica Timișoara" },
        knowsLanguage: ["ro", "en", "de"],
      },
      {
        "@type": "ItemList",
        name: lang === "ro" ? "Proiecte" : "Projects",
        itemListElement: projects.map((x, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(href(lang, `/work/${x.slug}`)),
          name: x.title,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero project={phil} lang={lang} vectors={vectors} />

      <section id="work" data-nav={t.index} aria-labelledby="index-title" className="gutter scroll-mt-16 pb-24 pt-10 outline-none md:pb-36">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 id="index-title" className="label text-oxblood">
            {t.index}
          </h2>
          <p className="label text-graphite">{t.projectsCount(projects.length)}</p>
        </div>
        <ProjectIndex
          viewLabel={t.viewProject}
          rows={projects.map((x) => {
            const c = img(x.cover.image);
            return {
              slug: x.slug,
              href: href(lang, `/work/${x.slug}`),
              number: x.number,
              title: x.title,
              kind: x.kind,
              year: x.year,
              location: x.location,
              preview: { src: c.src, width: c.width, height: c.height, blur: c.blur, alt: x.cover.alt },
            };
          })}
        />
      </section>

      {/* 01: immersive */}
      <section id="filarmonica" data-nav={phil.title} aria-labelledby="f-phil" className="scroll-mt-0 bg-ink text-paper outline-none">
        <Link href={href(lang, `/work/${phil.slug}`)} data-cursor={t.viewProject} className="group relative block h-[88svh] min-h-[480px] overflow-hidden">
          <div className="zoom-out absolute inset-0">
            <Pic
              fig={{ image: "filarmonica/park", alt: findFig(phil, "filarmonica/park")?.alt ?? phil.cover.alt }}
              fit="cover"
              sizes="100vw"
              caption={false}
              className="absolute inset-0"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />
          <div className="rise-in gutter grid-sheet absolute inset-x-0 bottom-0 items-end gap-y-4 pb-8 md:pb-12">
            <p className="label col-span-4 text-paper/80 md:col-span-2">
              {phil.number} · {phil.studio}, {phil.year}
            </p>
            <h2 id="f-phil" className="col-span-4 font-display text-[clamp(2.6rem,8vw,8rem)] font-bold leading-[0.86] tracking-[-0.03em] md:col-span-7">
              <Words text={phil.title} />
            </h2>
            <p className="col-span-4 max-w-md text-[1.0625rem] leading-relaxed text-paper/90 md:col-span-3">
              {phil.summary} <span className="label mt-3 block text-paper underline underline-offset-4">{t.viewProject} →</span>
            </p>
          </div>
        </Link>
        <div className="gutter flex snap-x snap-mandatory scroll-px-[clamp(1rem,3.2vw,3rem)] gap-3 overflow-x-auto py-8 md:grid md:grid-cols-12 md:gap-x-[clamp(0.75rem,1.6vw,1.5rem)] md:overflow-visible md:py-12">
          {(["hall", "foyer", "recital"] as const).map((key, i) => {
            const fig = findFig(phil, `filarmonica/${key}`);
            if (!fig) return null;
            return (
              <figure key={key} className="reveal w-[78vw] shrink-0 snap-start md:col-span-4 md:w-auto" style={{ "--i": i } as React.CSSProperties}>
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Pic fig={{ ...fig, drawing: false }} fit="cover" sizes="(min-width: 768px) 32vw, 78vw" caption={false} className="absolute inset-0" />
                </div>
                <figcaption className="label mt-2 text-paper/70">{fig.caption?.split(".")[0]}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* 02: the 3D moment */}
      <section id="pavilion" data-nav={pav.title} aria-labelledby="f-pav" className="gutter grid-sheet scroll-mt-16 items-center gap-y-10 py-24 outline-none md:py-36">
        <div className="col-span-4 md:col-span-4">
          <p className="label text-oxblood">
            {pav.number} · {pav.studio}, {pav.year}
          </p>
          <h2 id="f-pav" className="mt-4 font-display text-[clamp(2.2rem,5vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.025em] text-indigo">
            <Words text={pav.title} />
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed">{pav.summary}</p>
          <Link href={href(lang, `/work/${pav.slug}`)} data-cursor={t.viewProject} className="group mt-8 block">
            <ViewTransition name={`cover-${pav.slug}`}>
              <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden">
                <Pic fig={pav.cover} fit="cover" sizes="(min-width: 768px) 24rem, 100vw" caption={false} className="absolute inset-0" />
              </div>
            </ViewTransition>
            <span className="label mt-3 inline-block underline-offset-4 group-hover:underline">{t.viewProject} →</span>
          </Link>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <ModelFigure lang={lang} />
        </div>
      </section>

      {/* 03: façade */}
      <section id="muzeu" data-nav={muz.title} aria-labelledby="f-muz" className="scroll-mt-16 pb-24 outline-none md:pb-36">
        <Link href={href(lang, `/work/${muz.slug}`)} data-cursor={t.viewProject} className="group block">
          <SlatReveal>
            <Pic fig={{ image: "muzeu-paul-neagu/facade", alt: findFig(muz, "muzeu-paul-neagu/facade")?.alt ?? muz.cover.alt }} sizes="100vw" caption={false} />
          </SlatReveal>
          <div className="gutter grid-sheet mt-6 items-baseline gap-y-3">
            <p className="label col-span-4 text-oxblood md:col-span-2">
              {muz.number} · {muz.studio}, {muz.year}
            </p>
            <h2 id="f-muz" className="col-span-4 font-display text-[clamp(2rem,4.6vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.025em] text-indigo group-hover:text-oxblood md:col-span-6">
              <Words text={muz.title} />
            </h2>
            <p className="col-span-4 text-[1.0625rem] leading-relaxed md:col-span-4">{muz.summary}</p>
          </div>
        </Link>
      </section>

      {/* 04: photograph against drawing */}
      <section id="turn" data-nav={tower.title} aria-labelledby="f-tower" className="gutter grid-sheet scroll-mt-16 gap-y-10 pb-24 outline-none md:pb-36">
        <Link href={href(lang, `/work/${tower.slug}`)} data-cursor={t.viewProject} className="group col-span-4 md:col-span-7">
          <ViewTransition name={`cover-${tower.slug}`}>
            <div className="settle relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
              <Pic fig={tower.cover} fit="cover" sizes="(min-width: 768px) 58vw, 100vw" caption={false} className="absolute inset-0" />
            </div>
          </ViewTransition>
        </Link>
        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-5">
          <div>
            <p className="label text-oxblood">
              {tower.number} · {tower.studio}, {tower.year}
            </p>
            <h2 id="f-tower" className="mt-4 font-display text-[clamp(2rem,4.2vw,4rem)] font-bold leading-[0.92] tracking-[-0.025em] text-indigo">
              <Link href={href(lang, `/work/${tower.slug}`)} className="hover:text-oxblood">
                <Words text={tower.title} />
              </Link>
            </h2>
            <p className="mt-6 text-[1.0625rem] leading-relaxed">{tower.summary}</p>
          </div>
          {(() => {
            const fig = findFig(tower, "rezidenta-turn-de-veghe/section");
            return fig ? <Pic fig={fig} sizes="(min-width: 768px) 40vw, 100vw" className="reveal" /> : null;
          })()}
        </div>
      </section>

      {/* 05, 06: quieter pair */}
      <section
        id="scoala-clinica"
        data-nav={lang === "ro" ? "Școală și clinică" : "School and clinic"}
        aria-label={lang === "ro" ? "Alte proiecte" : "More projects"}
        className="gutter grid-sheet scroll-mt-16 gap-y-14 border-t border-ink pb-24 pt-10 outline-none md:pb-36"
      >
        {[school, clinic].map((x, i) => (
          <Link
            key={x.slug}
            href={href(lang, `/work/${x.slug}`)}
            data-cursor={t.viewProject}
            className="reveal group col-span-4 md:col-span-6"
            style={{ "--i": i } as React.CSSProperties}
          >
            <ViewTransition name={`cover-${x.slug}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Pic
                  fig={x.cover}
                  fit="cover"
                  sizes="(min-width: 768px) 48vw, 100vw"
                  caption={false}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
            </ViewTransition>
            <p className="label mt-5 text-oxblood">
              {x.number} · {x.studio}, {x.year}
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-none tracking-tight text-indigo group-hover:text-oxblood">
              {x.title}
            </h2>
            <p className="mt-3 max-w-lg leading-relaxed text-ink/80">{x.summary}</p>
          </Link>
        ))}
      </section>

      <Studies lang={lang} />
      <About lang={lang} />
    </>
  );
}

function Hero({ project, lang, vectors }: { project: Project; lang: Lang; vectors: [string, string, string] }) {
  const t = ui[lang];
  return (
    <section
      id="start"
      data-nav={t.chapters.start}
      aria-labelledby="name"
      className="gutter relative flex flex-col gap-8 pb-8 pt-16 outline-none md:grid md:h-svh md:min-h-[560px] md:grid-rows-[minmax(0,1fr)_auto] md:gap-4 md:pb-5 md:pt-16"
    >
      {/* The name is sized against both width and height, so it is always whole in the first screen. */}
      <h1
        id="name"
        className="rise font-display text-[min(24vw,15svh)] font-bold leading-[0.82] tracking-[-0.045em] text-indigo md:order-last md:flex md:gap-[0.18em] md:text-[min(19.5vw,24svh)]"
      >
        <span className="block overflow-hidden pb-[0.05em]">
          <span className="inline-block">Sabine</span>
        </span>
        <span className="block overflow-hidden pb-[0.05em]">
          <span className="inline-block">Lieb</span>
        </span>
        <span className="sr-only">
          , {t.role.toLowerCase()} {t.city}
        </span>
      </h1>

      <div className="grid-sheet min-h-0 gap-y-10 md:items-stretch">
        <div className="col-span-4 md:col-span-4 md:self-end">
          <p className="label text-oxblood">
            {t.role} · {t.city} · 2023–2026
          </p>
          <p className="mt-5 max-w-sm font-display text-[clamp(1.2rem,1.8vw,1.55rem)] leading-snug tracking-tight">{t.heroLine}</p>
          <a href="#work" className="label mt-6 inline-block border-b border-ink pb-1 hover:text-oxblood">
            {t.indexOfWork} ↓
          </a>
        </div>
        {/* Container-sized: the image takes whatever height the name leaves. */}
        <div className="relative col-span-4 grid place-items-center max-md:order-first md:col-span-7 md:col-start-6 md:min-h-0 md:[container-type:size]">
          <div className="relative my-[9%] aspect-[16/10] w-[86%] md:my-0 md:w-[min(82cqw,calc(72cqh*1.6))]">
            <Link href={href(lang, `/work/${project.slug}`)} data-cursor={t.viewProject} className="block h-full" aria-label={`${project.title}, ${project.studio} ${project.year}`}>
              <ViewTransition name={`cover-${project.slug}`}>
                <div className="relative h-full overflow-hidden bg-paper-2">
                  <Pic fig={project.cover} fit="cover" sizes="(min-width: 768px) 50vw, 86vw" preload caption={false} className="absolute inset-0" />
                </div>
              </ViewTransition>
            </Link>
            <HeroShells labels={vectors} />
            <p className="label absolute -bottom-14 right-0 max-w-[70%] text-right text-graphite md:-bottom-8 md:left-0 md:right-auto md:max-w-none md:text-left">
              {project.title} · {project.studio} {project.year}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Studies({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const studies = getStudies(lang);
  const sketches = getSketches(lang);
  return (
    <section
      id="studies"
      data-nav={t.studies}
      aria-labelledby="studies-title"
      className="scroll-mt-16 overflow-hidden bg-paper-2 py-24 outline-none [--ground:var(--color-paper-2)] md:py-36"
    >
      <div className="gutter grid-sheet gap-y-6">
        <h2 id="studies-title" className="drift col-span-4 font-display text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.035em] text-indigo md:col-span-7">
          {t.studies}
        </h2>
        <p className="col-span-4 self-end text-[1.0625rem] leading-relaxed md:col-span-5 md:col-start-8">
          {t.studiesLead} {studies.title} ({studies.studio}, {studies.year}): {studies.intro.charAt(0).toLowerCase() + studies.intro.slice(1)}
        </p>
      </div>

      <div className="gutter grid-sheet mt-14 gap-y-14 md:mt-20">
        {studies.items.map((s, i) => (
          <div key={s.name} className={`reveal col-span-4 md:col-span-6 ${i === 1 ? "md:mt-24" : ""}`}>
            <h3 className="mb-4 font-display text-3xl font-semibold tracking-tight">{s.name}</h3>
            <Pic fig={s.fig} sizes="(min-width: 768px) 48vw, 100vw" />
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-28">
        <div className="gutter flex items-baseline justify-between">
          <h3 className="label text-oxblood">{t.sketchbook}</h3>
          <p className="label text-graphite">{t.scrollSideways} →</p>
        </div>
        <ul
          tabIndex={0}
          aria-label={t.sketchbook}
          className="gutter mt-6 flex snap-x snap-mandatory scroll-px-[clamp(1rem,3.2vw,3rem)] gap-6 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {sketches.map((f) => {
            const d = img(f.image);
            return (
              <li key={f.image} className="shrink-0 snap-start" style={{ width: `min(85vw, calc(52svh * ${(d.width / d.height).toFixed(3)}))` }}>
                <Pic fig={f} sizes="(min-width: 768px) 50vw, 85vw" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function About({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const about = getAbout(lang);
  return (
    <section id="about" data-nav={t.about} aria-labelledby="about-title" className="gutter scroll-mt-16 py-24 outline-none md:py-36">
      <div className="grid-sheet gap-y-12">
        <div className="col-span-4 md:col-span-4">
          <div className="settle relative aspect-square max-w-sm overflow-hidden bg-paper-2">
            <Pic
              fig={{
                image: "about/portrait",
                alt: lang === "ro" ? "Portret alb-negru al Sabinei Lieb, cu brațele încrucișate, privind spre aparat." : "Black and white portrait of Sabine Lieb, arms folded, looking at the camera.",
              }}
              fit="cover"
              sizes="(min-width: 768px) 24rem, 100vw"
              caption={false}
              className="absolute inset-0"
              imgClassName="grayscale"
            />
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <h2 id="about-title" className="label text-oxblood">
            {t.about}
          </h2>
          <div className="mt-5 space-y-5 font-display text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.22] tracking-tight">
            {about.statement.map((s) => (
              <p key={s.slice(0, 20)}>
                <Words text={s} />
              </p>
            ))}
          </div>
          <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-ink/80">
            {about.practice.map((s) => (
              <p key={s.slice(0, 20)}>{s}</p>
            ))}
            <p>
              <span className="label text-graphite">{t.interests}: </span>
              {about.interests}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 border-l border-t border-ink md:mt-24 md:grid-cols-3">
        <Column title={t.experience}>
          {about.experience.map((e) => (
            <li key={e.place}>
              <p className="label text-graphite">{e.period}</p>
              <p className="mt-1 font-semibold">{e.place}</p>
              <p className="text-sm leading-relaxed text-ink/75">
                {e.title}. {e.note}
              </p>
            </li>
          ))}
        </Column>
        <Column title={t.recognition}>
          {about.recognition.map((r) => (
            <li key={r.title}>
              <p className="label text-graphite">{r.year}</p>
              <p className="mt-1">{r.title}</p>
            </li>
          ))}
          <li className="pt-4">
            <p className="label text-oxblood">
              {t.publication} · {about.publication.year}
            </p>
            <p lang="en" className="mt-1 font-display text-lg leading-snug">
              {about.publication.title}
            </p>
            <p className="text-sm text-ink/75">{about.publication.venue}</p>
          </li>
        </Column>
        <Column title={t.educationTools}>
          {about.education.map((e) => (
            <li key={e.title}>
              <p className="label text-graphite">{e.period}</p>
              <p className="mt-1 font-semibold">{e.title}</p>
              <p className="text-sm leading-relaxed text-ink/75">{e.place}</p>
            </li>
          ))}
          <li>
            <p className="label text-graphite">{t.tools}</p>
            <p className="mt-1 text-sm leading-relaxed">{about.tools.join(" · ")}</p>
          </li>
          <li>
            <p className="label text-graphite">{t.languages}</p>
            <p className="mt-1 text-sm leading-relaxed">{about.languages.join(" · ")}</p>
          </li>
        </Column>
      </div>
    </section>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-r border-ink p-5 md:p-7">
      <h3 className="label mb-6 text-oxblood">{title}</h3>
      <ul className="space-y-5">{children}</ul>
    </div>
  );
}
