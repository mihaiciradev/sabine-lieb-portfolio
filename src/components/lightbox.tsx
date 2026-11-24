"use client";

import Image from "next/image";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m as motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMotionOn } from "@/lib/motion";

export type LightboxImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type LightboxLabels = { enlarge: string; drawing: string; fit: string; fullSize: string; close: string; viewport: string };

const Ctx = createContext<{ open: (image: LightboxImage, from: HTMLElement) => void; labels: LightboxLabels } | null>(null);

export function LightboxProvider({ children, labels }: { children: React.ReactNode; labels: LightboxLabels }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const [actual, setActual] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const reduce = !useMotionOn();

  const open = useCallback((next: LightboxImage, from: HTMLElement) => {
    returnFocus.current = from;
    setActual(false);
    setImage(next);
  }, []);

  const dismiss = useCallback(() => {
    setImage(null);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!image) return;
    close.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
      if (e.key !== "Tab" || !dialog.current) return;
      const focusable = dialog.current.querySelectorAll<HTMLElement>("button, [tabindex='0']");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [image, dismiss]);

  return (
    <Ctx.Provider value={{ open, labels }}>
      {/* Loads only the animation features this site uses; the index and floor plans share it. */}
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      {children}
      <AnimatePresence>
        {image ? (
          <motion.div
            ref={dialog}
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={image.caption ?? image.alt}
            className="fixed inset-0 z-[70] flex flex-col bg-paper"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="gutter flex items-center justify-between gap-4 border-b border-rule py-3">
              <p className="label truncate text-graphite">{image.caption ?? labels.drawing}</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setActual((v) => !v)}
                  aria-pressed={actual}
                  className="label border border-ink px-3 py-2 hover:bg-ink hover:text-paper"
                >
                  {actual ? labels.fit : labels.fullSize}
                </button>
                <button
                  ref={close}
                  type="button"
                  onClick={dismiss}
                  className="label bg-ink px-3 py-2 text-paper hover:bg-oxblood"
                >
                  {labels.close}
                </button>
              </div>
            </div>
            {/* Scrollable so a full-size drawing can be panned by touch, trackpad or keyboard. */}
            <div
              tabIndex={0}
              aria-label={labels.viewport}
              className={`relative min-h-0 flex-1 overscroll-contain ${actual ? "overflow-auto" : "overflow-hidden"}`}
            >
              <motion.div
                className={`drawing-ground ${actual ? "w-max p-4" : "absolute inset-0 p-4 md:p-8"}`}
                initial={reduce ? false : { scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {actual ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    quality={90}
                    sizes={`${Math.round(image.width / 1.25)}px`}
                    className="max-w-none mix-blend-multiply"
                    style={{ width: image.width / 1.25, height: "auto" }}
                  />
                ) : (
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      quality={90}
                      sizes="100vw"
                      className="object-contain mix-blend-multiply"
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </MotionConfig>
      </LazyMotion>
    </Ctx.Provider>
  );
}

export function Zoomable({
  image,
  children,
  className = "",
  hint = true,
}: {
  image: LightboxImage;
  hint?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(Ctx);
  return (
    <button
      type="button"
      onClick={(e) => ctx?.open(image, e.currentTarget)}
      aria-label={`${ctx?.labels.enlarge}: ${image.caption ?? image.alt}`}
      data-cursor={ctx?.labels.enlarge}
      className={`group relative block w-full cursor-zoom-in text-left ${className}`}
    >
      {children}
      {hint ? (
      <span
        aria-hidden
        className="label pointer-events-none absolute right-2 top-2 bg-paper/90 px-2 py-1 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {ctx?.labels.enlarge} +
      </span>
      ) : null}
    </button>
  );
}
