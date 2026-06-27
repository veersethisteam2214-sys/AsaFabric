# Asa Fabric — polish & interaction upgrade

## READ FIRST — stack reality
This site is **vanilla HTML/CSS/JS with no build step**: `index.html`,
`styles.css`, `app.js`. **GSAP 3.12** is loaded from a CDN and the code
feature-detects `window.gsap`. There is **no React, no Next.js, no
framer-motion, no package.json**.

Reference components live in `design-references/` — they are React/Next and are
**for visual/behavioral reference only**. Re-create their look and motion in
**vanilla JS**. Do **not** add React/framer-motion/any npm dependency and do
**not** introduce a build step. Match the patterns already in `app.js`.

For every task: first locate the exact code (give me the file + line range or
function name), then edit. Don't break existing behavior, the reduced-motion
fallbacks, or the no-JS `<noscript>` fallbacks. Honor `prefers-reduced-motion`
for every new animation.

---

## 1. Premium "liquid glass" buttons
Targets (all instances, sitewide): `.btn.btn-solid`, `.btn.btn-solid-light`,
`.btn-link`, `.btn-link.light` — includes **"View Catalog"**, **"Enquire about
wholesale"**, the stock/catalog CTAs, etc.

Redesign them into a **frosted / liquid-glass** style, applied consistently:
- Semi-transparent background with `backdrop-filter: blur()`, a soft inner+outer
  shadow for depth, a subtle 1px translucent border, and a faint top highlight
  so it reads like glass (not flat).
- **On hover, the button physically shifts a little** — a small translate/lift
  (e.g. `translateY(-2px)` plus a touch of scale) with a gentle glass-sheen or
  highlight sweep. Smooth `transition` ~180–220ms, ease-out. Add a subtle
  pressed state on `:active`.
- Keep a clear **primary vs. secondary** hierarchy (solid CTAs vs. link-style).
- Must stay legible on both the light page sections and the dark/photo
  backgrounds where these buttons currently sit.

## 2. Navigation bar — dock-style magnification
Target: `.nav-links`. Reference: `design-references/animated-dock.reference.tsx`.
Re-create the **macOS-dock hover magnification** in vanilla JS + CSS: on hover,
the hovered link (and its neighbours, falling off with distance) smoothly scale
up / lift with spring-like easing; everything settles back on mouse-leave. Keep
the existing links and anchors. Respect reduced-motion (no magnification then).

## 3. Hero — auto slideshow, remove manual controls
Target: `.hero` → `#slideshow` (`.slide` images) and `.slideshow-controls`
(`#slidePrev`, `#slideNext`, `#slideDots`).
- **Remove the manual controls entirely** (prev/next arrows + dots) from markup,
  CSS, and the app.js logic that wires them.
- Auto-advance through the 4 slides on a timer (**~5s each**) with a smooth
  **crossfade**, looping forever. Keep the existing parallax + scrim.
- Pause while the tab is hidden (`visibilitychange`) and on hover.

## 4. "Fabrics we carry" — auto rolling marquee
Target: `.fabric-rotator` → `#fabricRotator` (currently a JS-driven word
rotator; overline literally reads "Fabrics we carry"). Convert it into a
**continuous, seamlessly looping auto-scroll marquee** of the fabric names
(Chambray, Oxford Cotton, Cashmere Blend, Irish Linen, Egyptian Giza Cotton,
Heavyweight Twill, Raw Silk, Cotton Poplin…). Constant smooth motion, no jumps
at the loop seam, pause on hover. Keep the `<noscript>` static fallback.

## 5. Stats strip — scramble-in on scroll
Target: `.stats-strip` → each `.stat > strong` (the values **120–650**,
**24-hour**, **50+**, **Roll / Cut**) and its `<span>` label
("GSM range", "cut service", "fabric lots", …).
Implement a **text-scramble / decode reveal**: when the strip scrolls into view
(`IntersectionObserver`), the characters start randomized/scrambled, then rapidly
resolve into the correct final text, character by character. Fire **once** per
scroll-in. Numbers and symbols (`–`, `+`, `/`) must land exactly. Reduced-motion:
show final text immediately.

## 6. Featured Fabrics — hover-to-scroll, remove arrows
Target: `.featured #featured` → `#fanCarousel` / `#fanLayout`, controls
`.fan-controls` (`#fanPrev`, `#fanNext`, `#fanDots`). GSAP-driven fan carousel.
- **Remove the arrow buttons and dots** (`.fan-controls`) from markup, CSS, and
  app.js.
- Drive the carousel **by hover position instead**: when the cursor is over the
  **left portion** of the carousel it advances **left/backward**; over the
  **right portion** it advances **right/forward** — reproducing the same motion
  the arrows produced, continuing while hovered and stopping on mouse-leave.
  (Speed can ease in slightly with proximity to the edge.) Keep the GSAP
  fallback to a static row when `window.gsap` is absent.

## 7. World map — animate, and trigger on scroll
Target: `.world-map #reach` → `#worldMapStage` (SVG injected by app.js; the repo
already has `assets/world-dots.svg`). Reference:
`design-references/world-map.reference.tsx`.
Re-create in vanilla JS:
- Curved arc routes between city points that **draw on** with an animated
  gradient stroke, a **glowing dot travelling along each arc**, staggered starts,
  and **pulsing rings** at the endpoints.
- **Play the animation when the section enters the viewport** (`IntersectionObserver`),
  and replay each time it re-enters. This scroll trigger is the main fix — right
  now it's static.
- Use **light blue** for the routes/points (e.g. `#0ea5e9`/`#38bdf8`).

## 8. "Fabrics by use" — visual rework
Target: `.uses-section #uses` (heading "Fabrics by use") → `#useGrid`. This
section is still the default look and needs a distinct visual treatment.
**[FILL IN: what you dislike about it now + the direction you want — e.g. card
style, imagery, hover behavior, layout.]** Until you specify, propose 2 options
and wait for my pick.

## 9. Add color — light-blue accents, used creatively
The site is almost entirely black/white/cream. Introduce **light blue** as an
accent across **some** sections — but **do not just fill a section background
with a solid color**. Be tasteful and creative: gradient washes, accent
underlines/borders, hover states, the map routes, glass-button tints, an icon or
divider treatment. Keep it cohesive with the existing EB Garamond / Montserrat
type and the cream (`#FAF9F6`) base. Define the accent as a CSS variable so it's
tweakable in one place.

---

## Order of work
Do them one section at a time, smallest-risk first. Suggested: 1 → 5 → 3 → 4 →
6 → 2 → 7 → 9 → 8. After each, tell me the files/lines you changed so I can
review before you move on.
