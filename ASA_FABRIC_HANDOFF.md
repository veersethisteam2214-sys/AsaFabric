# Asa Fabric — Project Handoff & Status

> Handoff for the next AI agent. The previous agent (Claude) ran into usage
> limits; work is continuing in Codex. Everything below has been verified
> against the actual code in this repo. Read it fully before touching anything.

---

## 1. TL;DR / What this is

A marketing **landing page** for **"Asa Fabric"**, a fabric/textile company that
sells fabrics organised **by use** — shirtings, trousers, suitings, workwear
(plus linens). The goal is a premium, quiet-luxury, "billion-dollar brand" feel.

It is a **single static page**: `index.html` + `styles.css` + `app.js`. No
backend, no framework, no build.

---

## 2. Hard constraints (do NOT violate)

- **Vanilla HTML/CSS/JS only.** The whole site is three files: `index.html`,
  `styles.css`, `app.js`.
- **NO React, NO Next.js, NO Tailwind, NO framer-motion, NO npm dependencies
  shipped, NO build step.** Do not add a `package.json` for the website or a
  bundler.
- **GSAP is SELF-HOSTED** at `assets/gsap.min.js`, loaded via a normal
  `<script>` tag in `index.html`. The code **feature-detects** `window.gsap` and
  always provides a non-GSAP fallback. Do not switch it to a CDN or an npm
  import.
- The `*.reference.tsx` files in the repo root (`animated-dock.reference.tsx`,
  `world-map.reference.tsx`) and `README.md` are **React references for
  look/motion ONLY**. Re-create their behavior in vanilla JS — **never import
  them** and never reintroduce React.
- Always preserve **`prefers-reduced-motion`** handling and the **`<noscript>`**
  fallbacks already in the markup.
- Keep **ALL imagery LOCAL** under `assets/`. Do **not** reintroduce remote
  `lh3.googleusercontent.com` (Google Stitch) URLs or hotlinked Unsplash images
  — they expire / get blocked and the page falls back to grey.

---

## 3. Design system

Defined once in `:root` in `styles.css`.

**Palette**
- Canvas `#FAF9F6` (`--canvas`)
- Ink `#1A1A1A` (`--ink`)
- Muted `#444748` (`--muted`) and `#635d56` (`--muted-2`)
- Hairline `#c4c7c7` (`--hairline`)
- Legacy brown accent `#6F4E37` (`--accent`) — still present but superseded
- **Primary accent (blue):** `--accent-blue: #0ea5e9` and
  `--accent-blue-soft: #38bdf8`

**Type** (loaded via a Google Fonts `<link>`)
- **EB Garamond** — serif display / headlines
- **Montserrat** — sans body / labels (uppercase, letter-tracked)
- **Material Symbols Outlined** — icons

**Buttons** — Apple-style transparent **"liquid glass" OUTLINE** style driven by
`--glass-*` custom properties: near-transparent fill + `backdrop-filter` blur +
a thin translucent outline + a faint top highlight; rounded corners; a small
hover lift (`translateY(-2px) scale(1.02)`). Dark outline / dark text on light
sections (`.btn-solid`, `.btn-ghost`, `.btn-link`), white outline / white text
on the dark hero (`.btn-solid-light`, `.btn-link.light`). There is an
`@supports not (backdrop-filter ...)` opaque fallback.

**Layout** — 8px spacing base, `--container: 1440px` max width.

---

## 4. Page sections & JS features

Top → bottom in `index.html`, with the `app.js` function that drives each.
All animations honor `prefers-reduced-motion`.

