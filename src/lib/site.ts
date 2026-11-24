import type { Metadata } from "next";
import { href, locales, type Lang } from "@/i18n";

// Set SITE_URL to the production origin when deploying; canonical and hreflang links use it.
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const abs = (path: string) => `${SITE_URL}${path}`;

/** Canonical plus hreflang alternates for a path that exists in both languages. */
export function alternates(lang: Lang, path = "/"): Metadata["alternates"] {
  return {
    canonical: href(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l === "ro" ? "ro-RO" : "en", href(l, path)])),
      "x-default": href("ro", path),
    },
  };
}

export const ogLocale = (lang: Lang) => (lang === "ro" ? "ro_RO" : "en_US");
