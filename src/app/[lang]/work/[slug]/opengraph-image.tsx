import { img } from "@/content/img";
import { getProject, slugs } from "@/content/projects";
import { isLang, locales } from "@/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

const project = (lang: string, slug: string) => {
  const l = isLang(lang) ? lang : "ro";
  return getProject(slug, l) ?? getProject("filarmonica-banatul", l)!;
};

// One card per page, with alt text naming the project in the page's language.
export function generateImageMetadata({ params }: { params: { lang: string; slug: string } }) {
  const p = project(params.lang, params.slug);
  const by = params.lang === "en" ? "architecture project by Sabine Lieb" : "proiect de arhitectură de Sabine Lieb";
  return [{ id: "card", size: ogSize, contentType, alt: `${p.title}, ${p.kind.toLowerCase()}, ${by}` }];
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const p = project(lang, slug);
  return ogImage({
    eyebrow: `${p.number} · ${p.kind}`,
    title: p.title,
    footer: `${p.studio} · ${p.year}`,
    cover: img(p.cover.image).src.slice(1),
  });
}