| Section (markup) | Driven by (`app.js`) | Notes |
|---|---|---|
| Glass nav `#glassNav` + nav links `.nav-links` | `initNav` (scroll state + mobile menu) and `initNavDock` (macOS-dock magnification) | Dock target is `.nav-links`; Gaussian falloff writes `--dock-scale` / `--dock-lift`. |
| Hero slideshow `#slideshow` (`.hero`) | `initSlideshow` | Local SVG swatch images (`assets/fabrics/hero-1..4.svg`), parallax via `data-parallax`, `.slide-scrim` overlay; manual arrows/dots removed. ~5s crossfade. |
| Fabric-types marquee `#fabricRotator` | `initFabricRotator` | Seamless CSS-keyframe marquee (track duplicated twice); pause-on-hover is CSS. |
| Stats strip `.stats-strip` | `initStatsScramble` | Scramble/decode reveal of `.stat > strong` + `.stat > span` on scroll-in (once). |
| Featured Fabrics `#fanCarousel` / `#fanLayout` | `initFanCarousel` | GSAP fan carousel, **hover-position driven** advance (cursor left/right half steps the fan); static fallback if no GSAP. Images = `FAN_IMAGES`. |
| Fabrics by use `#uses` → `#useGrid` | `renderUseCases` | Editorial **Index** layout (large serif numeral + use name + reveal image), rendered from the `useCases` data array. |
| Why Asa `#why` | (static markup) | Values cards; reveal-on-scroll only. |
| Available Fabric Lots `#stock-teaser` | `initStockAssemble` | Teaser + 3-image collage with a scroll "assemble" animation (`.pre-assemble` → `.assembled`). **No selling here** — the CTA links to `#catalog`. |
| B2B world map `#reach` → `#worldMapStage` | `buildWorldMap` | Dotted background `assets/world-dots.svg` (+ inline dot-grid fallback) and light-blue routes that draw on scroll and **replay on re-enter** via IntersectionObserver. |
| Enquiry form `#contact` (`#leadForm`) | `initForm` | Bespoke styled `<select>`; submit is intercepted and shows `#formNote`. |
| Footer `.site-footer` | `initYear` (footer year) | Static otherwise. |

Other inits: `initScrollProgress`, `initReveal`, `initSmoothScroll`,
`initParallax`.

**IMPORTANT:** `#catalog` is an **intentionally empty** `<section
class="catalog-slot" id="catalog">` reserved for the catalogue team ("Shaan") to
implement. Do **not** fill it. The nav "Catalog" links and the "View Available
Stock" / "View Catalog" CTAs all resolve to this anchor.

**Resilient startup:** every init is wrapped in a `safe(fn, name)` try/catch
helper, so one feature throwing can't blank the rest of the page. If something
looks broken, check the console for `[init] <name> failed:`.

---

## 5. Upgrade-task status

See `ASA_FABRIC_UPGRADE_PROMPT.md` — 9 tasks, executed in the order
**1 → 5 → 3 → 4 → 6 → 2 → 7 → 9 → 8**. All 9 are **implemented and merged to
`main`**:

1. Buttons — liquid glass (later refined to the Apple outline style).
2. Dock-style nav magnification (`initNavDock`).
3. Auto hero slideshow; manual hero controls removed.
4. Fabric-types marquee (`initFabricRotator`).
5. Stats strip scramble-in (`initStatsScramble`).
6. Hover-position-driven Featured Fabrics carousel (`initFanCarousel`).
7. Animated light-blue B2B world map (`buildWorldMap`).
8. "Fabrics by use" — the **Index** layout was chosen (the Mosaic variant +
   its toggle were removed).
9. Blue accent system (`--accent-blue` / `--accent-blue-soft`).

> Note: `ASA_FABRIC_UPGRADE_PROMPT.md` still describes the older state (GSAP via
> CDN, references in a `design-references/` folder). Reality is GSAP
> self-hosted at `assets/gsap.min.js` and the `.reference.tsx` files live at the
> repo root. Trust this handoff and the actual code over that prompt.

---

## 6. Known issues / unresolved / fragile (honest)

**a. Imagery is PLACEHOLDER.** All fabric images are generated **local SVG
swatches** under `assets/fabrics/` (`hero-1..4`, `fan-1..10`, `collage-1..3`),
plus CSS-gradient "weave" backgrounds (`weaveBackground()`) for the use rows.
They look clean but are **not real photos**. **Action:** replace by swapping
those files or updating: the hero `<img src>`s in `index.html`, `FAN_IMAGES` in
`app.js`, and the collage rules (`.collage-a/b/c`) in `styles.css`.

