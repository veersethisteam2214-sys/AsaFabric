# Asa Fabric Website

Premium front-end concept for Asa Fabric, a textile stock house selling fabrics such as TC, wool blend, poly cotton, chambray, twill, shirting, trousering, and clearance dead stock.

## Current version

A premium, editorial landing page (zero-build static HTML/CSS/JS) styled like a
luxury textile house — dark charcoal base, warm ivory, brass accent.

Sections, in order:

1. Dismissible announcement bar
2. Sticky glassmorphic header (condenses on scroll, mobile hamburger)
3. Immersive hero — animated aurora/woven background, CSS swatch stack with parallax
4. Animated stat counters (trust strip)
5. "Crafted for every use" bento grid — segregated by use (Shirtings, Trousers, Suiting + coming-soon collections)
6. **Catalog (`#catalog`) — Sean's scope.** The landing page ships the shell (heading, search, filter chips, responsive cards) plus sample data; full filtering/data wiring is owned by Sean. The handoff boundary is marked with HTML comments in `index.html` and a banner comment in `app.js`.
7. Why Asa value cards (spotlight hover)
8. How-it-works timeline
9. Infinite fabric-type marquee
10. Big CTA band ("Start with a swatch box.")
11. Multi-column footer (keeps the GitHub repo link)

Animations: IntersectionObserver scroll-reveal, animated counters, sticky-header
condense, smooth-scroll, spotlight/lift hover, hero parallax — all guarded behind
`prefers-reduced-motion`. Responsive at ~560 / 820 / 1120px breakpoints.

The catalog inventory values are sample placeholders. They should be replaced with
the real stock data from the Google Sheet once access and structure are finalized.

## Files

- `index.html` - page structure and content
- `styles.css` - responsive visual design and textile treatments
- `app.js` - sample catalog data, use-case rendering, search, and filters

## Next steps

1. Connect the catalog data to the real stock sheet or an exported CSV/JSON file.
2. Add real fabric photos for each lot.
3. Replace placeholder prices with confirmed roll and cut-length pricing.
4. Decide how enquiries should be handled: WhatsApp, email, form backend, or CRM.
