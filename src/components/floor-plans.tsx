"use client";

import Image from "next/image";
import { AnimatePresence, m as motion } from "motion/react";
import { useMotionOn } from "@/lib/motion";
import { useId, useRef, useState } from "react";
import { Zoomable, type LightboxImage } from "./lightbox";

type Floor = { label: string; image: LightboxImage };

// Going up a floor, the new sheet rises from below; going down, it drops in from above.
const slide = {
  enter: (d: number) => ({ y: `${d * 8}%`, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: `${d * -8}%`, opacity: 0 }),
};
const fade = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

/* Plans stacked like floors: pick a level and the sheet swaps in place. */
export function FloorPlans({ title, floors, initial = 0, floorLabel }: { title: string; floors: Floor[]; initial?: number; floorLabel: string }) {
  const [[i, dir], setState] = useState([initial, 1]);
  const reduce = !useMotionOn();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const floor = floors[i];
  const box = Math.max(...floors.map((f) => f.image.height / f.image.width));

  const select = (n: number) => {
    setState([n, n > i ? 1 : -1]);
    tabs.current[n]?.focus();
  };

  return (
    <div className="grid-sheet gap-y-6">
      <div className="col-span-4 md:col-span-3">
        <h2 className="label text-graphite">{title}</h2>
        <div
          role="tablist"
          aria-label={floorLabel}
          aria-orientation="vertical"
          className="mt-4 flex gap-1 md:flex-col-reverse md:items-start"
          onKeyDown={(e) => {
            const up = e.key === "ArrowUp" || e.key === "ArrowRight";
            const down = e.key === "ArrowDown" || e.key === "ArrowLeft";
            if (!up && !down) return;
            e.preventDefault();
            select(Math.max(0, Math.min(floors.length - 1, i + (up ? 1 : -1))));
          }}
        >
          {floors.map((f, n) => (
            <button
              key={f.label}
              ref={(el) => {
                tabs.current[n] = el;
              }}
              id={`${id}-tab-${n}`}
              role="tab"
              type="button"
              aria-selected={n === i}
              aria-controls={`${id}-panel`}
              tabIndex={n === i ? 0 : -1}
              onClick={() => select(n)}
              className={`font-display flex h-11 min-w-11 items-center justify-center border px-3 text-lg tabular-nums transition-colors md:h-12 md:w-16 ${
                n === i ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="label mt-4 text-graphite" aria-live="polite">
          {floor.image.caption}
        </p>
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${i}`}
        className="drawing relative col-span-4 overflow-hidden md:col-span-9"
        style={{ aspectRatio: `1 / ${box.toFixed(3)}` }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={floor.label}
            custom={dir}
            className="drawing-ground absolute inset-0"
            variants={reduce ? fade : slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Zoomable image={floor.image} className="!absolute inset-0 h-full">
              <Image
                src={floor.image.src}
                alt={floor.image.alt}
                fill
                quality={90}
                sizes="(min-width: 768px) 70vw, 100vw"
                className="object-contain mix-blend-multiply"
              />
            </Zoomable>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
