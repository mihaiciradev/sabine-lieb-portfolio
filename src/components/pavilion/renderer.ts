import { HEIGHT, SHELL_PUSH, layers, type V3 } from "./geometry";

const PITCH = 0.52; // axonometric tilt, close to her drawings' 30°

export type Colors = { ink: string; core: string };

/* Orthographic line renderer on a 2D canvas: no WebGL, no dependencies. */
export function createRenderer(canvas: HTMLCanvasElement, colors: Colors) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let w = 0;
  let h = 0;
  let dpr = 1;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  };

  const draw = (yaw: number, explode: number) => {
    if (!w) resize();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(PITCH);
    const sp = Math.sin(PITCH);
    // Fit the fully exploded model (about 13 m tall, 11 m wide) with margin.
    const scale = Math.min(w / 13.5, h / (HEIGHT + 7.5));
    const ox = w / 2;
    // Keep the model's vertical centre on the canvas centre as its parts spread apart.
    const centre = HEIGHT * 0.5 + explode * 1.9;
    const oy = h / 2 + (centre - HEIGHT * 0.3) * cp * scale;

    const project = (p: V3): [number, number, number] => {
      const x = p[0] * cy - p[2] * sy;
      const z = p[0] * sy + p[2] * cy;
      const y = p[1] - HEIGHT * 0.3;
      return [ox + x * scale, oy - (y * cp - z * sp) * scale, y * sp + z * cp];
    };

    ctx.lineCap = "round";
    for (const layer of layers) {
      const off: V3 = layer.normal
        ? [layer.normal[0] * SHELL_PUSH * explode, layer.normal[1] * SHELL_PUSH * explode, layer.normal[2] * SHELL_PUSH * explode]
        : [layer.explode[0] * explode, layer.explode[1] * explode, layer.explode[2] * explode];
      ctx.strokeStyle = layer.core ? colors.core : colors.ink;
      ctx.lineWidth = layer.core ? 1.25 : 1;
      for (const [a, b] of layer.segs) {
        const pa = project([a[0] + off[0], a[1] + off[1], a[2] + off[2]]);
        const pb = project([b[0] + off[0], b[1] + off[1], b[2] + off[2]]);
        // Lines nearer the viewer read darker, as in a hand-weighted axonometric.
        const depth = (pa[2] + pb[2]) / 2;
        ctx.globalAlpha = Math.max(0.22, Math.min(1, 0.62 + depth * 0.09));
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  };

  return { draw, resize };
}
