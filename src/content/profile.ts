import type { Profile } from "./types.ts";

/**
 * Everything on the page lives here. Edit this file to update the bio page;
 * the markup in src/render/page.ts is generated from it at build time.
 */
export const profile = {
  name: "m5rcel",
  aka: ["wypiek", "m5rcode"],
  location: "Poland",
  timeZone: "Europe/Warsaw",
  status: { emoji: "🍞", text: "baking…" },
  avatar: "https://avatars.githubusercontent.com/wypiek?s=400",
  github: "wypiek",
  email: "contact@m5rcel.com",
  tagline: ["small batches.", "clean code.", "crispy edges."],
  bio:
    "Full-stack developer who likes building things from scratch, breaking them by accident, and figuring out how to make them better. " +
    "Most days I'm messing around with Linux, writing web apps and little tools, exploring systems programming, " +
    "or self-hosting something that probably didn't need to be self-hosted.",
  bioHighlights: ["Linux", "web apps and little tools"],

  socials: [
    { label: "GitHub", href: "https://github.com/wypiek", icon: "github" },
    { label: "X / Twitter", href: "https://x.com/m5rceI", icon: "x" },
    { label: "Discord", href: "https://discord.com/users/318746314991206400", icon: "discord" },
    { label: "Steam", href: "https://steamcommunity.com/id/m5rcel", icon: "steam" },
  ],

  now: {
    project: "meowcord",
    description: "A self-hosted Discord clone with feature parity, message encryption and simple federation, baked together with",
    partner: { name: "tiago", href: "https://tiago.zip" },
  },

  stats: { repos: 148, stars: 138, followers: 46 },

  recipe: {
    steps: ["Start simple.", "Make it work.", "Keep it light.", "Give it character."],
    footnote: "And if it breaks, call it an experimental batch.",
  },

  terminal: [
    { command: "whoami", output: "m5rcel" },
    { command: "cat interests.txt", output: "linux  html  web  self-hosting  old stuff" },
    { command: "uname -a", output: "Linux bakery 6.x-arch #1 SMP PREEMPT x86_64 GNU/Linux" },
    { command: "oven --status", output: "[##########] freshly baked ideas, coming right up" },
  ],

  featured: [
    {
      name: "meowcord",
      org: "meowcorded",
      href: "https://github.com/meowcorded/meowcord",
      tone: "primary",
      span: 7,
      shape: ["clover4", "cookie4"],
      description:
        "A self-hosted Discord clone aiming for feature parity, with message encryption and simple federation between verified instances. " +
        "Uses the Discord-style UI you already know, no Discord account needed. Runs on Docker Compose or plain systemd.",
      meta: [
        { icon: "star", text: "58", stat: "meowcord-stars" },
        { icon: "fork_right", text: "31", stat: "meowcord-forks" },
        { text: "TypeScript · Bun" },
        { text: "AGPL-3.0" },
      ],
    },
    {
      name: "AXON",
      org: "theaxonproject",
      href: "https://github.com/theaxonproject/language",
      tone: "secondary",
      span: 5,
      shape: ["burst", "softBurst"],
      description:
        "A statically typed, compiled, general-purpose language. Fast to write, fast to run, fast to ship. It compiles down to C11 for native binaries.",
      code: "# generics, traits, match, Result + try\n@test\nfn adds()\n    assert_eq(1 + 1, 2)\n\n$ axc run examples/03_fibonacci.ax",
    },
  ],

  projects: [
    { category: "web", name: "3itter", language: "JavaScript", stars: 9, icon: "forum", description: "A Twitter clone styled with Material 3 Expressive." },
    { category: "web", name: "cinehorizon", language: "TypeScript", stars: 1, icon: "movie", description: "A Netflix-style streaming site that's easy to self-host, with an admin panel for uploading movies." },
    { category: "web", name: "keyhaven", language: "JavaScript", stars: 1, icon: "key", description: "A high-quality password manager with a self-hostable sync server." },
    { category: "web", name: "m3blog", icon: "article", description: "An open-source blog engine with a Material 3 UI. Easy to set up and maintain." },
    { category: "web", name: "Chirp", language: "Python", stars: 1, icon: "campaign", description: "A social platform that works like Twitter but looks like an Android app." },
    { category: "web", name: "mafh.net", language: "C#", stars: 1, icon: "cloud_upload", description: "My awesome file hoster, written in .NET." },
    { category: "systems", name: "Fit", language: "C", stars: 1, icon: "inventory_2", description: "Git's core object model (blobs, trees, commits, packfiles) rebuilt from scratch as a distributed backup and storage engine for Linux." },
    { category: "systems", name: "ComputeKERNEL", language: "Rust", icon: "memory", description: "An upcoming UNIX kernel that has to run on real hardware." },
    { category: "systems", name: "WinKERNEL", language: "C", stars: 1, icon: "developer_board", description: "A from-scratch kernel modelled on Windows 11. No Windows source code involved." },
    { category: "systems", name: "PhoenixOS", language: "C", stars: 1, icon: "desktop_windows", description: "A custom OS that looks like Windows 1.0/3.0 but feels like Linux." },
    { category: "systems", name: "bwfall", language: "C", stars: 6, icon: "waterfall_chart", description: "A binary waterfall visualizer for Linux, mainly for Arch and Alpine." },
    { category: "systems", name: "xile", language: "C", icon: "select_window", description: "An X11 display server for Windows and macOS, with IceWM." },
    { category: "tools", name: "rewind", language: "Rust", icon: "history", description: "An undo button for a whole project folder." },
    { category: "tools", name: "mpct", language: "Rust", stars: 1, icon: "handyman", description: "One binary, every tool: hashing, encoding, JSON/YAML/TOML, TOTP, QR, file crypto and networking." },
    { category: "tools", name: "TermiTune", language: "Rust", stars: 2, icon: "music_note", description: "A TUI local music player written in Rust, built for the people." },
    { category: "tools", name: "wingit", language: "PowerShell", stars: 2, icon: "download", description: "A package manager for Windows that installs apps from GitHub releases, or builds them from source." },
    { category: "tools", name: "spatial", language: "Swift", stars: 1, icon: "hub", description: "A filesystem visualizer that shows your files as an interactive node graph instead of folders." },
    { category: "tools", name: "Linkora", language: "C#", stars: 1, icon: "chat", description: "Windows Live Messenger, ported to Linux and macOS." },
    { category: "tools", name: "AURA", language: "Kotlin", icon: "dashboard", description: "An Android home dashboard in Material You with full dynamic color." },
    { category: "tools", name: "loop", language: "Swift", icon: "album", description: "A native SwiftUI music player for macOS with live Discord Rich Presence." },
    { category: "bots", name: "nightbite", language: "JavaScript", icon: "shield", description: "A really advanced Discord moderation bot, built by people for the people." },
    { category: "bots", name: "anthropicutility", language: "Go", icon: "rss_feed", description: "A Discord bot that posts Anthropic news from the RSS feed." },
    { category: "bots", name: "Pawsino", language: "Python", icon: "casino", description: "A cat-themed casino Discord bot. Gamble some (fake) Meowney." },
    { category: "bots", name: "phpelefant", language: "Python", stars: 1, icon: "pets", description: "A Telegram bot starring the beautiful PHP mascot, and more useful than Rose bot." },
  ],

  ingredients: {
    vibe: [
      { name: "Rust", icon: "rust" },
      { name: "Python", icon: "python" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "CSS", icon: "css" },
      { name: "SQLite", icon: "sqlite" },
    ],
    actual: [
      { name: "HTML5", icon: "html5" },
      { name: "Linux", icon: "linux" },
      { name: "Docker", icon: "docker" },
      { name: "Git", icon: "git" },
    ],
  },

  specials: [
    { icon: "handyman", title: "Handmade tools", text: "Small, practical utilities with no unnecessary fluff." },
    { icon: "dns", title: "Self-hosted goodies", text: "Software you can run and control yourself." },
    { icon: "science", title: "Web experiments", text: "Interfaces, weird ideas & the occasional nostalgic design." },
    { icon: "memory", title: "Systems tinkering", text: "Linux, low-level stuff, seeing how things work." },
  ],

  orgs: [
    { name: "meowcorded", description: "meowcord, the self-hosted Discord clone", icon: "pets", shape: ["cookie6", "flower"] },
    { name: "theaxonproject", description: "AXON programming language", icon: "code", shape: ["gem", "burst"] },
    { name: "m5rcel-vibecodes", description: "the experimental batches", icon: "auto_awesome", shape: ["sunny", "clover8"] },
    { name: "Xittered", description: "social experiments", icon: "forum", shape: ["pentagon", "cookie9"] },
  ],

  domains: [
    "m5rcel.com",
    "discord.lifestyle",
    "bugdroid.today",
    "isledelfino.net",
    "canonical.it.com",
    "noli.click",
    "noli.gay",
    "index.sarl",
    "teb.college",
    "cwel.college",
    "1997131.xyz",
  ],

  links: [
    { label: "GitHub", handle: "@wypiek", href: "https://github.com/wypiek", icon: { brand: "github" }, shape: ["cookie9", "circle"] },
    { label: "X / Twitter", handle: "@m5rceI", href: "https://x.com/m5rceI", icon: { brand: "x" }, shape: ["clover4", "square"] },
    { label: "Discord", handle: "m5rcel", href: "https://discord.com/users/318746314991206400", icon: { brand: "discord" }, shape: ["softBurst", "cookie12"] },
    { label: "Steam", handle: "m5rcel", href: "https://steamcommunity.com/id/m5rcel", icon: { brand: "steam" }, shape: ["pentagon", "sunny"] },
    { label: "Website", handle: "twitter.democrat", href: "https://twitter.democrat", icon: { symbol: "language" }, shape: ["gem", "cookie6"] },
    { label: "sire.lol", handle: "sire.lol/m5rcel", href: "https://sire.lol/m5rcel", icon: { symbol: "badge" }, shape: ["puffy", "clover8"] },
    { label: "Email", handle: "contact@m5rcel.com", href: "mailto:contact@m5rcel.com", icon: { symbol: "mail" }, shape: ["sunny", "pill"] },
  ],

  palettes: [
    { name: "Crust", hue: 55 },
    { name: "Sage", hue: 135 },
    { name: "Blueberry", hue: 230 },
    { name: "Plum", hue: 300 },
    { name: "Raspberry", hue: 15 },
  ],
} as const satisfies Profile;
