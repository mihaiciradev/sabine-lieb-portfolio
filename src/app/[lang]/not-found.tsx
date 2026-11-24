import Link from "next/link";

// Rendered inside the [lang] layout; bilingual because the segment that failed may be the slug.
export default function NotFound() {
  return (
    <section className="gutter flex min-h-[80svh] flex-col justify-end pb-16 pt-32">
      <p className="label text-oxblood">404</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-indigo">
        Nu e pe această planșă.
      </h1>
      <p lang="en" className="mt-3 font-display text-2xl text-graphite">
        Not on this sheet.
      </p>
      <div className="mt-8 flex gap-6">
        <Link href="/" className="label border-b border-ink pb-1 hover:text-oxblood">
          Înapoi la index
        </Link>
        <Link href="/en" lang="en" className="label border-b border-ink pb-1 hover:text-oxblood">
          Back to the index
        </Link>
      </div>
    </section>
  );
}
