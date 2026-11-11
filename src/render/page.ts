import { BRAND_ICONS, type BrandIcon } from "../content/brand-icons.ts";
import type { Featured, Icon, Language, Link, Org, Profile, Project, ShapeName, ShapePair } from "../content/types.ts";
import { html, raw, type SafeHtml } from "./html.ts";

/* ---------- Small building blocks --------------------------------------- */

const ms = (name: string, style?: string) => html`<span class="ms"${style ? raw(` style="${style}"`) : ""}>${name}</span>`;
const brand = (name: BrandIcon) => html`<svg class="si"><use href="#si-${name}" /></svg>`;
const icon = (value: Icon) => ("brand" in value ? brand(value.brand) : ms(value.symbol));

/** An SVG that the runtime turns into a (hover-)morphing M3 shape. */
const shape = (rest: ShapeName, hover?: ShapeName, extraClass = "") =>
  html`<svg class="shape${extraClass ? " " + extraClass : ""}" viewBox="0 0 100 100" data-shape="${rest}"${
    hover ? raw(` data-hover="${hover}"`) : ""
  } aria-hidden="true"><path /></svg>`;

const external = raw('target="_blank" rel="noopener"');
const me = raw('target="_blank" rel="me noopener"');

const LANGUAGE_COLORS: Record<Language, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  C: "#555555",
  Python: "#3572A5",
  "C#": "#178600",
  Swift: "#F05138",
  PowerShell: "#012456",
  Go: "#00ADD8",
  Kotlin: "#A97BFF",
};

/** Shapes handed out to project cards in order: [rest, hover]. */
const PROJECT_SHAPES: readonly ShapePair[] = [
  ["cookie9", "flower"],
  ["clover4", "cookie4"],
  ["sunny", "softBurst"],
  ["pentagon", "gem"],
  ["flower", "sunny"],
  ["gem", "cookie9"],
  ["cookie6", "clover8"],
  ["softBurst", "circle"],
  ["puffy", "burst"],
  ["cookie4", "pentagon"],
  ["clover8", "cookie12"],
  ["triangle", "cookie6"],
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "systems", label: "Systems" },
  { id: "tools", label: "Tools & apps" },
  { id: "bots", label: "Bots" },
] as const;

/* ---------- Sections ---------------------------------------------------- */

function iconSprite(): SafeHtml {
  const symbols = Object.entries(BRAND_ICONS).map(([id, d]) => html`<symbol id="si-${id}" viewBox="0 0 24 24"><path d="${d}" /></symbol>`);
  return html`<svg width="0" height="0" style="position: absolute" aria-hidden="true"><defs>${symbols}</defs></svg>`;
}

function emphasise(text: string, words: readonly string[]): SafeHtml {
  let out = html`${text}`.value;
  for (const word of words) out = out.replace(html`${word}`.value, html`<b style="color: var(--on-surface)">${word}</b>`.value);
  return raw(out);
}

function hero(p: Profile): SafeHtml {
  const [a, b, c] = p.tagline;
  return html`
    <article class="hero span-8 reveal" aria-labelledby="hero-name">
      <div class="hero-top">
        <button class="avatar" id="avatar" type="button" aria-label="Avatar. Tap to change its shape">
          <svg class="halo shape" viewBox="0 0 100 100" aria-hidden="true"><path id="avatar-halo" /></svg>
          <svg class="face" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <clipPath id="avatar-clip"><path id="avatar-clip-path" d="M50 0A50 50 0 1 1 50 100A50 50 0 1 1 50 0Z" /></clipPath>
            </defs>
            <g clip-path="url(#avatar-clip)">
              <rect width="100" height="100" style="fill: var(--primary)" />
              <text x="50" y="62" text-anchor="middle" style="fill: var(--on-primary); font: 800 34px var(--font)">${p.name.slice(0, 2)}</text>
              <image href="${p.avatar}" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
            </g>
          </svg>
          <span class="avatar-hint" aria-hidden="true">tap · <span id="avatar-shape-name">cookie 9</span></span>
        </button>

        <div class="hero-name">
          <h1 class="display" id="hero-name" data-letters>${p.name}</h1>
          <p class="aka">
            aka ${p.aka.map((name, i) => html`${i ? " · " : ""}<b>${name}</b>`)}
            <span aria-hidden="true">·</span>
            <span>${ms("location_on", "font-size: 18px; vertical-align: -3px")} ${p.location}</span>
          </p>
        </div>
      </div>

      <p class="tagline">${a} <em>${b}</em> ${c}</p>

      <p class="body-l muted" style="max-width: 60ch">${emphasise(p.bio, p.bioHighlights)}</p>

      <div class="hero-actions">
        <div class="btn-group" role="group" aria-label="Socials">
          ${p.socials.map(
            (s) =>
              html`<a class="btn icon size-m tonal ripple" href="${s.href}" ${me} data-tip="${s.label}" aria-label="${s.label}">${brand(s.icon)}</a>`,
          )}
        </div>
        <a class="btn size-m filled ripple" href="mailto:${p.email}">${ms("waving_hand")} Say hi</a>
      </div>
    </article>`;
}

