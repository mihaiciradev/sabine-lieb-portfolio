"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m as motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { useMotionOn } from "@/lib/motion";

export type IndexRow = {
  slug: string;
  href: string;
  number: string;
  title: string;
  kind: string;
  year: number;
  location: string;
  preview: { src: string; width: number; height: number; blur: string; alt: string };
};

/* A list first, so it reads on touch and to screen readers; on fine pointers a
   preview of the cover trails the cursor. */
export function ProjectIndex({ rows, viewLabel }: { rows: IndexRow[]; viewLabel: string }) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = !useMotionOn();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="border-t border-ink">
        {rows.map((row, i) => (
          <li key={row.slug} className="border-b border-ink">
            <Link
              href={row.href}
              data-cursor={viewLabel}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(null)}
              className="group grid-sheet items-baseline py-4 transition-colors hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper md:py-5"
            >
              <span className="label col-span-1 pl-1 text-oxblood group-hover:text-paper">{row.number}</span>
              <span className="col-span-3 font-display text-[clamp(1.35rem,3.2vw,2.75rem)] font-semibold leading-[1.02] tracking-tight md:col-span-6">
                {row.title}
              </span>
              <span className="label col-span-3 col-start-2 mt-2 text-graphite group-hover:text-paper/70 md:col-span-3 md:col-start-auto md:mt-0">
                {row.kind} · {row.location}
              </span>
              <span className="label col-span-1 hidden text-right tabular-nums md:block md:col-span-2 md:pr-2">{row.year}</span>
            </Link>
          </li>
        ))}
      </ol>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[min(26vw,380px)] md:block"
        style={{ x: reduce ? x : sx, y: reduce ? y : sy, translateX: "-50%", translateY: "-110%" }}
      >
        <AnimatePresence mode="popLayout">
          {active !== null ? (
            <motion.div
              key={rows[active].slug}
              initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/3] overflow-hidden bg-paper-2 shadow-[0_0_0_1px_var(--color-ink)]"
            >
              <Image
                src={rows[active].preview.src}
                alt=""
                fill
                sizes="380px"
                quality={72}
                placeholder="blur"
                blurDataURL={rows[active].preview.blur}
                className="object-cover"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
