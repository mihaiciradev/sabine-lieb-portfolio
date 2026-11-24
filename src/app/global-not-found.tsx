import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Sabine Lieb",
  robots: { index: false },
};

// For URLs outside every route; it renders without the [lang] layout.
export default function GlobalNotFound() {
  return (
    <html lang="ro">
      <body className="flex min-h-dvh flex-col justify-end px-[clamp(1rem,3.2vw,3rem)] pb-16">
        <p className="label text-oxblood">404</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-indigo">Nu e pe această planșă.</h1>
        <p lang="en" className="mt-3 font-serif text-2xl text-graphite">
          Not on this sheet.
        </p>
        <div className="mt-8 flex gap-6">
          <Link href="/" className="label border-b border-ink pb-1">
            Înapoi la index
          </Link>
          <Link href="/en" lang="en" className="label border-b border-ink pb-1">
            Back to the index
          </Link>
        </div>
      </body>
    </html>
  );
}