function sideCards(p: Profile): SafeHtml {
  return html`
    <div class="span-4 stack">
      <article class="card tone-primary now-card reveal">
        <p class="label">Currently in the oven</p>
        <div class="row">
          <div class="loader on-primary" role="progressbar" aria-label="Baking"><svg class="shape" viewBox="0 0 100 100" data-loader><path /></svg></div>
          <p class="title-l">${p.now.project}</p>
        </div>
        <p>${p.now.description} <a href="${p.now.partner.href}" ${external}>${p.now.partner.name}</a>.</p>
      </article>

      <article class="card tone-high clock-card reveal" aria-label="Local time in ${p.location}">
        <div>
          <p class="label muted">Local time · ${p.location}</p>
          <p class="clock" id="clock" data-time-zone="${p.timeZone}">--:--</p>
          <p class="muted" id="clock-note" style="font-size: 14px">${p.timeZone}</p>
        </div>
        <div class="shape-icon" style="width: 72px; height: 72px; color: var(--tertiary)" data-morph-host>
          ${shape("sunny", "flower")} ${ms("schedule", "color: var(--on-tertiary); font-size: 32px")}
        </div>
      </article>

      <article class="card stats reveal" aria-label="GitHub numbers" data-github-user="${p.github}">
        <div class="stat"><b data-stat="repos">${p.stats.repos}</b><span>repositories</span></div>
        <div class="stat"><b>${p.stats.stars}</b><span>stars earned</span></div>
        <div class="stat"><b data-stat="followers">${p.stats.followers}</b><span>followers</span></div>
        <div class="stat"><b>${p.orgs.length}</b><span>organizations</span></div>
      </article>
    </div>`;
}

function recipeAndTerminal(p: Profile): SafeHtml {
  const lines = p.terminal.map((t) => {
    const output = t.output.startsWith("[")
      ? html`<span class="bar">${t.output.slice(0, t.output.indexOf("]") + 1)}</span>${t.output.slice(t.output.indexOf("]") + 1)}`
      : html`${t.output}`;
    return html`<span class="p">$</span> ${t.command}\n${output}`;
  });
  return html`
    <article class="card tone-tertiary recipe span-5 reveal" aria-labelledby="recipe-title">
      <p class="label" id="recipe-title">📜 House recipe</p>
      <ol>${p.recipe.steps.map((step) => html`<li>${step}</li>`)}</ol>
      <p style="opacity: 0.85">${p.recipe.footnote}</p>
    </article>

    <article class="card tone-inverse terminal span-7 reveal" aria-label="The baker's terminal">
      <div class="terminal-bar" aria-hidden="true"><i></i><i></i><i></i><span style="margin-left: 8px">the baker's terminal · zsh</span></div>
      <pre>${lines.map((line, i) => html`${i ? "\n\n" : ""}${line}`)}\n<span class="p">$</span> <span class="caret"></span></pre>
    </article>`;
}

function codeSample(code: string): SafeHtml {
  const lines = code.split("\n").map((line) => {
    if (line.startsWith("#") || line.startsWith("$")) return html`<span class="c">${line}</span>`;
    if (line.startsWith("@")) return html`<span class="k">${line}</span>`;
    const fn = /^fn (\w+)(.*)$/.exec(line);
    if (fn) return html`<span class="k">fn</span> <span class="f">${fn[1] ?? ""}</span>${fn[2] ?? ""}`;
    return html`${line}`;
  });
  return html`<pre class="code">${lines.map((l, i) => html`${i ? "\n" : ""}${l}`)}</pre>`;
}

