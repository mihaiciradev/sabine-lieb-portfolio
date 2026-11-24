"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOn } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SLATS = 9;

/*
 * The museum's façade is a row of slanted, branching piers. Its image opens the
 * same way: leaning paper slats lift away one after another. Slats are added only
 * on the client and only while the image is still below the fold, so the image is
 * never covered for no-JS, motion-off or deep-linked visitors.
 */
export function SlatReveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionOn()) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      setArmed(true);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (!armed) return;
      gsap.fromTo(
        ".slat",
        { scaleY: 1, skewX: -9 },
        {
          scaleY: 0,
          skewX: -9,
          duration: 1.1,
          ease: "power3.inOut",
          stagger: { each: 0.07, from: "start" },
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          onComplete: () => setArmed(false),
        },
      );
    },
    { scope: root, dependencies: [armed] },
  );

  return (
    <div ref={root} className="relative overflow-hidden">
      {children}
      {armed ? (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 -left-[10%] -right-[10%] flex">
          {Array.from({ length: SLATS }, (_, i) => (
            <div key={i} className="slat h-full flex-1 origin-top bg-paper" style={{ marginLeft: -1 }} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
