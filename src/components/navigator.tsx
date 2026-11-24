"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, m as motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { setMotion, useMotionOn } from "@/lib/motion";
import { LangSwitch } from "./lang-switch";

type Section = { id: string; label: string; el: HTMLElement };

type Labels = {
  navigator: string;
  sections: string;
  motion: string;
  on: string;
  off: string;
  language: string;
};

/*
 * Where am I on this page? Every major block carries data-nav="Label"; this reads
 * them from the visible route and shows the current one, page progress and a list
 * to jump between them. A floating bar on all screens, plus a tick rail on desktop.
 */
export function Navigator({ labels, lang }: { labels: Labels; lang: "ro" | "en" }) {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  // Stays out of the way on the first screen, where the name and hero need the full height.
  const [shown, setShown] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const motionOn = useMotionOn();

  // Collect sections from the route currently on screen (hidden, preserved routes have no boxes).
  useEffect(() => {
    const collect = () => {
      const found = [...document.querySelectorAll<HTMLElement>("[data-nav]")]
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => ({ id: el.id, label: el.dataset.nav ?? "", el }));
      setSections(found);
    };
    collect();
    const t = setTimeout(collect, 300);
    return () => clearTimeout(t);
  }, [pathname]);

  // Scroll spy and progress, throttled to one read per frame.
  useEffect(() => {
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = innerHeight * 0.4;
      let i = 0;
      sections.forEach((s, n) => {
        if (s.el.getBoundingClientRect().top <= line) i = n;
      });
      setActive(i);
      setShown(scrollY > innerHeight * 0.6);
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.current?.style.setProperty("--progress", String(max > 0 ? Math.min(1, scrollY / max) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const close = useCallback(() => {
    setOpen(false);
    toggle.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-navigator]")) setOpen(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  const go = (s: Section) => {
    setOpen(false);
    s.el.scrollIntoView({ behavior: motionOn ? "smooth" : "auto", block: "start" });
    // Move focus with the view, for keyboard and screen reader users.
    s.el.setAttribute("tabindex", "-1");
    s.el.focus({ preventScroll: true });
  };


  if (!sections.length) return null;
  const current = sections[active];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* Desktop tick rail */}
      <nav aria-label={labels.sections} className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <ol className="flex flex-col items-end gap-2.5">
          {sections.map((s, n) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(s);
                }}
                aria-current={n === active ? "location" : undefined}
                className="group flex flex-row-reverse items-center gap-2 py-0.5"
              >
                <span
                  className={`block h-px bg-ink transition-[width,background-color] duration-500 ease-[var(--ease-draft)] ${
                    n === active ? "w-6 bg-oxblood" : "w-2.5 group-hover:w-5"
                  }`}
                />
                <span
                  className={`label whitespace-nowrap bg-paper/85 px-1 backdrop-blur transition-opacity duration-300 ${
                    "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Floating bar */}
      <div
        data-navigator
        inert={!shown && !open}
        className={`fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3 transition-[opacity,translate] duration-500 ease-[var(--ease-draft)] ${
          shown || open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="relative w-full max-w-[26rem]">
          <AnimatePresence>
            {open ? (
              <motion.div
                id={panelId}
                key="panel"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-[calc(100%+0.5rem)] origin-bottom overflow-hidden rounded-2xl bg-ink/92 text-paper shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] backdrop-blur-xl"
              >
                <p className="label px-5 pb-2 pt-4 text-paper/50">{labels.sections}</p>
                <ol className="max-h-[52svh] overflow-y-auto px-2 pb-2">
                  {sections.map((s, n) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => go(s)}
                        aria-current={n === active ? "location" : undefined}
                        className={`flex w-full items-baseline gap-4 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-paper/10 focus-visible:bg-paper/10 ${
                          n === active ? "text-paper" : "text-paper/65"
                        }`}
                      >
                        <span className={`label tabular-nums ${n === active ? "text-[#e08a7a]" : "text-paper/40"}`}>{pad(n + 1)}</span>
                        <span className="font-display text-lg leading-tight">{s.label}</span>
                        {n === active ? <span aria-hidden className="ml-auto size-1.5 self-center rounded-full bg-[#e08a7a]" /> : null}
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="flex items-center justify-between gap-3 border-t border-paper/15 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="label text-paper/50">{labels.language}</span>
                    <span className="label text-paper">{lang.toUpperCase()}</span>
                    <LangSwitch lang={lang} className="label rounded-full border border-paper/30 px-2.5 py-1 hover:bg-paper hover:text-ink" />
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={motionOn}
                    onClick={() => setMotion(!motionOn)}
                    className="flex items-center gap-2"
                  >
                    <span className="label text-paper/50">{labels.motion}</span>
                    <span className={`relative h-5 w-9 rounded-full transition-colors ${motionOn ? "bg-[#e08a7a]" : "bg-paper/25"}`}>
                      <span
                        className={`absolute top-0.5 size-4 rounded-full bg-paper transition-[left] duration-300 ${motionOn ? "left-[1.125rem]" : "left-0.5"}`}
                      />
                    </span>
                    <span className="label w-12 text-left">{motionOn ? labels.on : labels.off}</span>
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${labels.navigator}: ${current.label}, ${active + 1} / ${sections.length}`}
            className="group relative flex h-12 w-full items-center gap-3 overflow-hidden rounded-full bg-ink/88 pl-5 pr-2 text-paper shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] backdrop-blur-xl"
          >
            <span className="label tabular-nums text-paper/55">
              {pad(active + 1)}
              <span className="text-paper/30">/{pad(sections.length)}</span>
            </span>
            <span className="relative h-6 min-w-0 flex-1 overflow-hidden text-left">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={current.id}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 truncate font-display text-[1.05rem] leading-6"
                >
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </span>
            <span
              aria-hidden
              className={`grid size-8 place-items-center rounded-full bg-paper/12 transition-transform duration-300 group-hover:bg-paper/20 ${open ? "rotate-180" : ""}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8l4-4 4 4" />
              </svg>
            </span>
            <span ref={bar} aria-hidden className="absolute inset-x-5 bottom-1.5 h-px bg-paper/15">
              <span className="absolute inset-0 origin-left scale-x-[var(--progress,0)] bg-[#e08a7a]" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