function featuredCard(f: Featured): SafeHtml {
  const goStyle =
    f.tone === "secondary" ? raw(' style="background: var(--on-secondary-container); color: var(--secondary-container)"') : raw("");
  return html`
    <a class="card tone-${f.tone} featured span-${f.span} reveal" href="${f.href}" ${external} data-morph-host>
      ${shape(f.shape[0], f.shape[1], "big-shape")}
      <span class="go" aria-hidden="true"${goStyle}>${ms("arrow_outward")}</span>
      <p class="label">Pinned · ${f.org}</p>
      <h3>${f.name}</h3>
      <p${f.code ? "" : raw(' class="body-l"')}>${f.description}</p>
      ${f.code ? codeSample(f.code) : ""}
      ${f.meta
        ? html`<div class="meta">
            ${f.meta.map(
              (m) =>
                html`<span>${m.icon ? ms(m.icon) : ""} ${m.stat ? html`<b data-stat="${m.stat}">${m.text}</b>` : m.text}</span>`,
            )}
          </div>`
        : ""}
    </a>`;
}

function projectCard(p: Project, index: number, github: string): SafeHtml {
  const [rest, hover] = PROJECT_SHAPES[index % PROJECT_SHAPES.length] ?? ["circle", "cookie9"];
  return html`
    <a class="project state reveal" data-cat="${p.category}" href="${p.href ?? `https://github.com/${github}/${p.name}`}" ${external} data-morph-host>
      <div class="project-head">
        <span class="shape-icon">${shape(rest, hover)}${ms(p.icon)}</span>
        <span class="arrow" aria-hidden="true">${ms("arrow_outward")}</span>
      </div>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="project-foot">
        ${p.language ? html`<span class="lang" style="--c: ${LANGUAGE_COLORS[p.language]}">${p.language}</span>` : ""}
        ${p.stars ? html`<span class="stars">${ms("star")}${p.stars}</span>` : ""}
      </div>
    </a>`;
}

function projects(p: Profile): SafeHtml {
  return html`
    <section id="projects" aria-labelledby="projects-title">
      <div class="section-head">
        <div>
          <p class="label eyebrow">${ms("bakery_dining")} Fresh from the oven</p>
          <h2 class="headline" id="projects-title">Things I've baked</h2>
        </div>
        <div class="split" data-menu-root>
          <a class="btn tonal ripple" href="https://github.com/${p.github}?tab=repositories" ${external}>${ms("arrow_outward")} All <span data-stat="repos">${p.stats.repos}</span> repos</a>
          <button class="btn tonal trail ripple" type="button" aria-label="More kitchens" aria-haspopup="menu" aria-expanded="false" aria-controls="org-menu" data-menu-trigger>
            ${ms("expand_more")}
          </button>
          <div class="menu" id="org-menu" role="menu" style="top: calc(100% + 8px); right: 0">
            ${p.orgs.map(
              (o) =>
                html`<a class="menu-item" role="menuitem" href="https://github.com/${o.name}" ${external}>${ms(o.icon)}<span>${o.name}<small>${o.description}</small></span></a>`,
            )}
          </div>
        </div>
      </div>

      <div class="bento">${p.featured.map(featuredCard)}</div>

      <div class="section-head" style="margin: 32px 0 0">
        <div class="connected" role="radiogroup" aria-label="Filter projects">
          ${CATEGORIES.map(
            (c, i) =>
              html`<button class="btn ripple" type="button" role="radio" aria-checked="${i === 0 ? "true" : "false"}" data-filter="${c.id}">${ms("check")}${c.label}</button>`,
          )}
        </div>
        <p class="muted project-count" id="project-count" aria-live="polite">${p.projects.length} bakes</p>
      </div>

      <div class="projects">${p.projects.map((project, i) => projectCard(project, i, p.github))}</div>
    </section>`;
}

function orgItem(o: Org): SafeHtml {
  return html`<li>
    <a href="https://github.com/${o.name}" ${external} data-morph-host>
      <span class="shape-icon">${shape(o.shape[0], o.shape[1])}${ms(o.icon)}</span>
      <span><b>${o.name}</b><small>${o.description}</small></span>
      <span class="ms end">arrow_outward</span>
    </a>
  </li>`;
}

function ingredients(p: Profile): SafeHtml {
  const chips = (list: Profile["ingredients"]["vibe"], filled = false) =>
    html`<div class="chips">${list.map((i) => html`<span class="chip${filled ? " filled" : ""} lively">${brand(i.icon)}${i.name}</span>`)}</div>`;
  return html`
    <section id="ingredients" aria-labelledby="ingredients-title">
      <div class="section-head">
        <div>
          <p class="label eyebrow">${ms("cookie")} What goes in the dough</p>
          <h2 class="headline" id="ingredients-title">Ingredients</h2>
        </div>
      </div>

      <div class="bento">
        <article class="card ingredients span-7 reveal">
          <h3 class="title-m">The vibe ingredients <small>· what I vibecode with</small></h3>
          ${chips(p.ingredients.vibe)}
          <h3 class="title-m">Actual ingredients <small>· what I actually know how 2 use</small></h3>
          ${chips(p.ingredients.actual, true)}
          <div class="specials">
            ${p.specials.map((s) => html`<div class="special">${ms(s.icon)}<div><b>${s.title}</b><span>${s.text}</span></div></div>`)}
          </div>
        </article>

        <article class="card tone-tertiary span-5 reveal">
          <p class="label">The kitchens</p>
          <h3 class="title-l" style="margin-top: 6px">Organizations I bake in</h3>
          <ul class="org-list">${p.orgs.map(orgItem)}</ul>
        </article>

        <article class="card tone-outline reveal">
          <p class="label muted">The bread shelf</p>
          <h3 class="title-l" style="margin: 6px 0 16px">Domains I keep in the pantry</h3>
          <div class="shelf">${p.domains.map((d) => html`<a href="https://${d}" ${external}>${d}</a>`)}</div>
        </article>
      </div>
    </section>`;
}

function linkRow(l: Link): SafeHtml {
  const target = l.href.startsWith("mailto:") ? "" : me;
  return html`<a class="link reveal" href="${l.href}" ${target} data-morph-host>
    <span class="shape-icon">${shape(l.shape[0], l.shape[1])}${icon(l.icon)}</span>
    <span><b>${l.label}</b><small>${l.handle}</small></span>
    <span class="ms end">arrow_forward</span>
  </a>`;
}

function links(p: Profile): SafeHtml {
  return html`
    <section id="links" aria-labelledby="links-title">
      <div class="section-head">
        <div>
          <p class="label eyebrow">${ms("link")} Come say hi</p>
          <h2 class="headline" id="links-title">Find me around</h2>
        </div>
      </div>
      <div class="links">${p.links.map(linkRow)}</div>
    </section>`;
}

function footer(p: Profile): SafeHtml {
  return html`
    <footer class="footer reveal">
      <div class="shape-icon" data-morph-host>${shape("cookie12", "flower")} ${ms("bakery_dining")}</div>
      <p class="title-l">Thanks for stopping by the bakery.</p>
      <p class="muted">Made with ☕, curiosity, and an unreasonable amount of bread puns.</p>
      <small>© <span data-year>${new Date().getFullYear()}</span> ${p.name} · styled with Material 3 Expressive</small>
    </footer>`;
}

function dock(p: Profile): SafeHtml {
  const nav = [
    { href: "#about", label: "About", icon: "person" },
    { href: "#projects", label: "Projects", icon: "bakery_dining" },
    { href: "#ingredients", label: "Ingredients", icon: "cookie" },
    { href: "#links", label: "Links", icon: "link" },
  ];
  const discord = p.socials.find((s) => s.icon === "discord");
  const x = p.links.find((l) => "brand" in l.icon && l.icon.brand === "x");
  const fabItems: SafeHtml[] = [];
  if (discord) fabItems.push(html`<a class="fab-item" role="menuitem" href="${discord.href}" ${external}>${brand("discord")}Discord</a>`);
  if (x) fabItems.push(html`<a class="fab-item" role="menuitem" href="${x.href}" ${external}>${brand("x")}${x.handle}</a>`);
  fabItems.push(
    html`<button class="fab-item" role="menuitem" type="button" data-copy="${p.email}" data-close-menu>${ms("content_copy")}Copy email</button>`,
    html`<a class="fab-item" role="menuitem" href="mailto:${p.email}">${ms("mail")}Email me</a>`,
  );

  return html`
    <div class="dock">
      <nav class="toolbar" aria-label="Sections">
        ${nav.map((n) => html`<a class="btn icon ripple" href="${n.href}" data-nav data-tip="${n.label}" aria-label="${n.label}">${ms(n.icon)}</a>`)}
        <span class="sep" aria-hidden="true"></span>
        <div style="position: relative">
          <button class="btn icon ripple" type="button" id="palette-btn" aria-label="Color palette" aria-haspopup="true" aria-expanded="false" aria-controls="palette-menu" data-menu-trigger data-tip="Palette">
            ${ms("palette")}
          </button>
          <div class="menu palette-menu" id="palette-menu" role="dialog" aria-label="Choose a color">
            <p class="menu-title">Pick a dough</p>
            <div class="swatches" role="radiogroup" aria-label="Colors">
              ${p.palettes.map(
                (c, i) =>
                  html`<button class="swatch" type="button" role="radio" data-hue="${c.hue}" style="--sh: ${c.hue}" aria-label="${c.name}" aria-checked="${i === 0 ? "true" : "false"}" data-tip="${c.name}"></button>`,
              )}
            </div>
          </div>
        </div>
        <button class="btn icon ripple" type="button" id="theme-toggle" aria-label="Toggle theme" data-tip="Theme">${ms("dark_mode")}</button>
      </nav>

      <div class="fab-wrap" data-menu-root>
        <div class="fab-menu" id="fab-menu" role="menu" style="--n: ${fabItems.length}">
          ${fabItems.map((item, i) => raw(item.value.replace(' role="menuitem"', ` role="menuitem" style="--i: ${i}"`)))}
        </div>
        <button class="fab ripple" type="button" aria-label="Contact menu" aria-haspopup="menu" aria-expanded="false" aria-controls="fab-menu" data-menu-trigger>
          <span class="ms when-closed">waving_hand</span>
          <span class="ms when-open">close</span>
        </button>
      </div>
    </div>

    <div class="snackbar" id="snackbar" role="status" aria-live="polite">
      <span class="snackbar-text"></span>
      <button class="btn icon snackbar-close" type="button" aria-label="Dismiss">${ms("close")}</button>
    </div>`;
}

/* ---------- Page ---------------------------------------------------------- */

export function renderPage(p: Profile): SafeHtml {
  return html`
    ${iconSprite()}
    <a class="skip-link" href="#main">Skip to content</a>
    ${shape("softBurst", undefined, "backdrop")}

    <div class="page">
      <header class="topbar">
        <a class="brand" href="#about" aria-label="${p.name}, back to top">${shape("cookie9", undefined, "brand-mark")} ${p.name}</a>
        <span class="status-pill" title="GitHub status"><span class="dot" aria-hidden="true">${p.status.emoji}</span> ${p.status.text}</span>
      </header>

      <main id="main">
        <div class="bento" id="about">${hero(p)} ${sideCards(p)} ${recipeAndTerminal(p)}</div>
        ${projects(p)} ${ingredients(p)} ${links(p)}
      </main>

      ${footer(p)}
    </div>

    ${dock(p)}`;
}

/** Material Symbols used in some markup, so the icon font can be subset to just those glyphs. */
export function usedSymbols(markup: string, extra: readonly string[] = []): string {
  const names = new Set(extra);
  for (const match of markup.matchAll(/<span class="ms[^"]*"[^>]*>([a-z0-9_]+)<\/span>/g)) if (match[1]) names.add(match[1]);
  return [...names].sort().join(",");
}

/* ---------- <head> ---------------------------------------------------------- */

/** Fonts, favicon and the no-flash theme script, shared by every page. */
export function sharedHead(): SafeHtml {
  return html`
    <meta name="theme-color" content="#fbf8f4" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght,ROND@6..144,25..151,1..1000,0..100&amp;display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400..700&amp;display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&amp;icon_names=%ICON_NAMES%&amp;display=block" />
    <script>
      // Apply the saved theme before first paint (no flash)
      try {
        var m = localStorage.getItem("m5:mode"), h = localStorage.getItem("m5:hue");
        if (m === "light" || m === "dark") document.documentElement.dataset.theme = m;
        if (h) document.documentElement.style.setProperty("--h", h);
      } catch (e) {}
    </script>`;
}

/** Title, description and social-preview tags for the main page. */
export function pageMeta(p: Profile): SafeHtml {
  const [a, b, c] = p.tagline;
  const x = p.links.find((l) => "brand" in l.icon && l.icon.brand === "x");
  return html`
    <title>${p.name} · ${a.replace(".", ",")} ${b.replace(".", ",")} ${c.replace(".", "")}</title>
    <meta name="description" content="${p.name} (aka ${p.aka.join(", ")}): a developer from ${p.location} who builds web apps, small tools, kernels and self-hosted software from scratch. Currently baking ${p.now.project}." />
    <meta name="author" content="${p.name}" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${p.name} · ${a} ${b} ${c}" />
    <meta property="og:description" content="Developer from ${p.location}. Linux, web apps, little tools, systems tinkering &amp; self-hosting." />
    <meta property="og:image" content="${p.avatar.replace("s=400", "s=600")}" />
    <meta name="twitter:card" content="summary" />
    ${x ? html`<meta name="twitter:site" content="${x.handle}" />` : ""}`;
}
