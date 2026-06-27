# design-references/ — READ THIS FIRST

These files are **visual + behavioral references only**. They are **React /
Next.js / framer-motion** components. **This project is vanilla HTML/CSS/JS**
(`index.html`, `styles.css`, `app.js`) with **GSAP loaded from a CDN** and
**no build step**.

## DO NOT
- Do **not** paste these `.tsx` files into the project.
- Do **not** add React, Next.js, framer-motion, `dotted-map`, `next-themes`,
  or `lucide-react` as dependencies.
- Do **not** create a `package.json` or a build pipeline.

## DO
- Read each reference to understand the **intended look and motion**, then
  **re-create that look and motion in vanilla JS** inside `app.js` (and CSS in
  `styles.css`), matching the patterns already used in this codebase.

## Files

### `world-map.reference.tsx`
The target for the **B2B Supply** section (`.world-map #reach`). In this repo
the map SVG is already injected by `app.js` into `#worldMapStage`, but it
renders **static**. Port these behaviors to vanilla JS:
- A dotted-grid world map background (the repo already has
  `assets/world-dots.svg` you can reuse).
- Curved arc routes between city points that **draw on** with an animated
  gradient stroke, a moving glowing dot travelling along each arc, staggered
  start times, and pulsing rings at the endpoints.
- **Trigger the animation when the section scrolls into view** (vanilla
  `IntersectionObserver`), and replay it each time it re-enters. This is the
  main thing that's currently missing.
- Accent/line color: **light blue** (e.g. `#0ea5e9` / `#38bdf8`), tuned to fit
  the site's palette.

### `animated-dock.reference.tsx`
The target **navigation bar** feel (`.nav-links`). Port the **macOS-dock
magnification** behavior to vanilla JS + CSS: on hover, the hovered nav item
(and neighbours, falling off with distance) smoothly scale up / lift with
spring-like easing. Keep the existing nav links and routes.
