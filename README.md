# 🍞 m5rcel: bio page

> small batches. clean code. crispy edges.

The personal bio page of **m5rcel** (aka **wypiek** / **m5rcode**), a developer from Poland who builds web apps, little tools, kernels and self-hosted software from scratch.

It's styled with **[Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)** and written in **TypeScript**, built with [Vite](https://vite.dev). The page is rendered from typed content at build time, so what ships is fast static HTML plus about 13 KB of script.

## What's inside

| Material 3 Expressive idea | Where it shows up |
| :-- | :-- |
| **Spring motion physics** | `src/runtime/motion.ts` simulates the M3 Expressive spring tokens (fast/default/slow × spatial/effects) and turns them into CSS `linear()` easings, so every CSS transition moves on real springs. |
| **Shape library + morphing** | A procedural version of the M3 shapes (cookies, clovers, bursts, sunny, flower, pill, gem…). Tap the avatar to cycle through them. Icons morph on hover. |
| **Loading indicator** | The "currently in the oven" card uses the morphing, rotating M3 Expressive loading indicator. |
| **Buttons that change shape** | Buttons start round and turn square when pressed. Selected buttons stay squarer. |
| **Button groups** | Social buttons widen when pressed and push their neighbours aside. Project filters are a connected single-select group. |
| **Split button** | "All repos" plus a menu that rotates its chevron and lists the organizations. |
| **Floating toolbar + FAB menu** | A vibrant floating toolbar for navigation, palette and theme, and a FAB that opens a contact menu. |
| **Expressive type** | Google Sans Flex variable axes (`wght`, `wdth`, `ROND`) animate on hover. |
| **Dynamic color** | The whole scheme is built from one seed hue in OKLCH. Pick a "dough" (Crust, Sage, Blueberry, Plum, Raspberry). Light and dark themes are both supported. |

Reduced motion is respected everywhere.

## Editing the content

Everything on the page (bio, socials, projects, organizations, domains, links, palettes) lives in **`src/content/profile.ts`**. It's checked against the types in `src/content/types.ts`, so a typo in a shape name, language or icon fails the build instead of shipping. The markup is generated from it by `src/render/page.ts`.

## Run locally

Needs Node 22.12 or newer.

```bash
npm install
npm run dev        # dev server with hot reload
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Deploy to Cloudflare Pages

**From the dashboard (Git integration)**

1. Workers & Pages → Create → Pages → *Connect to Git* → pick this repo.
2. Framework preset: **None** (or Vite)
3. Build command: **`npm run build`**
4. Build output directory: **`dist`**

`.node-version` pins Node 22 for the Cloudflare build.

**From the CLI**

```bash
npm run deploy     # builds, then runs `wrangler pages deploy`
```

`wrangler.toml` points Wrangler at `dist/`. Cloudflare serves `404.html` for unknown paths, and `public/_headers` sets security headers and long-term caching for the fingerprinted assets.

## Structure

```
index.html, 404.html     page shells; the plugin in vite.config.ts fills them in
vite.config.ts           renders the page from the typed content at build time
src/
  content/profile.ts     all the content: edit this
  content/types.ts       types for the content (shapes, icons, languages…)
  content/brand-icons.ts brand icons (Simple Icons, CC0)
  render/html.ts         tiny escaping html`` template tag
  render/page.ts         the page markup, as TypeScript
  runtime/motion.ts      M3 Expressive springs → CSS linear() easings
  runtime/shapes.ts      the shape library and morphing
  runtime/morphs.ts      avatar, hover morphs, loading indicator
  runtime/components.ts  ripple, menus, snackbar
  runtime/sections.ts    filters, toolbar, reveal, clock, live GitHub stats
  runtime/theme.ts       light/dark + dynamic color
  main.ts, not-found.ts  entry points
  styles.css             M3 tokens (color, shape, motion, type) and components
public/                  copied as-is: favicon.svg, _headers
wrangler.toml            Cloudflare Pages config (output dir: dist)
```

---

Made with ☕, curiosity, and an unreasonable amount of bread puns.
