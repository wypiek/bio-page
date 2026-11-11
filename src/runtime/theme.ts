/* Light/dark mode + dynamic color (a single OKLCH seed hue drives the scheme). */
import { $, $$, store, withViewTransition } from "./dom.ts";
import { reduceMotion } from "./motion.ts";

type Mode = "light" | "dark";

const root = document.documentElement;
const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const DEFAULT_HUE = "55";

const isMode = (value: string | null | undefined): value is Mode => value === "light" || value === "dark";
const isDark = (): boolean => (isMode(root.dataset.theme) ? root.dataset.theme === "dark" : prefersDark.matches);

function syncThemeColor(): void {
  requestAnimationFrame(() => {
    $('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.body).backgroundColor);
  });
}

function applyMode(mode: Mode | null): void {
  if (mode) root.dataset.theme = mode;
  else delete root.dataset.theme;
  const dark = isDark();
  const toggle = $("#theme-toggle");
  const icon = $(".ms", toggle ?? document);
  if (icon) icon.textContent = dark ? "light_mode" : "dark_mode";
  toggle?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  syncThemeColor();
}

function applyHue(hue: string): void {
  root.style.setProperty("--h", hue);
  $$("[data-hue]").forEach((el) => el.setAttribute("aria-checked", String(el.dataset.hue === hue)));
  syncThemeColor();
}

export function initTheme(): void {
  const savedMode = store.get("m5:mode");
  applyMode(isMode(savedMode) ? savedMode : null);
  applyHue(store.get("m5:hue") ?? DEFAULT_HUE);

  prefersDark.addEventListener("change", () => {
    if (!isMode(root.dataset.theme)) applyMode(null);
  });

  $("#theme-toggle")?.addEventListener("click", () => {
    const next: Mode = isDark() ? "light" : "dark";
    withViewTransition(() => {
      applyMode(next);
      store.set("m5:mode", next);
    }, !reduceMotion.matches);
  });

  $$("[data-hue]").forEach((el) =>
    el.addEventListener("click", () => {
      const hue = el.dataset.hue ?? DEFAULT_HUE;
      applyHue(hue);
      store.set("m5:hue", hue);
    }),
  );
}
