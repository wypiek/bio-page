/* M3 Expressive motion physics
   - Spring tokens from the M3 Expressive motion scheme
   - CSS linear() easings generated from real spring simulations
   - A tiny spring animator for JS-driven values */

export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

export interface SpringConfig {
  stiffness: number;
  /** Damping ratio: 1 = critically damped, < 1 = bouncy. */
  damping: number;
}

export const SPRINGS = {
  fastSpatial: { stiffness: 800, damping: 0.6 },
  defaultSpatial: { stiffness: 380, damping: 0.8 },
  slowSpatial: { stiffness: 200, damping: 0.8 },
  fastEffects: { stiffness: 3800, damping: 1 },
  defaultEffects: { stiffness: 1600, damping: 1 },
  slowEffects: { stiffness: 800, damping: 1 },
} as const satisfies Record<string, SpringConfig>;

export type SpringToken = keyof typeof SPRINGS;

interface Simulation {
  samples: number[];
  dt: number;
  settle: number;
}

/** Simulate a unit spring (0 → 1) and return samples + settle time in seconds. */
function simulate({ stiffness, damping }: SpringConfig): Simulation {
  const dt = 1 / 600;
  const c = 2 * damping * Math.sqrt(stiffness);
  let x = 0;
  let v = 0;
  let settle = 0;
  const samples: number[] = [];
  for (let i = 1; i <= 600 * 3; i++) {
    const a = -stiffness * (x - 1) - c * v;
    v += a * dt;
    x += v * dt;
    samples.push(x);
    if (Math.abs(x - 1) > 0.002 || Math.abs(v) > 0.02) settle = i * dt;
  }
  return { samples, dt, settle: Math.max(settle, 0.06) };
}

function toLinear({ samples, dt, settle }: Simulation, points = 40): string {
  const out = [0];
  for (let i = 1; i < points; i++) {
    const idx = Math.min(samples.length - 1, Math.round((settle * i) / points / dt));
    out.push(+(samples[idx] ?? 1).toFixed(4));
  }
  out.push(1);
  return `linear(${out.join(",")})`;
}

/** Publish every spring token as --ease-* / --dur-* custom properties on :root. */
export function installSpringTokens(root: HTMLElement = document.documentElement): void {
  if (!CSS.supports("transition-timing-function", "linear(0, 1)")) return;
  for (const [name, cfg] of Object.entries(SPRINGS)) {
    const sim = simulate(cfg);
    const kebab = name.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    root.style.setProperty(`--ease-${kebab}`, toLinear(sim));
    root.style.setProperty(`--dur-${kebab}`, `${Math.round(sim.settle * 1000)}ms`);
  }
}

/* ---------- Spring animator ---------------------------------------------- */

const running = new Set<Spring>();
let rafId = 0;
let last = 0;

function tick(now: number): void {
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;
  for (const spring of running) if (!spring.step(dt)) running.delete(spring);
  rafId = running.size ? requestAnimationFrame(tick) : 0;
}

export class Spring {
  x: number;
  v = 0;
  target: number;
  private readonly subscribers = new Set<(value: number) => void>();

  constructor(
    value: number,
    private config: SpringConfig = SPRINGS.defaultSpatial,
  ) {
    this.x = value;
    this.target = value;
  }

  on(fn: (value: number) => void): this {
    this.subscribers.add(fn);
    return this;
  }

  private emit(): void {
    for (const fn of this.subscribers) fn(this.x);
  }

  set(value: number): void {
    this.x = this.target = value;
    this.v = 0;
    this.emit();
  }

  to(target: number, config?: SpringConfig): void {
    if (config) this.config = config;
    this.target = target;
    if (reduceMotion.matches) return this.set(target);
    running.add(this);
    if (!rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  }

  /** Advance by dt seconds. Returns false once the spring has settled. */
  step(dt: number): boolean {
    const { stiffness: k, damping: z } = this.config;
    const c = 2 * z * Math.sqrt(k);
    const n = Math.max(1, Math.ceil(dt * 240));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -k * (this.x - this.target) - c * this.v;
      this.v += a * h;
      this.x += this.v * h;
    }
    const moving = Math.abs(this.x - this.target) > 1e-4 || Math.abs(this.v) > 1e-3;
    if (!moving) {
      this.x = this.target;
      this.v = 0;
    }
    this.emit();
    return moving;
  }
}
