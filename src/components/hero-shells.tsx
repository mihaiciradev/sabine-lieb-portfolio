"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotionOn } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const shells = [
  { rotate: -5, scale: 1, stroke: "var(--color-ink)", opacity: 0.55, depth: 10 },
  { rotate: 3, scale: 1.04, stroke: "var(--color-ink)", opacity: 0.3, depth: 18 },
  { rotate: -1.5, scale: 1.08, stroke: "var(--color-indigo)", opacity: 0.85, depth: 28 },
];

/*
 * Outlines that start flush with the hero image and turn outward under three
 * labelled vectors: the "rotated core" diagram from the philharmonic concept sheet.
 * Afterwards they drift with the pointer at different depths, like layered tracing paper.
 * The image underneath is never hidden, so it still paints as the LCP element.
 * The server markup is the final state, which is what motion-off and no-JS get.
 */
export function HeroShells({ labels }: { labels: [string, string, string] }) {
  const root = useRef<HTMLDivElement>(null);
  const on = useMotionOn();

  useGSAP(
    () => {
      if (!on || !root.current) return;
      const els = gsap.utils.toArray<SVGRectElement>(".shell", root.current);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      els.forEach((el, i) => {
        tl.fromTo(
          el,
          { rotation: 0, scale: 1, opacity: 0, svgOrigin: "80 50" },
          { rotation: shells[i].rotate, scale: shells[i].scale, opacity: 1, svgOrigin: "80 50", duration: 1.6 },
          i * 0.12,
        );
      });
      // Explicit end states: an effect re-run must not capture a half-animated value.
      tl.fromTo(".vector", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.15, ease: "power2.inOut" }, 0.5)
        .fromTo(".vector-head", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.15 }, 1.3)
        .fromTo(".vector-label", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 1.35);

      if (!matchMedia("(pointer: fine)").matches) return;
      const layers = gsap.utils.toArray<HTMLElement>(".shell-layer", root.current);
      const movers = layers.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        movers.forEach((m, i) => {
          m.x(nx * shells[i].depth);
          m.y(ny * shells[i].depth);
        });
      };
      tl.eventCallback("onComplete", () => addEventListener("pointermove", onMove));
      return () => removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [on], revertOnUpdate: true },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0">
      {shells.map((s, i) => (
        <svg key={i} viewBox="0 0 160 100" preserveAspectRatio="none" className="shell-layer absolute inset-0 h-full w-full overflow-visible">
          <rect
            className="shell"
            x="0"
            y="0"
            width="160"
            height="100"
            fill="none"
            stroke={s.stroke}
            strokeOpacity={s.opacity}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            transform={`translate(80 50) rotate(${s.rotate}) scale(${s.scale}) translate(-80 -50)`}
          />
        </svg>
      ))}
      <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <g stroke="var(--color-oxblood)" strokeWidth="0.4" fill="none">
          <path className="vector" pathLength={1} strokeDasharray="1" d="M150 -12 L100 -12" />
          <path className="vector" pathLength={1} strokeDasharray="1" d="M171 0 L171 42" />
          <path className="vector" pathLength={1} strokeDasharray="1" d="M-9 112 L-14 80" />
        </g>
        <g fill="var(--color-oxblood)">
          <path className="vector-head" d="M101 -14.5 L96 -12 L101 -9.5 Z" />
          <path className="vector-head" d="M168.5 41 L171 46 L173.5 41 Z" />
          <path className="vector-head" d="M-16.4 81 L-14.6 76 L-11.6 80.2 Z" />
        </g>
      </svg>
      <span className="vector-label label absolute -top-[23%] right-[24%] text-oxblood">{labels[0]}</span>
      <span className="vector-label label absolute right-[-11%] top-[8%] text-oxblood [writing-mode:vertical-rl]">{labels[1]}</span>
      <span className="vector-label label absolute -left-[12%] bottom-[-8%] rotate-180 text-oxblood [writing-mode:vertical-rl]">{labels[2]}</span>
    </div>
  );
}
