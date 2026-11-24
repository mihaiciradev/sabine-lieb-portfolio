import Link from "next/link";
import { href, ui, type Lang } from "@/i18n";
import { getProjects } from "@/content/projects";

// Laid out like the title block in the corner of a drawing sheet.
export function SiteFooter({ lang }: { lang: Lang }) {
  const t = ui[lang].footer;
  const projects = getProjects(lang);
  const run = projects.map((p) => p.title);

  return (
    <footer className="border-t border-ink bg-paper pb-24 pt-0">
      {/* Kinetic strip of project names; paused for motion-off visitors. */}
      <div aria-hidden className="marquee overflow-hidden border-b border-ink py-5">
        <div className="marquee-track flex w-max gap-10 font-display text-[clamp(2rem,5vw,4.5rem)] font-bold leading-none tracking-tight text-indigo">
          {[...run, ...run].map((title, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {title}
              <span className="inline-block size-3 rotate-45 border border-oxblood" />
            </span>
          ))}
        </div>
      </div>

      <div className="gutter grid-sheet gap-y-8 pt-10">
        <p className="col-span-4 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.85] tracking-tight text-indigo md:col-span-5">
          Sabine
          <br />
          Lieb
        </p>
        <dl className="col-span-4 grid grid-cols-2 border-l border-t border-ink md:col-span-7 md:grid-cols-4">
          {[
            [t.practice, ui[lang].role],
            [t.based, "Timișoara, RO"],
            [t.sheet, t.sheetValue],
            [t.period, "2023–2026"],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-r border-ink p-3">
              <dt className="label text-graphite">{k}</dt>
              <dd className="mt-2 text-sm">{v}</dd>
            </div>
          ))}
          <div className="col-span-2 border-b border-r border-ink p-3 md:col-span-4">
            <p className="label text-graphite">{t.projects}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={href(lang, `/work/${p.slug}`)} className="hover:text-oxblood">
                    {p.number} {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </dl>
      </div>
      <p className="gutter label mt-8 max-w-4xl normal-case tracking-normal text-graphite [font-size:0.75rem]">{t.credit}</p>
    </footer>
  );
}
