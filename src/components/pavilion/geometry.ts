// Line model of the Ana Lupaș pavilion, read off the exploded axonometric and the
// section perspective: a tapered outer shell, the attic room it protects, the
// hipped ceiling and trusses over that room, and the roof grid capping the shell.
// Units are metres, y up. Dimensions are approximate; the drawings carry no scale.

export type V3 = [number, number, number];
export type Seg = [V3, V3];

export type Layer = {
  segs: Seg[];
  /** Displacement when fully taken apart. */
  explode: V3;
  core?: boolean;
  /** Shell faces travel outward along their own normal. */
  normal?: V3;
};

const B = 3; // shell half-width at the base
const T = 2.15; // shell half-width at the top
const H = 7.2; // shell height
const R = 1.85; // attic room half-width
const RH = 4.3; // attic wall height

const loop = (pts: V3[]): Seg[] => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
const lerp = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function shellFace(side: 0 | 1 | 2 | 3): Layer {
  // Corners counter-clockwise, then rotate per side.
  const rot = (p: V3): V3 => {
    const a = (side * Math.PI) / 2;
    return [p[0] * Math.cos(a) - p[2] * Math.sin(a), p[1], p[0] * Math.sin(a) + p[2] * Math.cos(a)];
  };
  const bl = rot([-B, 0, B]);
  const br = rot([B, 0, B]);
  const tr = rot([T, H, T]);
  const tl = rot([-T, H, T]);
  const segs: Seg[] = loop([bl, br, tr, tl]);
  // Panel joints, as drawn on the outer cladding.
  for (const t of [0.25, 0.5, 0.75]) segs.push([lerp(bl, br, t), lerp(tl, tr, t)]);
  if (side === 0) {
    // Entrance portal on the front face.
    const w = 0.55;
    const d = 0.9;
    const h = 2.4;
    segs.push(
      ...loop([[-w, 0, B + d], [w, 0, B + d], [w, h, B + d - 0.1], [-w, h, B + d - 0.1]]),
      [[-w, 0, B + d], [-w, 0, B - 0.05]],
      [[w, 0, B + d], [w, 0, B - 0.05]],
      [[-w, h, B + d - 0.1], [-w, h, B - 0.3]],
      [[w, h, B + d - 0.1], [w, h, B - 0.3]],
    );
  }
  const n = rot([0, 0.25, 1]);
  return { segs, explode: [0, 0, 0], normal: n };
}

function room(): Layer {
  const segs: Seg[] = [];
  const base: V3[] = [[-R, 0.2, -R], [R, 0.2, -R], [R, 0.2, R], [-R, 0.2, R]];
  const top: V3[] = base.map(([x, , z]) => [x, RH, z]);
  segs.push(...loop(base), ...loop(top));
  base.forEach((p, i) => segs.push([p, top[i]]));
  // High square windows on two walls, a doorway on the front.
  for (const x of [-0.9, 0.9]) {
    segs.push(...loop([[x - 0.45, 2.9, R], [x + 0.45, 2.9, R], [x + 0.45, 3.8, R], [x - 0.45, 3.8, R]]));
    segs.push(...loop([[R, 2.9, x - 0.45], [R, 2.9, x + 0.45], [R, 3.8, x + 0.45], [R, 3.8, x - 0.45]]));
  }
  segs.push([[-0.5, 0.2, R], [-0.5, 2.3, R]], [[0.5, 0.2, R], [0.5, 2.3, R]], [[-0.5, 2.3, R], [0.5, 2.3, R]]);
  return { segs, explode: [0, 0.6, 0], core: true };
}

function ceiling(): Layer {
  const e = R + 0.15;
  const s = 0.45;
  const outer: V3[] = [[-e, RH, -e], [e, RH, -e], [e, RH, e], [-e, RH, e]];
  const inner: V3[] = [[-s, RH + 0.9, -s], [s, RH + 0.9, -s], [s, RH + 0.9, s], [-s, RH + 0.9, s]];
  const segs: Seg[] = [...loop(outer), ...loop(inner)];
  outer.forEach((p, i) => segs.push([p, inner[i]]));
  return { segs, explode: [0, 2.4, 0], core: true };
}

function trusses(): Layer {
  const y = RH + 1.25;
  const c: V3 = [0, y + 0.35, 0];
  const segs: Seg[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 ? 2.4 : 2.0;
    const p: V3 = [Math.cos(a) * r, y, Math.sin(a) * r];
    segs.push([p, c], [p, [Math.cos(a) * r * 0.5, y + 0.18, Math.sin(a) * r * 0.5]]);
  }
  return { segs, explode: [0, 3.6, 0] };
}

function roofGrid(): Layer {
  const t = T;
  const segs: Seg[] = loop([[-t, H, -t], [t, H, -t], [t, H, t], [-t, H, t]]);
  for (const k of [-t / 3, t / 3]) {
    segs.push([[k, H, -t], [k, H, t]], [[-t, H, k], [t, H, k]]);
  }
  return { segs, explode: [0, 4.6, 0] };
}

function slab(): Layer {
  const e = B + 0.15;
  const lo: V3[] = [[-e, 0, -e], [e, 0, -e], [e, 0, e], [-e, 0, e]];
  const hi: V3[] = lo.map(([x, , z]) => [x, 0.2, z]);
  const segs: Seg[] = [...loop(lo), ...loop(hi)];
  lo.forEach((p, i) => segs.push([p, hi[i]]));
  return { segs, explode: [0, -0.8, 0] };
}

export const layers: Layer[] = [slab(), room(), ceiling(), trusses(), roofGrid(), shellFace(0), shellFace(1), shellFace(2), shellFace(3)];

export const SHELL_PUSH = 2.6;
export const HEIGHT = H;
