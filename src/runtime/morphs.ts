/* Wires the shape library to the page: hover morphs, the avatar and loading indicators. */
import type { ShapeName } from "../content/types.ts";
import { $, $$ } from "./dom.ts";
import { reduceMotion, SPRINGS } from "./motion.ts";
import { isShapeName, Morph } from "./shapes.ts";

const SVG_NS = "http://www.w3.org/2000/svg";

const pathOf = (svg: SVGSVGElement): SVGPathElement =>
  svg.querySelector("path") ?? svg.appendChild(document.createElementNS(SVG_NS, "path"));

/** Every <svg data-shape> becomes a shape; with data-hover it morphs when its host is hovered/focused. */
export function initShapes(): void {
  $$<SVGSVGElement>("svg[data-shape]").forEach((svg) => {
    const rest = svg.dataset.shape;
    if (!isShapeName(rest)) return;
    const morph = new Morph(pathOf(svg), rest, { rotation: Number(svg.dataset.rotate ?? 0) });
    const hover = svg.dataset.hover;
    if (!isShapeName(hover)) return;
    const host = svg.closest<HTMLElement>("[data-morph-host]") ?? svg;
    const enter = () => morph.morphTo(hover, 45);
    const leave = () => morph.morphTo(rest, -45);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focusin", enter);
    host.addEventListener("focusout", leave);
  });
}

const AVATAR_CYCLE: readonly ShapeName[] = ["cookie9", "flower", "clover4", "sunny", "pentagon", "cookie4", "gem", "puffy", "burst", "circle"];

const prettyShapeName = (name: string): string =>
  name
    .replace(/(\d+)/, " $1")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();

/** Tap the avatar to cycle its clip shape; the halo behind it spins gently. */
export function initAvatar(): void {
  const avatar = $("#avatar");
  const clipPath = $<SVGPathElement>("#avatar-clip-path");
  const haloPath = $<SVGPathElement>("#avatar-halo");
  if (!avatar || !clipPath || !haloPath) return;

  const clip = new Morph(clipPath, "cookie9", { spring: SPRINGS.fastSpatial });
  const halo = new Morph(haloPath, "softBurst", { spring: SPRINGS.defaultSpatial });
  const label = $("#avatar-shape-name");
  let index = 0;

  avatar.addEventListener("click", () => {
    index = (index + 1) % AVATAR_CYCLE.length;
    const next = AVATAR_CYCLE[index] ?? "circle";
    clip.morphTo(next, 40);
    halo.morphTo(AVATAR_CYCLE[(index + 3) % AVATAR_CYCLE.length] ?? "softBurst", -60);
    if (label) label.textContent = prettyShapeName(next);
  });

  if (reduceMotion.matches) return;
  const start = performance.now();
  const spin = (now: number) => {
    halo.spin = ((now - start) / 1000) * 8;
    halo.render();
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);
}

/** The M3 Expressive loading indicator morphs through seven shapes while rotating. */
const LOADER_SEQUENCE: readonly ShapeName[] = ["softBurst", "cookie9", "pentagon", "pill", "sunny", "cookie4", "oval"];

export function initLoaders(): void {
  $$<SVGSVGElement>("svg[data-loader]").forEach((svg) => {
    const morph = new Morph(pathOf(svg), LOADER_SEQUENCE[0], { spring: SPRINGS.fastSpatial, scale: 0.92 });
    if (reduceMotion.matches) return;

    const start = performance.now();
    const loop = (now: number) => {
      morph.spin = ((now - start) / 1000) * 90;
      morph.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    let step = 0;
    setInterval(() => {
      if (document.hidden) return;
      step = (step + 1) % LOADER_SEQUENCE.length;
      morph.morphTo(LOADER_SEQUENCE[step] ?? "circle", 90);
    }, 650);
  });
}
