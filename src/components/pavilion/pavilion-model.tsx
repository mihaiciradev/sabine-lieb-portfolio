"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motionOn } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type Fallback = { src: string; width: number; height: number; alt: string };
type Labels = { label: string; hint: string; fallback: string; attic: string; apart: string; assemble: string };

/*
 * The signature 3D moment: a line model of the pavilion that comes apart as it
 * scrolls into view, like Sabine's exploded axonometric. Drag or use the arrow keys
 * to turn it. The renderer is fetched only near the viewport; until then, and
 * without JS, the exploded drawing itself stands in.
 */
export function PavilionModel({ fallback, labels }: { fallback: Fallback; labels: Labels }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [apart, setApart] = useState(false);
  const state = useRef({ yaw: -0.62, explode: 0, manual: false, dragging: false, lastX: 0, idleAt: 0 });
  const control = useRef<{ setExplode: (v: number, animate: boolean) => void } | null>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    let cleanup = () => {};
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const { createRenderer } = await import("./renderer");
        if (cancelled) return;
        const css = getComputedStyle(document.documentElement);
        const r = createRenderer(cv, {
          ink: css.getPropertyValue("--color-ink").trim() || "#16171c",
          core: css.getPropertyValue("--color-oxblood").trim() || "#8e1d1d",
        });
        if (!r) return;
        setReady(true);
        const s = state.current;
        let raf = 0;
        let visible = true;
        let last = performance.now();

        const frame = (now: number) => {
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          if (motionOn() && !s.dragging && now - s.idleAt > 2500) s.yaw += dt * 0.18;
          r.draw(s.yaw, s.explode);
          raf = visible ? requestAnimationFrame(frame) : 0;
        };
        const kick = () => {
          if (!raf) {
            last = performance.now();
            raf = requestAnimationFrame(frame);
          }
        };

        // Pause drawing when off screen.
        const vis = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible) kick();
        });
        vis.observe(el);

        const tween = { v: 0 };
        control.current = {
          setExplode: (v, animate) => {
            gsap.killTweensOf(tween);
            tween.v = s.explode;
            if (!animate || !motionOn()) {
              s.explode = v;
              r.draw(s.yaw, s.explode);
              return;
            }
            gsap.to(tween, { v, duration: 1.4, ease: "power3.inOut", onUpdate: () => (s.explode = tween.v) });
          },
        };

        const st = ScrollTrigger.create({
              trigger: el,
              start: "top 70%",
              end: "center 40%",
              scrub: 0.8,
              onUpdate: (self) => {
                if (s.manual || !motionOn()) return;
                s.explode = gsap.parseEase("power2.inOut")(self.progress);
                setApart(self.progress > 0.5);
              },
            });

        const onResize = () => {
          r.resize();
          r.draw(s.yaw, s.explode);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(cv);
        onResize();
        kick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          vis.disconnect();
          ro.disconnect();
          st?.kill();
          gsap.killTweensOf(tween);
        };
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup();
    };
  }, []);

  const toggle = () => {
    const next = !apart;
    state.current.manual = true;
    setApart(next);
    control.current?.setExplode(next ? 1 : 0, true);
  };

  return (
    <figure className="drawing">
      <div
        ref={wrap}
        tabIndex={ready ? 0 : -1}
        role={ready ? "img" : undefined}
        aria-label={ready ? labels.label : undefined}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          state.current.yaw += e.key === "ArrowLeft" ? -0.2 : 0.2;
          state.current.idleAt = performance.now();
        }}
        onPointerDown={(e) => {
          const s = state.current;
          s.dragging = true;
          s.lastX = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = state.current;
          if (!s.dragging) return;
          s.yaw += (e.clientX - s.lastX) * 0.01;
          s.lastX = e.clientX;
          s.idleAt = performance.now();
        }}
        onPointerUp={() => (state.current.dragging = false)}
        onPointerCancel={() => (state.current.dragging = false)}
        className={`relative aspect-[4/5] w-full touch-pan-y select-none md:aspect-[5/6] ${ready ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <Image
          src={fallback.src}
          alt={fallback.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          quality={90}
          className={`object-contain transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
        />
        <canvas ref={canvas} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`} />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="label text-graphite">
          {ready ? labels.hint : labels.fallback} · <span className="text-oxblood">{labels.attic}</span>
        </span>
        {ready ? (
          <button type="button" onClick={toggle} aria-pressed={apart} className="label border border-ink px-3 py-2 hover:bg-ink hover:text-paper">
            {apart ? labels.assemble : labels.apart}
          </button>
        ) : null}
      </figcaption>
    </figure>
  );
}
