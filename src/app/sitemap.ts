import type { MetadataRoute } from "next";
import { slugs } from "@/content/projects";
import { href } from "@/i18n";
import { abs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...slugs.map((s) => `/work/${s}`)];
  return paths.map((path) => ({
    url: abs(href("ro", path)),
    changeFrequency: "yearly",
    priority: path === "/" ? 1 : 0.8,
    alternates: { languages: { "ro-RO": abs(href("ro", path)), en: abs(href("en", path)) } },
  }));
}
