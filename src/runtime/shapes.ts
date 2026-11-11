/* A procedural version of the M3 Expressive shape library, plus morphing.
   Every shape is sampled as N radii around the centre, so any two shapes
   can be interpolated point by point. */
import type { ShapeName } from "../content/types.ts";
import { Spring, SPRINGS, type SpringConfig } from "./motion.ts";

type Radii = readonly number[];
type Point = readonly [number, number];

const TAU = Math.PI * 2;
const N = 144;

const normalize = (rs: number[]): number[] => {
  const max = Math.max(...rs);
  return rs.map((r) => r / max);
};

/** Radial shape from r(θ). */
const radial = (fn: (theta: number) => number): Radii => normalize(Array.from({ length: N }, (_, i) => fn((i / N) * TAU)));

/** Lobed shapes: cookies, clovers, bursts, flowers. k < 1 → round lobes, k > 1 → pointy lobes. */
const lobed = (n: number, depth: number, k = 1, phase = -Math.PI / 2): Radii =>
  radial((t) => 1 - depth * (1 - ((Math.cos(n * (t - phase)) + 1) / 2) ** k));

/** Resample any star-shaped outline (points around 0,0) to N radii. */
function fromOutline(points: readonly Point[]): Radii {
  const polar = points
    .map(([x, y]): Point => [(Math.atan2(y, x) + TAU) % TAU, Math.hypot(x, y)])
    .sort((a, b) => a[0] - b[0]);
  const first = polar[0] ?? [0, 1];
  const lastPoint = polar[polar.length - 1] ?? [0, 1];
  const ext: Point[] = [[lastPoint[0] - TAU, lastPoint[1]], ...polar, [first[0] + TAU, first[1]]];
  let j = 0;
  return normalize(
    Array.from({ length: N }, (_, i) => {
      const t = (i / N) * TAU;
      while ((ext[j + 1]?.[0] ?? Infinity) < t) j++;
      const [a0, r0] = ext[j] ?? first;
      const [a1, r1] = ext[j + 1] ?? first;
      return r0 + ((r1 - r0) * (t - a0)) / (a1 - a0 || 1);
    }),
  );
}