**b. Hero auto-advance — FIXED.** The hero fills the viewport, so the cursor is
almost always over it. `initSlideshow` previously paused auto-advance on hover,
making the slideshow look frozen. It now **keeps auto-advancing regardless of
cursor position** (the hero `mouseenter`/`mouseleave` pause was removed). The
`visibilitychange` pause (pause when the tab is hidden) and the
`prefers-reduced-motion` opt-out (no auto-advance) are intact. Verified in a
real browser: with the mouse parked over the hero, the active slide and visible
image advance on their own.

**c. Logo.** The wordmark's "FABRICS" sub-line reads small; it was enlarged
(nav ~48px, footer ~78px) with a dark halo for contrast over the hero. A
purpose-made horizontal logo lockup would be cleaner. Assets:
`assets/logo-light.png` (white, for dark backgrounds) and `assets/logo-dark.png`
(for light backgrounds). The light/dark pair is swapped via opacity on
`.glass-nav.scrolled`.

**d. World map.** Hub = **Bangkok**; the 8 destination cities are
**placeholders** (`WORLD_HUB` / `WORLD_DESTINATIONS` in `app.js`). The
projection is a **naive equirectangular** map, so route endpoints may not line
up perfectly with the dotted background. Update with real B2B markets.

**e. Copy & stats are GENERIC PLACEHOLDERS.** No real founding date or real
numbers — the stats-strip values (e.g. "50+ fabric lots", "24-hour cut service")
are made up. Replace with real content. **Never use the word "deadstock".**

**f. Catalogue `#catalog` is empty by design** (the catalogue teammate owns it).

---

## 7. Verification lessons (critical)

- **Validate in a REAL browser**, not just `node --check` / brace-counting. A
  runtime error or a stale deploy will not show up in static checks.
- Use **Playwright + the pre-installed Chromium**:
  `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` — **do NOT run `playwright
  install`**. Serve locally with `python3 -m http.server 8099` and
  screenshot/assert against `http://localhost:8099/`.
- **Vercel gotchas:** production is **`asa-fabric.vercel.app`** (and the
  `-git-main-` alias). URLs containing a random hash like
  `asa-fabric-ktxl3wtfx-...` are **frozen per-deployment snapshots that NEVER
  update** — do not judge the live site by those.
- **Cache-busting:** set via `vercel.json` (no-cache headers on html/js/css)
  **plus** a `?v=` query token on the `styles.css` / `app.js` links in
  `index.html`. **Bump that token whenever you change those files.** Current
  value: `?v=20260627-4`.

---

## 8. Repo / branch / deploy

- **Active branch:** `claude/slack-session-8pw51m`. Merged to `main` via
  PRs #1–#5. Vercel **auto-deploys production from `main`**.
- **Key website files:** `index.html`, `styles.css`, `app.js`, `vercel.json`,
  and `assets/` (`gsap.min.js`, `logo-light.png`, `logo-dark.png`,
  `world-dots.svg`, `fabrics/*.svg`).
- **References / docs:** `ASA_FABRIC_UPGRADE_PROMPT.md`, `README.md`,
  `animated-dock.reference.tsx`, `world-map.reference.tsx` (and some loose
  prompt `.md` notes at the root).
- **Unrelated:** `google-sheets-tracking/` is a separate Python inventory
  pipeline. It is a different concern — **ignore it for the website**.

---

## 9. Suggested next steps for the next agent

1. Replace the placeholder SVG swatches with **real fabric photography**
   (update hero `<img>` srcs, `FAN_IMAGES`, and the collage CSS).
2. Real **copy** + real **stats** + a cleaner **logo lockup**.
3. Real **B2B hub / destination cities** (`WORLD_HUB` / `WORLD_DESTINATIONS`).
4. Coordinate the empty **`#catalog`** with the catalogue teammate ("Shaan").
5. Always **browser-verify** and **bump the `?v=` token**; check
   `asa-fabric.vercel.app` (not a random-hash URL).
