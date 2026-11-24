"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Zoomable, type LightboxImage } from "./lightbox";
import { useMotionOn } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Drawing = LightboxImage & { caption: string };

/*
 * The ground plan is cut along its section line: a red line runs across it,
 * the two halves part, and the section drawn on that line opens out of the gap.
 * Scroll-scrubbed on a sticky stage; with reduced motion the two drawings simply stack.
 */
export function PlanToSection({
  plan,
  section,
  cut,
  label,
  labels,
}: {
  plan: Drawing;
  section: Drawing;
  cut: number;
  label: string;
  labels: { plan: string; section: string; scrollToCut: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const on = useMotionOn();
  const planAspect = plan.height / plan.width;

  useGSAP(
    () => {
      const el = root.current;
      if (!on || !el) return;
      el.setAttribute("data-animated", "");
      ScrollTrigger.refresh();
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.fromTo(".cut-line", { scaleX: 0 }, { scaleX: 1, duration: 0.22 })
        .fromTo(".cut-label", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.16)
        .fromTo(".plan-top", { yPercent: 0, opacity: 1 }, { yPercent: -38, opacity: 0.12, duration: 0.42 }, 0.3)
        .fromTo(".plan-bottom", { yPercent: 0, opacity: 1 }, { yPercent: 38, opacity: 0.12, duration: 0.42 }, 0.3)
        .fromTo(".section", { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.42 }, 0.34)
        .fromTo(".cap-plan", { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0.36)
        .fromTo(".cap-section", { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.6)
        .to({}, { duration: 0.2 });
      return () => el.removeAttribute("data-animated");
    },
    { scope: root, dependencies: [on], revertOnUpdate: true },
  );

  // Height of the plan box; the plan is placed so its cut line sits on the stage centre.
  const ph = `min(74svh, calc(88vw * ${planAspect.toFixed(4)}))`;

  return (
    <div ref={root} className="group/pts relative">
      {/* Static fallback: plan, then section. */}
      <div className="gutter grid gap-10 py-16 group-data-[animated]/pts:hidden">
        <figure className="drawing mx-auto w-full max-w-3xl">
          <Zoomable image={plan}>
            <Image src={plan.src} alt={plan.alt} width={plan.width} height={plan.height} quality={90} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full" />
          </Zoomable>
          <figcaption className="label mt-3 text-graphite">{plan.caption}</figcaption>
        </figure>
        <figure className="drawing w-full">
          <Zoomable image={section}>
            <Image src={section.src} alt={section.alt} width={section.width} height={section.height} quality={90} sizes="100vw" className="h-auto w-full" />
          </Zoomable>
          <figcaption className="label mt-3 text-graphite">{section.caption}</figcaption>
        </figure>
      </div>

      {/* Animated stage: only shown once GSAP has taken over. */}
      <div className="hidden h-[320svh] group-data-[animated]/pts:block">
        <div className="sticky top-0 h-svh overflow-hidden bg-paper">
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ height: ph, aspectRatio: `${plan.width} / ${plan.height}`, top: `calc(50% - ${cut} * ${ph})` }}
          >
            {(["plan-top", "plan-bottom"] as const).map((cls) => (
              <div
                key={cls}
                className={`${cls} drawing absolute inset-0`}
                style={{ clipPath: cls === "plan-top" ? `inset(0 0 ${(1 - cut) * 100}% 0)` : `inset(${cut * 100}% 0 0 0)` }}
              >
                <Image src={plan.src} alt={cls === "plan-top" ? plan.alt : ""} fill quality={90} sizes="(min-width: 768px) 60vw, 90vw" className="object-contain mix-blend-multiply" />
              </div>
            ))}
            <div className="cut-line absolute left-[-6%] right-[-6%] h-0.5 origin-left bg-oxblood" style={{ top: `${cut * 100}%` }} />
            <span className="cut-label label absolute right-[-6%] -translate-y-[160%] text-oxblood" style={{ top: `${cut * 100}%` }}>
              {label}
            </span>
          </div>

          <div className="section absolute inset-x-[4vw] top-1/2 -translate-y-1/2">
            <div className="drawing relative" style={{ aspectRatio: `${section.width} / ${section.height}`, maxHeight: "70svh", marginInline: "auto" }}>
              <Image src={section.src} alt={section.alt} fill quality={90} sizes="92vw" className="object-contain mix-blend-multiply" />
            </div>
          </div>

          <p className="cap-plan label gutter absolute bottom-6 left-0 text-graphite">{plan.caption}: {labels.scrollToCut}</p>
          <p className="cap-section label gutter absolute bottom-6 left-0 text-graphite">{section.caption}</p>
          <div className="absolute bottom-5 right-[clamp(1rem,3.2vw,3rem)] flex gap-2">
            <Zoomable image={plan} hint={false} className="label !w-auto border border-ink bg-paper px-3 py-2">
              {labels.plan} +
            </Zoomable>
            <Zoomable image={section} hint={false} className="label !w-auto border border-ink bg-paper px-3 py-2">
              {labels.section} +
            </Zoomable>
          </div>
        </div>
      </div>
    </div>
  );
}
