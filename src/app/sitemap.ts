import type { MetadataRoute } from "next";
import { img } from "@/content/img";
import { getProjects, type Project } from "@/content/projects";
import { href, locales } from "@/i18n";
import { abs } from "@/lib/site";

// Content date of the current portfolio; bump when projects change.
const UPDATED = new Date("2026-11-24");

const projectImages = (p: Project) => {
  const keys = new Set([p.cover.image]);
  for (const b of p.blocks) {
    if (b.type === "figure" || b.type === "slats") keys.add(b.fig.image);
    if (b.type === "pair" || b.type === "row") b.figs.forEach((f) => keys.add(f.image));
    if (b.type === "planSection") [b.plan, b.section].forEach((f) => keys.add(f.image));
    if (b.type === "floors") b.floors.forEach((f) => keys.add(f.fig.image));
  }
  return [...keys].map((k) => abs(img(k).src));
};

// Every page in both languages, each pointing at its translation, with its images.
export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getProjects("ro");
  const pages = [
    { path: "/", priority: 1, images: [abs(img("filarmonica/cover").src), abs(img("about/portrait").src)] },
    ...projects.map((p) => ({ path: `/work/${p.slug}`, priority: 0.8, images: projectImages(p) })),
  ];
  return pages.flatMap(({ path, priority, images }) =>
    locales.map((lang) => ({
      url: abs(href(lang, path)),
      lastModified: UPDATED,
      changeFrequency: "yearly" as const,
      priority: lang === "ro" ? priority : priority - 0.1,
      images,
      alternates: { languages: { "ro-RO": abs(href("ro", path)), en: abs(href("en", path)), "x-default": abs(href("ro", path)) } },
    })),
  );
}
