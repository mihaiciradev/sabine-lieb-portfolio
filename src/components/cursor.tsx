"use client";

import { m as motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionOn } from "@/lib/motion";

/*
 * A drafting-compass ring that trails the pointer and names what a click will do
 * over elements marked data-cursor. The native cursor stays, so nothing is lost
 * when this is off: touch screens, motion off, or before hydration.
 */
export function Cursor() {
  const on = useMotionOn();
  const [fine, setFine] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!on || !fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [on, fine, x, y]);

  if (!on || !fine) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        animate={{ width: label ? 92 : 22, height: label ? 92 : 22, backgroundColor: label ? "rgb(255 255 255)" : "rgb(255 255 255 / 0)" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="label absolute inset-0 grid place-items-center text-black">{label}</span>
      </motion.div>
    </motion.div>
  );
}
