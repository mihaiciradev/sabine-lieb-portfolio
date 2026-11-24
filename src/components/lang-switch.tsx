"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Links to the same page in the other language. */
export function LangSwitch({ lang, className = "" }: { lang: "ro" | "en"; className?: string }) {
  const pathname = usePathname();
  const other = lang === "ro" ? "en" : "ro";
  const path = lang === "ro" ? (pathname === "/" ? "/en" : `/en${pathname}`) : pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return (
    <Link href={path} hrefLang={other} lang={other} className={className}>
      {other.toUpperCase()}
    </Link>
  );
}
