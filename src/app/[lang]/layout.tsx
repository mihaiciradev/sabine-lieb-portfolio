import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LightboxProvider } from "@/components/lightbox";
import { Navigator } from "@/components/navigator";
import { Cursor } from "@/components/cursor";
import { isLang, locales, ui } from "@/i18n";
import { MOTION_SCRIPT } from "@/lib/motion";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Only Latin is preloaded; the Latin Extended faces (Romanian ș, ț, ă) still load on demand via unicode-range.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sabine Lieb",
  authors: [{ name: "Sabine Lieb", url: SITE_URL }],
  creator: "Sabine Lieb",
  publisher: "Sabine Lieb",
  category: "architecture",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { title: "Sabine Lieb", capable: true, statusBarStyle: "default" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0eb" },
    { media: "(prefers-color-scheme: dark)", color: "#16171c" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = ui[lang];

  return (
    <html lang={lang} className={`${fraunces.variable} ${interTight.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Sets data-motion before first paint so CSS animations never flash. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="label fixed left-3 top-3 z-[60] -translate-y-20 bg-ink px-3 py-2 text-paper focus:translate-y-0">
          {t.skip}
        </a>
        <LightboxProvider
          labels={{ enlarge: t.enlarge, drawing: t.drawing, fit: t.fit, fullSize: t.fullSize, close: t.close, viewport: t.viewport }}
        >
          <SiteHeader lang={lang} />
          <main id="main">{children}</main>
          <SiteFooter lang={lang} />
          <Navigator
            lang={lang}
            labels={{ navigator: t.navigator, sections: t.sections, motion: t.motion, on: t.on, off: t.off, language: t.language }}
          />
          <Cursor />
        </LightboxProvider>
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
