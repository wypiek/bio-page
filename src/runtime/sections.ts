/* Page sections: expressive name, project filters, toolbar, scroll reveal, clock, live GitHub numbers. */
import { $, $$, withViewTransition } from "./dom.ts";
import { reduceMotion } from "./motion.ts";

/** Split [data-letters] text into spans so each letter can spring its variable-font axes. */
export function initLetters(): void {
  $$("[data-letters]").forEach((el) => {
    const text = el.textContent ?? "";
    el.setAttribute("aria-label", text);
    el.replaceChildren(
      ...[...text].map((ch, i) => {
        const span = document.createElement("span");
        span.textContent = ch;
        span.setAttribute("aria-hidden", "true");
        span.style.setProperty("--i", String(i));
        return span;
      }),
    );
  });
}

/** Connected button group (single select) filters the project cards. */
export function initProjectFilters(): void {
  const buttons = $$<HTMLButtonElement>("[data-filter]");
  const cards = $$(".project");
  const count = $("#project-count");

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter ?? "all";
      withViewTransition(() => {
        buttons.forEach((b) => b.setAttribute("aria-checked", String(b === button)));
        cards.forEach((card) => (card.hidden = filter !== "all" && card.dataset.cat !== filter));
        const visible = cards.filter((c) => !c.hidden).length;
        if (count) count.textContent = `${visible} bake${visible === 1 ? "" : "s"}`;
      }, !reduceMotion.matches);
    });
  }
}

/** Highlight the floating-toolbar item of the section in view. */
export function initToolbar(): void {
  const links = $$<HTMLAnchorElement>(".toolbar [data-nav]");
  const sections = links.map((a) => $(a.getAttribute("href") ?? "")).filter((s): s is HTMLElement => s !== null);
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === `#${entry.target.id}`));
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => observer.observe(s));
}

/** Cards rise in on a spring as they enter the viewport. */
export function initReveal(): void {
  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  $$(".reveal").forEach((el, i) => {
    el.style.setProperty("--stagger", `${(i % 4) * 60}ms`);
    observer.observe(el);
  });
}

function moodFor(hour: number): string {
  if (hour < 6) return "probably asleep (or compiling a kernel)";
  if (hour < 12) return "morning bake in progress";
  if (hour < 18) return "afternoon batch";
  return "late-night vibecoding hours";
}

export function initClock(): void {
  const clock = $("#clock");
  const note = $("#clock-note");
  if (!clock) return;
  const timeZone = clock.dataset.timeZone ?? "Europe/Warsaw";
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" });
  const hour = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "numeric", hourCycle: "h23" });
  const update = () => {
    const now = new Date();
    clock.textContent = time.format(now);
    if (note) note.textContent = moodFor(Number(hour.format(now)));
  };
  update();
  setInterval(update, 15_000);
}

interface GitHubUser {
  public_repos?: number;
  followers?: number;
}
interface GitHubRepo {
  stargazers_count?: number;
  forks_count?: number;
}

const formatNumber = (n: number) => new Intl.NumberFormat("en").format(n);

function setStat(name: string, value: number | undefined): void {
  if (typeof value !== "number") return;
  $$(`[data-stat="${name}"]`).forEach((el) => (el.textContent = formatNumber(value)));
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Refresh numbers from the GitHub API; the build-time values stay if it's rate limited. */
export async function refreshGitHubStats(user: string): Promise<void> {
  const [profile, meowcord] = await Promise.all([
    getJson<GitHubUser>(`https://api.github.com/users/${user}`),
    getJson<GitHubRepo>("https://api.github.com/repos/meowcorded/meowcord"),
  ]);
  setStat("repos", profile?.public_repos);
  setStat("followers", profile?.followers);
  setStat("meowcord-stars", meowcord?.stargazers_count);
  setStat("meowcord-forks", meowcord?.forks_count);
}
