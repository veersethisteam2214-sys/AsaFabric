# Asa Fabric Website

Premium front-end for Asa Fabric, a textile stock house selling fabrics such as shirtings, suitings, trousering, chambray, wool blends, poly cotton, twills, linings, and clearance dead stock.

This is a pure vanilla static site — plain `index.html`, `styles.css`, and `app.js`. No frameworks, no build step, no npm, no external JS libraries. It runs by simply opening `index.html` in a browser (`file://`). All animation is hand-written CSS `@keyframes` and vanilla JavaScript.

## Landing page features

- **Cinematic animated hero** — layered drifting aurora gradient blobs over the dark ink/blue/green base, a Playfair Display headline with a brass gradient-text accent, and a staggered fade-up entrance (eyebrow, headline, lede, CTAs, preview).
- **Auto-scrolling fabric marquee** — a seamless looping strip of fabric types (Shirtings, Suitings, Trousering, Chambray, Wool blends, Poly cotton, Twills, Linings, Clearance lots) that pauses on hover.
- **Sticky nav with scroll state** — the header gains blur, solidity, shadow, and shrinks slightly once the page is scrolled.
- **Site-wide scroll reveal** — `IntersectionObserver` fades/translates section headings and card grids into view with staggered delays.
- **Animated count-up metrics** — a stats band whose numbers count up from zero when scrolled into view (fabric families, buyer categories, rolls in stock, typical lot confirmation time).
- **Shop by fabric use** (`#fabrics-uses`) — a premium category grid (Shirtings, Suitings, Trousering, Workwear Cloth, Linings & Support, Clearance Lots) with woven-texture visuals and a shine/border-glow hover. Clicking a card smooth-scrolls to the catalogue preview and pre-fills the search with a relevant keyword.
- **Catalogue preview + handoff** (`#catalog`) — the working search + filter-chip + fabric cards, framed as a preview, plus a prominent "Explore the full catalogue" CTA. The full live catalogue is owned and built by a teammate (Shaan); this page deliberately keeps only a polished preview and hands off to that work.
- **Why Asa trust band** — a 3-up value proposition with inline SVG icons.
- **Working contact form** (`#contact`) — client-side required-field validation, email format check, inline error messages, and an in-place success confirmation on valid submit. No backend.
- **Accessibility & motion** — semantic landmarks, labelled controls, skip link, focus-visible states, and full `prefers-reduced-motion: reduce` support (reveals show immediately; aurora, marquee, and float animations turn static).

## Files

- `index.html` — page structure, content, and section landmarks
- `styles.css` — palette/CSS variables, layout, textile treatments, and all `@keyframes` animation
- `app.js` — sample catalogue data, fabric-use categories, search + filters, scroll reveal, count-up, header scroll state, and the contact form

## Next steps

1. Connect the catalogue data to the real stock sheet or an exported CSV/JSON file.
2. Add real fabric photos for each lot.
3. Replace placeholder prices with confirmed roll and cut-length pricing.
4. Decide how enquiries should be handled: WhatsApp, email, form backend, or CRM.
5. Wire the "Explore the full catalogue" CTA to the teammate's full catalogue page once it ships.
