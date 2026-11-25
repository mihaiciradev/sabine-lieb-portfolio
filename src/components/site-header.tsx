import Link from "next/link";
import { href, ui, type Lang } from "@/i18n";
import { LangSwitch } from "./lang-switch";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = ui[lang];
  return (
    <header className="gutter pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between py-4 text-white mix-blend-difference">
      <Link href={href(lang)} className="pointer-events-auto font-display text-lg font-semibold leading-none tracking-tight">
        Sabine Lieb
      </Link>
      <nav aria-label={lang === "ro" ? "Principală" : "Primary"} className="pointer-events-auto">
        <ul className="label flex items-center gap-4 sm:gap-6">
          <li className="max-sm:hidden">
            <Link href={`${href(lang)}#work`} className="underline-offset-4 hover:underline">
              {t.nav.work}
            </Link>
          </li>
          <li className="max-sm:hidden">
            <Link href={`${href(lang)}#about`} className="underline-offset-4 hover:underline">
              {t.nav.about}
            </Link>
          </li>
          <li className="flex items-center gap-1.5" aria-label={t.language}>
            <span aria-current="true" className="border-b border-current">
              {lang.toUpperCase()}
            </span>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <LangSwitch lang={lang} className="opacity-60 hover:opacity-100" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
