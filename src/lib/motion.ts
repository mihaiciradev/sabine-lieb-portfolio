"use client";

import { useSyncExternalStore } from "react";

/*
 * Motion follows the visitor's system setting unless they choose otherwise in the
 * navigator. The choice lives on <html data-motion="on|off">, set before first
 * paint by MOTION_SCRIPT, so CSS, GSAP and Motion all read one switch.
 */
export const MOTION_KEY = "motion";

export const MOTION_SCRIPT = `try{var m=localStorage.getItem("${MOTION_KEY}");if(m!=="on"&&m!=="off")m=matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on";document.documentElement.dataset.motion=m}catch(e){document.documentElement.dataset.motion="on"}`;

export const motionOn = () => typeof document !== "undefined" && document.documentElement.dataset.motion === "on";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  return () => mo.disconnect();
};

/** Server render assumes motion off, so nothing hidden by animation ships in the HTML. */
export function useMotionOn() {
  return useSyncExternalStore(subscribe, motionOn, () => false);
}

export function setMotion(on: boolean) {
  document.documentElement.dataset.motion = on ? "on" : "off";
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  } catch {}
}
