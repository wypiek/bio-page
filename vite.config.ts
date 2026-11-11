import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import { profile } from "./src/content/profile.ts";
import { pageMeta, renderPage, sharedHead, usedSymbols } from "./src/render/page.ts";

/** Icons the runtime swaps in that never appear in the initial markup. */
const RUNTIME_SYMBOLS = ["light_mode", "dark_mode"];

/**
 * Renders the page from typed content at build (and dev) time, so the
 * output is plain static HTML: fast, crawlable and works without JS.
 */
function bioPage(): Plugin {
  return {
    name: "bio-page",
    transformIndexHtml: {
      order: "pre",
      handler(source) {
        const out = source
          .replace("<!-- bio:meta -->", pageMeta(profile).value)
          .replace("<!-- bio:head -->", sharedHead().value)
          .replace(/<!-- bio:page[^>]*-->/, renderPage(profile).value);
        return out.replace("%ICON_NAMES%", usedSymbols(out, RUNTIME_SYMBOLS));
      },
    },
  };
}

export default defineConfig({
  plugins: [bioPage()],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
});
