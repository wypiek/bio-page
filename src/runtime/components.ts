/* Expressive components: ripple, menus (split button, FAB menu, palette), snackbar. */
import { $, $$ } from "./dom.ts";
import { reduceMotion } from "./motion.ts";

/** Material ripple on anything with .ripple */
export function initRipple(): void {
  document.addEventListener("pointerdown", (event) => {
    const host = (event.target as Element | null)?.closest<HTMLElement>(".ripple");
    if (!host || reduceMotion.matches) return;
    const rect = host.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    Object.assign(dot.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${event.clientX - rect.left - size / 2}px`,
      top: `${event.clientY - rect.top - size / 2}px`,
    });
    host.append(dot);
    const remove = () => {
      dot.classList.add("out");
      setTimeout(() => dot.remove(), 400);
    };
    host.addEventListener("pointerup", remove, { once: true });
    host.addEventListener("pointerleave", remove, { once: true });
  });
}

/** Buttons with [data-menu-trigger] toggle the element named by aria-controls. */
export function initMenus(): void {
  const triggers = $$<HTMLButtonElement>("[data-menu-trigger]");
  const menuOf = (trigger: HTMLElement) => document.getElementById(trigger.getAttribute("aria-controls") ?? "");

  const setOpen = (trigger: HTMLElement, open: boolean) => {
    trigger.setAttribute("aria-expanded", String(open));
    menuOf(trigger)?.toggleAttribute("data-open", open);
    trigger.closest("[data-menu-root]")?.toggleAttribute("data-open", open);
  };
  const closeAll = (except?: HTMLElement) => triggers.forEach((t) => t !== except && setOpen(t, false));

  for (const trigger of triggers) {
    const menu = menuOf(trigger);
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = trigger.getAttribute("aria-expanded") !== "true";
      closeAll(trigger);
      setOpen(trigger, open);
      if (open) menu?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    });
    menu?.addEventListener("click", (event) => {
      event.stopPropagation();
      if ((event.target as Element | null)?.closest("a, [data-close-menu]")) closeAll();
    });
  }

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = triggers.find((t) => t.getAttribute("aria-expanded") === "true");
    closeAll();
    open?.focus();
  });
}

let snackTimer: ReturnType<typeof setTimeout> | undefined;

export function snack(message: string): void {
  const bar = $("#snackbar");
  const text = $(".snackbar-text", bar ?? document);
  if (!bar || !text) return;
  text.textContent = message;
  bar.toggleAttribute("data-open", true);
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => bar.removeAttribute("data-open"), 3200);
}

export function initSnackbar(): void {
  $("#snackbar .snackbar-close")?.addEventListener("click", () => $("#snackbar")?.removeAttribute("data-open"));

  $$("[data-copy]").forEach((el) =>
    el.addEventListener("click", async (event) => {
      event.preventDefault();
      const value = el.dataset.copy ?? "";
      try {
        await navigator.clipboard.writeText(value);
        snack(`Copied ${value}`);
      } catch {
        location.href = `mailto:${value}`;
      }
    }),
  );
}
