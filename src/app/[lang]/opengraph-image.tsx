import { locales } from "@/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export function generateImageMetadata({ params }: { params: { lang: string } }) {
  const alt =
    params.lang === "en"
      ? "Sabine Lieb, architect in Timișoara: architecture portfolio, with the Banatul Philharmonic"
      : "Sabine Lieb, arhitect în Timișoara: portofoliu de arhitectură, cu Filarmonica Banatul";
  return [{ id: "card", size: ogSize, contentType, alt }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const ro = (await params).lang !== "en";
  return ogImage({
    eyebrow: ro ? "Arhitect · Timișoara" : "Architect · Timișoara",
    title: ro ? "Portofoliu de arhitectură" : "Architecture portfolio",
    footer: ro ? "6 proiecte · 2023–2026" : "6 projects · 2023–2026",
    cover: "work/filarmonica/cover.jpg",
  });
}
