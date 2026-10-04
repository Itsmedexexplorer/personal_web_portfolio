import type { Shape } from "@/lib/content/types";

// Point clouds for the particle form. Each returns `count` xyz triples, roughly within a 3-unit radius.

type V = [number, number, number];
const R = Math.random;
const TAU = Math.PI * 2;
const rotX = (p: V, a: number): V => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)];
const rotY = (p: V, a: number): V => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
const rotZ = (p: V, a: number): V => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]];
const jit = (p: V, j: number): V => [p[0] + (R() - 0.5) * j, p[1] + (R() - 0.5) * j, p[2] + (R() - 0.5) * j];
const add = (p: V, o: V): V => [p[0] + o[0], p[1] + o[1], p[2] + o[2]];
const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const sph = (r: number): V => {
  const u = R() * 2 - 1, t = R() * TAU, s = Math.sqrt(1 - u * u);
  return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
};
/** a point on the outline of a rounded rectangle centred on the origin */
const roundRect = (w: number, h: number, r: number): V => {
  const straight = 2 * (w - 2 * r) + 2 * (h - 2 * r), arc = TAU * r, d = R() * (straight + arc);
  const hw = w / 2 - r, hh = h / 2 - r;
  if (d < arc) {
    const a = (d / arc) * TAU, cx = Math.cos(a) >= 0 ? hw : -hw, cy = Math.sin(a) >= 0 ? hh : -hh;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0];
  }
  const s = d - arc, top = w - 2 * r, side = h - 2 * r;
  if (s < top) return [-hw + s, h / 2, 0];
  if (s < 2 * top) return [-hw + (s - top), -h / 2, 0];
  if (s < 2 * top + side) return [w / 2, -hh + (s - 2 * top), 0];
  return [-w / 2, -hh + (s - 2 * top - side), 0];
};

