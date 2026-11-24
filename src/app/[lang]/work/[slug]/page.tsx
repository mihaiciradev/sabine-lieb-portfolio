import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Pic } from "@/components/pic";
import { ProjectBlocks } from "@/components/project-blocks";
import { Words } from "@/components/words";
import { img } from "@/content/img";
import { getProject, getProjects, slugs } from "@/content/projects";
import { href, isLang, locales, ui } from "@/i18n";
import { abs, alternates, ogLocale } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const project = getProject(slug, lang);
  if (!project) return {};
  const cover = img(project.cover.image);
  const title = `${project.title} · ${project.kind}, ${project.location} ${project.year}`;
  return {
    title: `${title} · Sabine Lieb`,
    description: project.description,
    keywords: [project.title, project.original, project.kind, ...project.topics, "Sabine Lieb", lang === "ro" ? "arhitect Timișoara" : "architect Timișoara"],
    alternates: alternates(lang, `/work/${slug}`),
    openGraph: {
      type: "article",
      locale: ogLocale(lang),
      siteName: "Sabine Lieb",
      title,
      description: project.summary,
      images: [{ url: cover.src, width: cover.width, height: cover.height, alt: project.cover.alt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const project = getProject(slug, lang);
  if (!project) notFound();
  const t = ui[lang];
  const projects = getProjects(lang);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const cover = img(project.cover.image);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        alternateName: project.original,
        description: project.description,
        genre: project.kind,
        keywords: project.topics.join(", "),
        dateCreated: String(project.year),
        inLanguage: lang,
        image: abs(cover.src),
        url: abs(href(lang, `/work/${slug}`)),
        locationCreated: { "@type": "Place", name: project.location },
        creator: { "@type": "Person", "@id": abs("/#sabine-lieb"), name: "Sabine Lieb" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Sabine Lieb", item: abs(href(lang)) },
          { "@type": "ListItem", position: 2, name: t.nav.work, item: abs(`${href(lang)}#work`) },
          { "@type": "ListItem", position: 3, name: project.title, item: abs(href(lang, `/work/${slug}`)) },
        ],
      },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header id="cover" data-nav={t.chapters.cover} className="outline-none">
        <div className="gutter grid-sheet items-end gap-y-6 pb-8 pt-24 md:pb-10 md:pt-32">
          <nav aria-label="Breadcrumb" className="label col-span-4 text-oxblood md:col-span-2">
            <Link href={`${href(lang)}#work`} className="hover:underline">
              {t.nav.work}
            </Link>{" "}
            · {project.number} / {String(projects.length).padStart(2, "0")}
          </nav>
          <div className="col-span-4 md:col-span-10">
            <h1 className="font-display text-[clamp(2.6rem,8.4vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-indigo text-balance">
              <Words text={project.title} />
            </h1>
            <p lang={lang === "ro" ? "en" : "ro"} className="mt-4 font-display text-lg text-graphite md:text-xl">
              {project.original}
            </p>
          </div>
        </div>

        <ViewTransition name={`cover-${project.slug}`}>
          <div className="relative h-[62svh] min-h-[320px] w-full overflow-hidden bg-paper-2 md:h-[82svh]">
            <Pic fig={project.cover} fit="cover" sizes="100vw" preload caption={false} className="absolute inset-0" />
          </div>
        </ViewTransition>

        <dl className="gutter grid grid-cols-2 border-b border-ink md:grid-cols-5">
          {[
            [t.facts.type, project.kind],
            [t.facts.year, String(project.year)],
            [t.facts.context, project.studio],
            [t.facts.location, project.location],
            [t.facts.topics, project.topics.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-rule py-4 pr-3 last:border-r-0 max-md:[&:nth-child(2n)]:border-r-0">
              <dt className="label text-graphite">{k}</dt>
              <dd className="mt-1.5 text-[0.95rem]">{v}</dd>
            </div>
          ))}
        </dl>
        {project.cover.caption ? <p className="gutter label pt-4 text-graphite">{project.cover.caption}</p> : null}
        {project.note ? <p className="gutter label pt-4 text-oxblood">{project.note}</p> : null}
      </header>

      <ProjectBlocks blocks={project.blocks} lang={lang} />

      <nav id="next" data-nav={t.chapters.next} aria-label={t.chapters.next} className="border-t border-ink outline-none">
        <Link
          href={href(lang, `/work/${next.slug}`)}
          data-cursor={t.next}
          className="group gutter grid-sheet items-end gap-y-4 py-14 transition-colors duration-500 hover:bg-ink hover:text-paper md:py-20"
        >
          <span className="label col-span-4 text-oxblood md:col-span-2">
            {t.next} · {next.number}
          </span>
          <span className="col-span-4 font-display text-[clamp(2rem,6vw,5.5rem)] font-bold leading-[0.9] tracking-tight md:col-span-8">{next.title}</span>
          <span aria-hidden className="col-span-4 text-right font-display text-5xl transition-transform duration-500 group-hover:translate-x-3 md:col-span-2">
            →
          </span>
        </Link>
      </nav>
    </article>
  );
}
