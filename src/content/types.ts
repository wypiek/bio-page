import type { BrandIcon } from "./brand-icons.ts";

/** Names in the M3 Expressive shape library (see src/runtime/shapes.ts). */
export type ShapeName =
  | "circle"
  | "oval"
  | "pill"
  | "square"
  | "triangle"
  | "pentagon"
  | "gem"
  | "cookie4"
  | "cookie6"
  | "cookie7"
  | "cookie9"
  | "cookie12"
  | "clover4"
  | "clover8"
  | "sunny"
  | "softBurst"
  | "burst"
  | "flower"
  | "puffy";

/** A shape at rest and the shape it morphs into on hover/focus. */
export type ShapePair = readonly [rest: ShapeName, hover: ShapeName];

/** Either a brand icon (inline SVG) or a Material Symbols ligature name. */
export type Icon = { brand: BrandIcon } | { symbol: string };

export type Category = "web" | "systems" | "tools" | "bots";

export type Language = "TypeScript" | "JavaScript" | "Rust" | "C" | "Python" | "C#" | "Swift" | "PowerShell" | "Go" | "Kotlin";

export interface Social {
  label: string;
  href: string;
  icon: BrandIcon;
}

export interface Project {
  name: string;
  category: Category;
  description: string;
  icon: string;
  language?: Language;
  stars?: number;
  /** Defaults to https://github.com/wypiek/<name> */
  href?: string;
}

export interface Featured {
  name: string;
  org: string;
  href: string;
  tone: "primary" | "secondary";
  span: 5 | 7;
  shape: ShapePair;
  description: string;
  meta?: readonly { icon?: string; text: string; stat?: string }[];
  /** Optional code sample shown inside the card. */
  code?: string;
}

export interface Org {
  name: string;
  description: string;
  icon: string;
  shape: ShapePair;
}

export interface Link {
  label: string;
  handle: string;
  href: string;
  icon: Icon;
  shape: ShapePair;
}

export interface Special {
  icon: string;
  title: string;
  text: string;
}

export interface Ingredient {
  name: string;
  icon: BrandIcon;
}

export interface Palette {
  name: string;
  hue: number;
}

export interface Profile {
  name: string;
  aka: readonly string[];
  location: string;
  timeZone: string;
  status: { emoji: string; text: string };
  avatar: string;
  github: string;
  email: string;
  tagline: readonly [string, string, string];
  bio: string;
  /** Words in the bio that get emphasised. */
  bioHighlights: readonly string[];
  socials: readonly Social[];
  now: { project: string; description: string; partner: { name: string; href: string } };
  stats: { repos: number; stars: number; followers: number };
  recipe: { steps: readonly string[]; footnote: string };
  terminal: readonly { command: string; output: string }[];
  featured: readonly Featured[];
  projects: readonly Project[];
  ingredients: { vibe: readonly Ingredient[]; actual: readonly Ingredient[] };
  specials: readonly Special[];
  orgs: readonly Org[];
  domains: readonly string[];
  links: readonly Link[];
  palettes: readonly Palette[];
}