const rotate = (points: readonly Point[], deg: number): Point[] => {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return points.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

/** Regular polygon with rounded corners (Minkowski sum of a polygon and a disc). */
function roundedPolygon(n: number, rounding: number, rot = -90): Radii {
  const pts: Point[] = [];
  const inner = 1 - rounding;
  for (let k = 0; k < n; k++) {
    const va = (k / n) * TAU;
    const cx = inner * Math.cos(va);
    const cy = inner * Math.sin(va);
    for (let s = 0; s <= 16; s++) {
      const phi = va - Math.PI / n + (s / 16) * (TAU / n);
      pts.push([cx + rounding * Math.cos(phi), cy + rounding * Math.sin(phi)]);
    }
    // straight edge to the next corner
    const nva = ((k + 1) / n) * TAU;
    const from: Point = [cx + rounding * Math.cos(va + Math.PI / n), cy + rounding * Math.sin(va + Math.PI / n)];
    const to: Point = [
      inner * Math.cos(nva) + rounding * Math.cos(nva - Math.PI / n),
      inner * Math.sin(nva) + rounding * Math.sin(nva - Math.PI / n),
    ];
    for (let s = 1; s < 12; s++) pts.push([from[0] + ((to[0] - from[0]) * s) / 12, from[1] + ((to[1] - from[1]) * s) / 12]);
  }
  return fromOutline(rotate(pts, rot));
}

function capsule(len: number, radius: number, rot: number): Radii {
  const pts: Point[] = [];
  for (let s = 0; s <= 40; s++) {
    const a = -Math.PI / 2 + (s / 40) * Math.PI;
    pts.push([len + radius * Math.cos(a), radius * Math.sin(a)]);
  }
  for (let s = 0; s <= 40; s++) {
    const a = Math.PI / 2 + (s / 40) * Math.PI;
    pts.push([-len + radius * Math.cos(a), radius * Math.sin(a)]);
  }
  for (let s = 1; s < 30; s++) pts.push([len - (2 * len * s) / 30, radius], [-len + (2 * len * s) / 30, -radius]);
  return fromOutline(rotate(pts, rot));
}

const ellipse = (rx: number, ry: number, rot: number): Radii =>
  fromOutline(
    rotate(
      Array.from({ length: 240 }, (_, i): Point => [rx * Math.cos((i / 240) * TAU), ry * Math.sin((i / 240) * TAU)]),
      rot,
    ),
  );

export const SHAPES: Record<ShapeName, Radii> = {
  circle: radial(() => 1),
  oval: ellipse(1, 0.68, -45),
  pill: capsule(0.42, 0.5, -45),
  square: roundedPolygon(4, 0.3, 45),
  triangle: roundedPolygon(3, 0.32),
  pentagon: roundedPolygon(5, 0.28),
  gem: roundedPolygon(6, 0.24, 0),
  cookie4: lobed(4, 0.2, 0.55, -Math.PI / 4),
  cookie6: lobed(6, 0.14, 0.6),
  cookie7: lobed(7, 0.12, 0.6),
  cookie9: lobed(9, 0.1, 0.6),
  cookie12: lobed(12, 0.08, 0.6),
  clover4: lobed(4, 0.42, 0.45, -Math.PI / 4),
  clover8: lobed(8, 0.24, 0.45),
  sunny: lobed(8, 0.09, 1.1),
  softBurst: lobed(10, 0.17, 1.4),
  burst: lobed(12, 0.26, 2.2),
  flower: lobed(8, 0.26, 0.8),
  puffy: lobed(10, 0.08, 0.35),
};

export const isShapeName = (value: string | undefined): value is ShapeName => value !== undefined && value in SHAPES;

/** Radii → smooth SVG path (quadratic curves through midpoints) in a 0 0 100 100 viewBox. */
export function toPath(radii: Radii, rotDeg = 0, scale = 1): string {
  const n = radii.length;
  const offset = (rotDeg * Math.PI) / 180;
  const pts = radii.map((r, i): Point => {
    const a = (i / n) * TAU + offset;
    const rr = 50 * scale * Math.max(r, 0.05);
    return [50 + rr * Math.cos(a), 50 + rr * Math.sin(a)];
  });
  const at = (i: number): Point => pts[(i + n) % n] ?? [50, 50];
  const mid = (p: Point, q: Point) => `${((p[0] + q[0]) / 2).toFixed(2)} ${((p[1] + q[1]) / 2).toFixed(2)}`;
  let d = `M${mid(at(-1), at(0))}`;
  for (let i = 0; i < n; i++) {
    const p = at(i);
    d += `Q${p[0].toFixed(2)} ${p[1].toFixed(2)} ${mid(p, at(i + 1))}`;
  }
  return d + "Z";
}

export interface MorphOptions {
  spring?: SpringConfig;
  rotation?: number;
  scale?: number;
}

/** An SVG path that morphs between library shapes on a spring. */
export class Morph {
  private from: Radii;
  private to: Radii;
  /** Extra rotation in degrees, e.g. for a continuous spin. */
  spin = 0;
  readonly scale: number;
  private readonly progress: Spring;
  private readonly rotation: Spring;

  constructor(
    private readonly path: SVGPathElement,
    shape: ShapeName = "circle",
    { spring = SPRINGS.fastSpatial, rotation = 0, scale = 1 }: MorphOptions = {},
  ) {
    this.from = this.to = SHAPES[shape];
    this.scale = scale;
    this.progress = new Spring(1, spring).on(() => this.render());
    this.rotation = new Spring(rotation, SPRINGS.defaultSpatial).on(() => this.render());
    this.render();
  }

  private current(): Radii {
    const t = this.progress.x;
    return this.from.map((r, i) => r + ((this.to[i] ?? r) - r) * t);
  }

  morphTo(shape: ShapeName, rotateBy = 0): void {
    this.from = this.current();
    this.to = SHAPES[shape];
    this.progress.x = 0;
    this.progress.to(1);
    if (rotateBy) this.rotation.to(this.rotation.target + rotateBy);
  }

  render(): void {
    this.path.setAttribute("d", toPath(this.current(), this.rotation.x + this.spin, this.scale));
  }
}
