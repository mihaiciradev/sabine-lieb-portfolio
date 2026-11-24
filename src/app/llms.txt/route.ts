import { getAbout } from "@/content/about";
import { getProjects } from "@/content/projects";
import { href } from "@/i18n";
import { abs } from "@/lib/site";

// Plain-text summary for language-model crawlers and assistants (llmstxt.org).
export function GET() {
  const about = getAbout("en");
  const ro = getProjects("ro");
  const en = getProjects("en");
  const body = [
    "# Sabine Lieb, architect (Timișoara, Romania)",
    "",
    `> ${about.practice[0]}`,
    "",
    "The site is in Romanian at the root and in English under /en.",
    "",
    "## Projects",
    "",
    ...en.map((p, i) => `- [${p.title} / ${ro[i].title}](${abs(href("en", `/work/${p.slug}`))}): ${p.kind}, ${p.location}, ${p.year}. ${p.summary}`),
    "",
    "## Profile",
    "",
    `- Education: ${about.education.map((e) => `${e.title}, ${e.place} (${e.period})`).join("; ")}`,
    `- Experience: ${about.experience.map((e) => `${e.place} (${e.period})`).join("; ")}`,
    `- Recognition: ${about.recognition.map((r) => `${r.title} (${r.year})`).join("; ")}`,
    `- Publication: ${about.publication.title}, ${about.publication.venue} (${about.publication.year})`,
    `- Interests: ${about.interests}`,
    "",
    "## Pages",
    "",
    `- [Home, Romanian](${abs("/")})`,
    `- [Home, English](${abs("/en")})`,
    `- [Sitemap](${abs("/sitemap.xml")})`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