const GEN: Record<Shape, (i: number, n: number) => V> = {
  // a planet of light dust with an orbital ring and a small moon
  globe(i, n) {
    const k = i / n;
    if (k < 0.66) {
      const m = i / (n * 0.66), y = 1 - 2 * m, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      return [Math.cos(th) * r * 1.55, y * 1.55, Math.sin(th) * r * 1.55];
    }
    if (k < 0.95) {
      const t = R() * TAU, rr = 2.15 + R() ** 2 * 0.7;
      return rotZ(rotX([Math.cos(t) * rr, (R() - 0.5) * 0.03, Math.sin(t) * rr], 0.38), 0.22);
    }
    return add(sph(0.22), [-2.6, 1.5, -0.5]);
  },
  // a clover sticker frame with a lens at its heart
  clover() {
    const C: [number, number][] = [[0.62, 0], [-0.62, 0], [0, 0.62], [0, -0.62]], r = 0.7;
    const inside = (x: number, y: number, skip: number) => C.some((c, j) => j !== skip && Math.hypot(x - c[0], y - c[1]) < r - 0.002);
    const k = R();
    if (k < 0.62) {
      for (let tries = 0; tries < 12; tries++) {
        const j = Math.floor(R() * 4), t = R() * TAU, x = C[j][0] + Math.cos(t) * r, y = C[j][1] + Math.sin(t) * r;
        if (!inside(x, y, j)) return rotX([x * 1.35, y * 1.35, (R() - 0.5) * 0.14], 0.35);
      }
    }
    if (k < 0.8) {
      const t = R() * TAU, rr = 0.36 + (R() < 0.5 ? 0 : 0.14);
      return rotX([Math.cos(t) * rr, Math.sin(t) * rr, (R() - 0.5) * 0.06], 0.35);
    }
    for (;;) {
      const x = (R() * 2 - 1) * 1.35, y = (R() * 2 - 1) * 1.35;
      if (inside(x / 1.35, y / 1.35, -1)) return rotX([x, y, (R() - 0.5) * 0.3], 0.35);
    }
  },
  // a quadcopter seen from above at an angle
  drone() {
    const k = R(), corner = Math.floor(R() * 4), ang = Math.PI / 4 + (corner * Math.PI) / 2;
    const cx = Math.cos(ang) * 1.35, cz = Math.sin(ang) * 1.35;
    let p: V;
    if (k < 0.22) { const t = R(); p = jit([Math.cos(ang) * t * 1.35, 0, Math.sin(ang) * t * 1.35], 0.06); }
    else if (k < 0.7) { const t = R() * TAU, rr = 0.62 + (R() - 0.5) * 0.05; p = [cx + Math.cos(t) * rr, 0.12 + (R() - 0.5) * 0.03, cz + Math.sin(t) * rr]; }
    else if (k < 0.82) { const l = (R() - 0.5) * 1.1; p = [cx + Math.cos(corner) * l, 0.14, cz + Math.sin(corner) * l * 0.15]; }
    else p = [(R() - 0.5) * 0.7, (R() - 0.5) * 0.26, (R() - 0.5) * 0.5];
    const q = rotX(p, 0.55);
    return [q[0] * 1.1, q[1] * 1.1, q[2] * 1.1];
  },
  // a hand-thrown vase with banding
  vase() {
    const y = R() * 2.8 - 1.4, t = (y + 1.4) / 2.8;
    let r = 0.3 + 0.78 * Math.sin(Math.min(1, t * 1.05) * Math.PI) ** 1.4 * (1 - 0.4 * t);
    if (t > 0.86) r = 0.3 + (t - 0.86) * 1.6;
    const a = R() * TAU, band = Math.abs(Math.sin(t * 22)) < 0.12 ? 1.03 : 1;
    return [Math.cos(a) * r * band, y, Math.sin(a) * r * band];
  },
  // a little pet head with ears, eyes and a smile
  pet() {
    const k = R(), onFace = (x: number, y: number): V => [x, y, Math.sqrt(Math.max(0, 1.21 - x * x - y * y)) + 0.04];
    if (k < 0.6) return sph(1.1);
    if (k < 0.76) {
      const s = R() < 0.5 ? -1 : 1, t = R(), a = R() * TAU, rr = (1 - t) * 0.34;
      return [s * (0.5 + t * 0.2) + Math.cos(a) * rr, 0.78 + t * 0.75, Math.sin(a) * rr];
    }
    if (k < 0.9) {
      const s = R() < 0.5 ? -1 : 1, a = R() * TAU, rr = Math.sqrt(R()) * 0.15;
      return onFace(s * 0.4 + Math.cos(a) * rr, 0.12 + Math.sin(a) * rr);
    }
    const t = (R() - 0.5) * 1.2;
    return onFace(t * 0.5, -0.32 - 0.18 * Math.cos(t * 2.4));
  },
  // a voice waveform
  wave() {
    const b = Math.floor(R() * 52), x = -2.3 + b * (4.6 / 51);
    const h = 0.12 + 1.25 * Math.abs(Math.sin(b * 0.71) * Math.sin(b * 0.23 + 1.3)) * Math.exp(-((x / 1.7) ** 2));
    return rotY([x, (R() * 2 - 1) * h, (R() - 0.5) * 0.14], -0.35);
  },
  // two chat bubbles, one typing
  chat() {
    const k = R();
    if (k < 0.45) return add(roundRect(2.3, 1.3, 0.5), [-0.35, 0.45, 0.3]);
    if (k < 0.52) { const t = R(); return [lerp([-1.0, -0.2, 0.3], [-1.35, -0.6, 0.3], t)[0], -0.2 - t * 0.4, 0.3]; }
    if (k < 0.62) { const d = Math.floor(R() * 3), a = R() * TAU, r = Math.sqrt(R()) * 0.13; return [-0.95 + d * 0.6 + Math.cos(a) * r, 0.45 + Math.sin(a) * r, 0.3]; }
    if (k < 0.95) return add(roundRect(1.8, 1.0, 0.42), [0.75, -0.75, -0.5]);
    const t = R(); return [1.25 + t * 0.35, -1.25 - t * 0.25, -0.5];
  },
  // a leaf with its veins, gently curled
  leaf() {
    const w = (t: number) => 0.78 * Math.sin(Math.PI * t) ** 0.9 * (1 - 0.25 * t);
    const k = R();
    let t = R(), x: number;
    if (k < 0.4) x = (R() < 0.5 ? -1 : 1) * w(t);
    else if (k < 0.55) x = 0;
    else if (k < 0.85) { const v = Math.floor(R() * 9) / 9 + 0.05, u = R(); t = v + u * 0.14; x = (R() < 0.5 ? -1 : 1) * w(t) * u; }
    else x = (R() * 2 - 1) * w(t);
    return rotZ([x, t * 3 - 1.5, 0.25 * Math.sin(Math.PI * t) - 0.2 * x * x], -0.5);
  },
  // a fanned stack of instant photos
  frames() {
    const f = Math.floor(R() * 3);
    const off = ([[-0.55, 0.12, -0.6, 0.2], [0, 0, 0, -0.04], [0.55, -0.12, 0.6, -0.22]] as const)[f];
    let x = 0, y = 0;
    for (let tries = 0; tries < 20; tries++) {
      x = (R() - 0.5) * 1.7; y = (R() - 0.5) * 2.05;
      const inPhoto = Math.abs(x) < 0.7 && y > -0.5 && y < 0.88;
      if (!inPhoto || R() < 0.08) break;
    }
    return rotY(add(rotZ([x, y, 0], off[3]), [off[0], off[1], off[2]]), 0.3);
  },
  // a terminal window with a prompt and lines of output
  terminal() {
    const k = R();
    if (k < 0.4) return rotY(roundRect(3.0, 2.0, 0.18), 0.28);
    if (k < 0.47) return rotY([(R() - 0.5) * 2.9, 0.62, 0], 0.28);
    if (k < 0.52) { const d = Math.floor(R() * 3), a = R() * TAU, r = Math.sqrt(R()) * 0.06; return rotY([-1.25 + d * 0.2 + Math.cos(a) * r, 0.81 + Math.sin(a) * r, 0], 0.28); }
    if (k < 0.6) { const t = R(), s = t < 0.5 ? t * 2 : (1 - t) * 2; return rotY([-1.2 + s * 0.22, 0.32 - t * 0.36, 0], 0.28); }
    const line = Math.floor(R() * 5), len = [1.6, 2.2, 1.1, 1.9, 0.8][line];
    return rotY([-0.85 + R() * len, 0.14 - line * 0.26, (R() - 0.5) * 0.04], 0.28);
  },
  // nodes joined by edges
  network: (() => {
    let nodes: V[] | null = null;
    const edges: [number, number][] = [];
    return () => {
      if (!nodes) {
        const ns = Array.from({ length: 16 }, () => sph(1.3 + R() * 0.5));
        nodes = ns;
        ns.forEach((a, i) => ns.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])] as const)
          .filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]).slice(0, 3).forEach(([j]) => edges.push([i, j])));
      }
      if (R() < 0.38) return jit(nodes[Math.floor(R() * nodes.length)], 0.2);
      const [i, j] = edges[Math.floor(R() * edges.length)];
      return jit(lerp(nodes[i], nodes[j], R()), 0.025);
    };
  })(),
  // a torus knot
  knot() {
    const t = R() * TAU, rr = 2 + Math.cos(3 * t);
    return jit([rr * Math.cos(2 * t) * 0.55, rr * Math.sin(2 * t) * 0.55, Math.sin(3 * t) * 0.55], 0.24);
  },
};

export function makeShape(shape: Shape, count: number): Float32Array {
  const out = new Float32Array(count * 3), gen = GEN[shape] ?? GEN.globe;
  for (let i = 0; i < count; i++) out.set(gen(i, count), i * 3);
  return out;
}
