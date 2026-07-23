/* ============================================================
   Asa Fabric — data + interactions (vanilla JS, no build)
   ============================================================ */

/* ---------- Catalog dataset (preserved) ---------- */
const useCases = [
  {
    title: "Shirtings",
    overline: "Fine Weaves",
    description: "Crisp shirting, oxford, and chambray — easy-care cloth with reliable shade continuity.",
    count: "9 lots",
    tone: "academy",
    palette: ["#0f2a44", "#f4f0e7", "#b9c6d0"]
  },
  {
    title: "Trousers",
    overline: "Durable Twills",
    description: "Structured cotton and twill trousering for everyday wear and repeat tailoring orders.",
    count: "7 lots",
    tone: "executive",
    palette: ["#202631", "#b08a4f", "#d8dde2"]
  },
  {
    title: "Suitings",
    overline: "Refined Wools",
    description: "Wool-blend suiting with a refined hand-feel for tailored trousers, jackets, and blazers.",
    count: "5 lots",
    tone: "utility",
    palette: ["#33483d", "#c1a06a", "#2a2b28"]
  },
  {
    title: "Workwear",
    overline: "Heavy Canvas",
    description: "Hard-wearing twills, apron cloth, and utility shirting built for long-wear garments.",
    count: "6 lots",
    tone: "service",
    palette: ["#4b2034", "#f1e8db", "#8e785d"]
  },
  {
    title: "Linens",
    overline: "Natural Fibres",
    description: "Breathable linen and linen blends for shirts, dresses, and relaxed summer pieces.",
    count: "8 lots",
    tone: "clearance",
    palette: ["#733d2f", "#203d47", "#d6b472"]
  }
];

/* ---------- Catalogue product data (owned by the catalogue team) ----------
   The catalogue product dataset (formerly the `fabrics` array) and its render /
   search / filter logic have been removed from this landing page. The catalogue
   team (Shaan) owns that data and builds it inside the empty <section id="catalog">
   in index.html. `useCases` above stays — it drives the Fabrics-by-Use grid. */

/* ---------- Featured fabric image set ----------
   LOCAL fabric swatches under assets/fabrics/ that ALWAYS load (the previous
   remote Google Stitch image URLs expired and fell back to grey). Each
   card also keeps a solid bg-color fallback in CSS. To use real photos later,
   simply replace these files (or repoint each path) — one entry per card. */
const FAN_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LYmah0qxMDWkusl_mWHmxGx1VgMil9pUJ4zMyg73g_80LlL7b_JwvvIItlGnf7u8bD2J5HvMM67I45I1y-Dgmm_JxhHl1UHKyeoJ_0BWx8wo-OK9KuGPCEi2nDIsRW4WGxT7yRGULvMASfApnFNUND4cxnrbhom4BxhWhvOO2b-yom70Zdd8sEUMR58h0UJ53eEvDQhe8OIMzBFlgHleYZd0x_MWGL-dPONu3Hbk5OKNR3Ls1-ZnedkNih9mxf9ArBAcGDnKCVy-",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbvdngpXSNtB1nvFqZCpIBluAJKRDC6iQoLoZ51js-DFo0FEPWfpICn52zz12PdEKwNGCKhMeP4E_eRW-mHTnry34XgKUhkNcwXw8c4gEEOUXKp3SrAsb5MHIqjW6UXV9md4Oo1O0Yqc8DAdb39arWbesyxwO-gGhXRXShjwl998sn8t_IlNT_zqrxgdyNwExq_UQJd0gYfq4BIisRLxnifAZtqi9D3zRpm5C_Z125wsRDeu1VFfs07lwxzgw1cqlDZU_CgyPz6ST5",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBlVeETFTkn2Z1TvnKzeFQ6MlAN5PJ-ZTGBtVPnaBIbMzCC7JfXXUWA-qy9lGbvVJV7_bT92y83lImVAZFxbZhBFsEb-LtXysXVuY70za2fAjmyTo1CiWYXuB7JeHvPJE19ydp4EV0e3nYPSecrtZs5Weu-4Xcor65k9pV7FtBJn_JOlNZe2uxxQba2Ri6Fh0Ox9nODXGbMT1ZgNuqsehHm2cijt2S-30CUOkNa3r4KS_sB1zpeNO2h-b9bcTvsZbHJjYtMiVv6c-45",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC0k6HkXhr7ICsGOHVnruShsBIhp_jKMM46JuvxliUfYLS308zy5XVz48kLhmYcpDgL0mBH0s6MAQR6aqLVM-AC1dsFX--Y-SqzP2fH9LWCxM99O1G7o81KcVjE7d1RsWYTMsOhTyw999beI0vrcHIueeKoE4mflngslpxHv0HaubJZGc8dPLK_R7_kx9LC7eBm6C_PYlvdZ9nt5WmfBZZgR1kMt_LbR_ZdSLyBcIJQXXv4Vnv7gwJgeHQouiXPExSZN4Rqy2cPpvoO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBrKRQMPkj9whqTBcEcouVjVqOH2EsvXNRuWmsTNc8z2O-iNCOAqIstqbVIl3plTLQs5VSroutOGgdXgMN6DuaPpuqFlooc3YrWNtAmg5vJdklfIbhr1fejbaz3Sy9tKhMuQVMvjsNfLlga2EnaGtgDCQ7D6GARKpGSBq0QWzK5YlS1UXs1-M_py-RjBxs-MDlJxkNuqe-zSf4d0Ibna0ETQhcxwwvKoW92kTs3w7szc5aAwTU9k4wM20psFQIEvAtsX93x-LB-9x0O",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCB7nLQ7jDAhplw-nI9tQGWOilcDCCIyE5o_SI90kx1x02cXMljZ4gsoy3-yNpH10VFWGLydYHAPT8iRDbRMplkgvedtJWEBqAvl8LMP9F0gxOTSfxV0EHsqg0HAiiW5F4_6GQiZC9myK_GmhwPNAIRbCdeYmyVv6Reu7szcvRoSfafDHWs_j--8AcaELGX57iL-92QJsPXyY0ph_DNL1okzV8pnt9l0vf9JOITUCoebmvi7Vkzi0wCcfCOPforkIjzmGLfLBAQ305",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCfAohK-OLcYjqNf2faapYfSd4VC1sPUcAwXsQmaL1JkYXaGoI4vSrDiMCpJXfisheTRRsfUKWx9cD7T1uTu8v3kYSIG8Erqhw9EL_UuSOkfZ_B9ERsdr2hhFkJkWvHoy613yX0eBI4ljQKca_VpBkjNJlOwx9xHyZN-gd9k7M2IUnXYQOs_cDlNAXhXt2XzURQrJD8Z1QeuDRfu9QJqzMng8kYHqz-JN3gyN2G_YdGVjlxp_fZJ0R3JvdeFcBxSbvlR_jN_1fXw07E",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCxKJqw7r5w9WNHWlw7hH5NkqcsXT0NVAZmArsBT4a8OywePWWOA5pqtI-iBEQZ3BqbyIHj9Lcxjc_-E29nsjw4xf4inDeT05I5IIdFVU8NOhNGtHp1REKfJZSo7AB2QbjsVTMpZ9hT8kchFH2IxczacAOJ1P367awNht2GVHb_Ki502qwU8dECoyEQ53OrDy7wCHPR-EWmMNH6b3-mqTDvrZUZvwbonDba69eAJEwT_dUoYOz3-hYlgb-NMfRa65ewPicGPXp1SDYZ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDS1EyKV4GaCuS-UPMXCirvcg_bK6CNWPvuEBfe73CwbY3CclVj_R1bnxzaCnghf8y8AIgOL58Hh70qkdjK1XbsNnQKcQqtSUrCcb5QQXkCodGNxRaf5_xv7EcWbcWFjYUq-SEMHpDgvVJeqtFt48zHhYy615LZfMyhZLGyC3M41c7QUvkvxTzsq7O70BFtE55SjyQ99iDDqYZygjGiCHabOoCkl2ntJZtZpNlpT9DmlvDJZ5sWg6BJf5tJ6OSD0Dx-gwWWcw2vUDic",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDX4w398VAU_gaoZRJlDRLUCjtjCoZ4nuQ-Mo0Rw3ocJHdkuZstAHAShx9TQUDkZChmEbhiB7OwnQJsRR4Ehha_-Qx8YLH6fkQkgmtt67L4vp77Ss1_ro8Jw5hBasoF7vOtP6CsiqKj0H-gFfhJFPyBxEPlUYkUzqypLSjpVGeCb6AIcJPEo-j5rn-_pkCDTXby4Zyv7W2_GWb2MkW28dpike1VLEyNNrT4KLlHrdwy27gMVFMcsFqDMNVRju9zCILw4Y3WKFuY_3Na"
];

/* Local fabric-swatch fallbacks (assets/fabrics/fan-N.svg) — one per FAN_IMAGES
   entry, in the SAME order. If a remote photo above ever fails to load, the
   card <img> onerror handler silently swaps in the matching local swatch so a
   card is never blank. Do not delete these files. */
const FAN_IMAGES_FALLBACK = [
  "assets/fabrics/fan-1.svg",
  "assets/fabrics/fan-2.svg",
  "assets/fabrics/fan-3.svg",
  "assets/fabrics/fan-4.svg",
  "assets/fabrics/fan-5.svg",
  "assets/fabrics/fan-6.svg",
  "assets/fabrics/fan-7.svg",
  "assets/fabrics/fan-8.svg",
  "assets/fabrics/fan-9.svg",
  "assets/fabrics/fan-10.svg"
];

const FAN_CARDS = [
  { title: "Egyptian Giza Cotton", tag: "Cotton" },
  { title: "Organic Irish Linen", tag: "Linen" },
  { title: "Oxford Shirting", tag: "Cotton" },
  { title: "Heavyweight Twill", tag: "Twill" },
  { title: "Chambray Weave", tag: "Cotton" },
  { title: "Wool-Blend Suiting", tag: "Wool" },
  { title: "Washed Linen", tag: "Linen" },
  { title: "Cotton Poplin", tag: "Cotton" },
  { title: "Raw Canvas", tag: "Cotton" },
  { title: "Soft Flannel", tag: "Cotton" }
].map((c, i) => ({
  ...c,
  img: FAN_IMAGES[i % FAN_IMAGES.length],
  fallback: FAN_IMAGES_FALLBACK[i % FAN_IMAGES_FALLBACK.length]
}));

/* ---------- Helpers ---------- */
// Refined woven-cloth texture from a fabric's palette (CSS fallback that always renders).
function weaveBackground(colors) {
  const [first, second, third] = colors;
  return `radial-gradient(120% 120% at 26% 18%, ${third}66, transparent 56%), ` +
    `linear-gradient(135deg, ${first} 0%, ${second} 60%, ${third} 100%), ` +
    `repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 8px), ` +
    `repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 8px)`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// These two prompt-specific interactions are core content, so keep them visible
// even when a browser reports reduced motion. Larger continuous/parallax effects
// still use prefersReducedMotion below.
const promptMotionEnabled = true;

/* ---------- Renderers ---------- */
/* NOTE: the sellable price grid + search/filter has been removed from the landing
   page (the "Available Fabric Lots" section is now a teaser only). Catalogue product
   data has been removed entirely from this file and is owned by the catalogue team,
   who build it inside the empty <section id="catalog">. `useCases` still drives the
   "Fabrics by use" editorial grid. */
const useGrid = document.querySelector("#useGrid");

/* "Fabrics by use" — Editorial Index (the chosen, permanent layout).
   Full-width stacked rows rendered from the `useCases` data: a large serif
   index numeral + use-name on the left, a tracked overline label, and an
   image that elegantly reveals/zooms on hover on the right; refined hairline
   dividers between rows and a subtle light-blue accent on the numeral + arrow.
   Closes with a "More coming soon" row. Imagery uses the same woven-cloth
   weaveBackground() the site already uses. Reduced-motion safe. */
function renderUseCases() {
  if (!useGrid) return;

  const indexRows = useCases.map((item, i) => `
    <article class="use-row reveal" tabindex="0">
      <span class="use-row-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <div class="use-row-body">
        <small class="use-row-overline">${escapeHtml(item.overline || item.count)}</small>
        <h3 class="use-row-title">${escapeHtml(item.title)} <span class="arrow" aria-hidden="true">→</span></h3>
        <p class="use-row-desc">${escapeHtml(item.description)}</p>
      </div>
      <span class="use-row-meta" aria-hidden="true">${escapeHtml(item.count)}</span>
      <span class="use-row-media" aria-hidden="true">
        <span class="use-row-img" style="background-image: ${weaveBackground(item.palette)}"></span>
      </span>
    </article>
  `).join("");
  const indexSoon = `
    <article class="use-row soon reveal">
      <span class="use-row-num" aria-hidden="true">+</span>
      <div class="use-row-body">
        <small class="use-row-overline">In the works</small>
        <h3 class="use-row-title">More coming soon</h3>
        <p class="use-row-desc">Denims, linings and more uses are being added.</p>
      </div>
      <span class="use-row-meta" aria-hidden="true"></span>
      <span class="use-row-media" aria-hidden="true"></span>
    </article>
  `;

  useGrid.innerHTML = `<div class="use-index">${indexRows}${indexSoon}</div>`;
}

renderUseCases();

/* ============================================================
   Featured Fabrics — fan carousel (ported from React+GSAP)
   ============================================================ */
function initFanCarousel() {
  const root = document.querySelector("#fanCarousel");
  const layout = document.querySelector("#fanLayout");
  if (!root || !layout) return;

  const cards = FAN_CARDS;
  const VISIBLE = Math.min(7, cards.length);

  // Fan positions for up to 7 visible cards (offset from center: -3..3)
  // rot -21..21, scale ~0.78..1.0, x in rem (* responsive multiplier), y per offset
  const FAN_POSITIONS = {
    "-3": { rot: -21, scale: 0.78, x: -30, y: 6 },
    "-2": { rot: -14, scale: 0.85, x: -20, y: 2.5 },
    "-1": { rot: -7,  scale: 0.92, x: -10, y: 0.8 },
    "0":  { rot: 0,   scale: 1.0,  x: 0,   y: 0 },
    "1":  { rot: 7,   scale: 0.92, x: 10,  y: 0.8 },
    "2":  { rot: 14,  scale: 0.85, x: 20,  y: 2.5 },
    "3":  { rot: 21,  scale: 0.78, x: 30,  y: 6 }
  };

  function responsiveMultiplier() {
    const w = window.innerWidth;
    if (w < 480) return 0.28;
    if (w < 768) return 0.38;
    if (w < 1024) return 0.5;
    if (w < 1280) return 0.75;
    return 1.0;
  }

  const hasGsap = !!window.gsap && !prefersReducedMotion;

  // Build card elements
  const els = cards.map((card, i) => {
    const el = document.createElement("div");
    el.className = "fan-card";
    el.dataset.index = String(i);
    el.innerHTML = `
      <img alt="${escapeHtml(card.title + " — " + card.tag)}" width="600" height="800" loading="lazy" src="${card.img}" data-fallback="${card.fallback}" onerror="this.onerror=null;this.src=this.dataset.fallback">
      <div class="fan-cap"><small>${escapeHtml(card.tag)}</small><strong>${escapeHtml(card.title)}</strong></div>
    `;
    layout.appendChild(el);
    return el;
  });

  // ----- Static fallback (no GSAP) -----
  if (!window.gsap) {
    layout.classList.add("static");
    return;
  }

  // ----- GSAP fan -----
  let center = Math.floor(cards.length / 2);
  let hovered = -1;
  let entered = false;

  function applyLayout(animate) {
    const mult = responsiveMultiplier();
    const half = Math.floor(VISIBLE / 2);

    els.forEach((el, i) => {
      // circular distance from current center
      let offset = i - center;
      const n = cards.length;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;

      if (Math.abs(offset) > half) {
        // off the fan — hide
        gsap.set(el, { autoAlpha: 0, scale: 0.6, x: 0, y: 0, rotation: 0, zIndex: 0, pointerEvents: "none" });
        return;
      }

      const pos = FAN_POSITIONS[String(offset)] || FAN_POSITIONS["0"];
      let x = pos.x * mult * 16; // rem -> px (1rem ~ 16px)
      let y = pos.y * 16;
      let scale = pos.scale;
      let rot = pos.rot;

      // hover push-apart + lift
      if (hovered >= 0 && hovered !== i) {
        const dir = i > hovered ? 1 : -1;
        x += dir * 28 * mult;
      }
      if (hovered === i) {
        y -= 28; scale += 0.04; rot = rot * 0.5;
      }

      const zIndex = 100 - Math.abs(offset) + (hovered === i ? 50 : 0);
      const props = { autoAlpha: 1, x, y, scale, rotation: rot, zIndex, pointerEvents: "auto" };

      if (animate) {
        gsap.to(el, { ...props, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      } else {
        gsap.set(el, props);
      }
    });
  }

  function entrance() {
    if (entered) return;
    entered = true;
    const mult = responsiveMultiplier();
    const half = Math.floor(VISIBLE / 2);
    root.classList.add("fan-assembling");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        root.classList.remove("fan-assembling");
        applyLayout(false);
      }
    });

    els.forEach((el, i) => {
      let offset = i - center;
      const n = cards.length;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      if (Math.abs(offset) > half) { gsap.set(el, { autoAlpha: 0 }); return; }

      const pos = FAN_POSITIONS[String(offset)] || FAN_POSITIONS["0"];
      const x = pos.x * mult * 16;
      const y = pos.y * 16;
      const startX = ((offset * 9) + (i % 2 ? -18 : 18)) * mult;
      const startY = 118 + Math.abs(offset) * 18;
      const startRotation = (offset * -4) + (i % 2 ? 9 : -9);
      const delay = 0.08 + Math.abs(offset) * 0.09;

      gsap.set(el, {
        autoAlpha: 0,
        x: startX,
        y: startY,
        scale: 0.62,
        rotation: startRotation,
        zIndex: 80 + i,
        pointerEvents: "none"
      });
      tl.to(el, {
        autoAlpha: 1,
        duration: 0.22,
        ease: "power2.out"
      }, delay);
      tl.to(el, {
        x,
        y,
        scale: pos.scale,
        rotation: pos.rot,
        zIndex: 100 - Math.abs(offset),
        pointerEvents: "auto",
        duration: 1.05,
        ease: "expo.out"
      }, delay + 0.04);
    });
  }

  // hover handlers
  els.forEach((el, i) => {
    el.addEventListener("mouseenter", () => { hovered = i; applyLayout(true); });
    el.addEventListener("mouseleave", () => { hovered = -1; applyLayout(true); });
  });

  window.addEventListener("resize", () => applyLayout(false), { passive: true });

  // ----- Hover-position-driven advance (replaces arrows + dots) -----
  // While the cursor is over the carousel, the carousel advances: cursor on the
  // LEFT half steps backward, on the RIGHT half steps forward — the same per-
  // step motion the arrows produced. Speed eases with edge proximity (nearer the
  // edge = faster; near center = slow/paused). It keeps advancing while hovered
  // and STOPS on mouse-leave. Gated off under reduced motion (entrance still
  // plays once; no auto hover-advance then). A rAF loop accumulates fractional
  // steps so motion stays smooth, not frantic.
  let hoverDir = 0;          // -1 back, +1 forward, 0 idle
  let hoverStrength = 0;     // 0..1 eased by edge proximity
  let rafId = null;
  let stepAccum = 0;
  let lastT = 0;
  const MAX_STEPS_PER_SEC = 1.6;   // fastest cadence at the far edges
  const DEAD_ZONE = 0.12;          // central fraction with no advance

  function onMove(e) {
    if (prefersReducedMotion) return;
    const rect = layout.getBoundingClientRect();
    if (rect.width <= 0) { hoverDir = 0; hoverStrength = 0; return; }
    // position across the carousel, -1 (far left) .. +1 (far right)
    const rel = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mag = Math.abs(rel);
    if (mag < DEAD_ZONE) {
      hoverDir = 0; hoverStrength = 0;
    } else {
      hoverDir = rel < 0 ? -1 : 1;
      // ease 0..1 from the dead-zone edge to the carousel edge
      hoverStrength = Math.min(1, (mag - DEAD_ZONE) / (1 - DEAD_ZONE));
    }
  }

  function loop(t) {
    if (!lastT) lastT = t;
    const dt = Math.min(0.05, (t - lastT) / 1000); // clamp big gaps
    lastT = t;
    if (hoverDir !== 0 && hoverStrength > 0) {
      stepAccum += hoverDir * hoverStrength * MAX_STEPS_PER_SEC * dt;
      while (stepAccum >= 1) {
        center = (center + 1) % cards.length; applyLayout(true); stepAccum -= 1;
      }
      while (stepAccum <= -1) {
        center = (center - 1 + cards.length) % cards.length; applyLayout(true); stepAccum += 1;
      }
    } else {
      stepAccum = 0;
    }
    rafId = requestAnimationFrame(loop);
  }

  function startHover() {
    if (prefersReducedMotion || rafId !== null) return;
    lastT = 0; stepAccum = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stopHover() {
    hoverDir = 0; hoverStrength = 0; stepAccum = 0;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  root.addEventListener("mouseenter", startHover);
  root.addEventListener("mousemove", onMove);
  root.addEventListener("mouseleave", stopHover);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopHover(); });

  // Trigger entrance on scroll into view
  if (hasGsap && "IntersectionObserver" in window) {
    applyLayout(false);
    // hide for entrance
    els.forEach((el) => gsap.set(el, { autoAlpha: 0 }));
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { entrance(); o.disconnect(); }
      });
    }, { threshold: 0.25 });
    obs.observe(root);
  } else {
    // GSAP present but reduced motion: show fan statically
    entered = true;
    applyLayout(false);
  }
}

/* ============================================================
   B2B Global Supply — animated canvas globe (see buildWorldMap below).
   ============================================================ */

/* ---------- Supply routes data — EDIT HERE -----------------
   `WORLD_HUB` is the origin; `WORLD_DESTINATIONS` are the cities the
   routes fan out to. Each entry is { name, lat, lng }. Add / remove
   cities or change the hub freely — coordinates are plain lat/lng.
   Kept honest: city labels only, no claims, stats or client names. */
const WORLD_HUB = { name: "Bangkok", lat: 13.7563, lng: 100.5018 };
const WORLD_DESTINATIONS = [
  { name: "London",    lat: 51.5074, lng: -0.1278  },
  { name: "New York",  lat: 40.7128, lng: -74.0060 },
  { name: "Dubai",     lat: 25.2048, lng: 55.2708  },
  { name: "Milan",     lat: 45.4642, lng: 9.1900   },
  { name: "Singapore", lat: 1.3521,  lng: 103.8198 },
  { name: "Tokyo",     lat: 35.6762, lng: 139.6503 },
  { name: "Mumbai",    lat: 19.0760, lng: 72.8777  },
  { name: "Sydney",    lat: -33.8688, lng: 151.2093 },
  { name: "Nigeria",   lat: 9.08,    lng: 8.68     }
];

/* ============================================================
   B2B Global Supply — vanilla canvas globe redo
   Dependency-free port of the 21st.dev cobe-globe direction. The function
   name intentionally matches the older flat-map implementation above; this
   later declaration is the one used by the init call at the bottom of the file.
   ============================================================ */
const GLOBE_DEG = Math.PI / 180;

function globeVec(lat, lng) {
  const phi = lat * GLOBE_DEG;
  const lambda = lng * GLOBE_DEG;
  const cosPhi = Math.cos(phi);
  return {
    x: cosPhi * Math.sin(lambda),
    y: Math.sin(phi),
    z: cosPhi * Math.cos(lambda)
  };
}

function globeNormalize(v) {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function globeSlerp(a, b, t) {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 0.0001) return a;
  const sinOmega = Math.sin(omega);
  const s1 = Math.sin((1 - t) * omega) / sinOmega;
  const s2 = Math.sin(t * omega) / sinOmega;
  return globeNormalize({
    x: a.x * s1 + b.x * s2,
    y: a.y * s1 + b.y * s2,
    z: a.z * s1 + b.z * s2
  });
}

function globeLandMask(lat, lng) {
  const ellipses = [
    [-103, 46, 54, 24], [-82, 21, 28, 16], [-60, -16, 18, 33],
    [18, 3, 24, 36], [16, 49, 25, 12], [72, 46, 70, 27],
    [103, 18, 38, 21], [137, -25, 21, 12], [47, -20, 14, 16]
  ];
  return ellipses.some(([cx, cy, rx, ry]) => {
    const dx = Math.abs(lng - cx) / rx;
    const dy = Math.abs(lat - cy) / ry;
    return dx * dx + dy * dy <= 1;
  });
}

function buildGlobeDots() {
  const dots = [];
  for (let lat = -58; lat <= 72; lat += 3.6) {
    for (let lng = -178; lng <= 180; lng += 3.6) {
      if (!globeLandMask(lat, lng)) continue;
      const seed = Math.sin((lat * 12.9898 + lng * 78.233) * GLOBE_DEG) * 43758.5453;
      const jitter = seed - Math.floor(seed);
      dots.push({
        v: globeVec(lat + (jitter - 0.5) * 1.3, lng + (jitter - 0.5) * 1.8),
        r: 0.75 + jitter * 0.7
      });
    }
  }
  return dots;
}

function buildWorldMap() {
  const stage = document.querySelector("#worldMapStage");
  if (!stage) return;

  const ACCENT = "#0ea5e9";
  const ACCENT_SOFT = "#38bdf8";
  const motionOK = promptMotionEnabled;

  stage.innerHTML = "";
  stage.classList.add("globe-ready");

  const canvas = document.createElement("canvas");
  canvas.className = "world-globe-canvas";
  canvas.setAttribute("aria-hidden", "true");

  const labels = document.createElement("div");
  labels.className = "world-globe-labels";
  labels.setAttribute("aria-hidden", "true");

  stage.appendChild(canvas);
  stage.appendChild(labels);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const markers = [WORLD_HUB, ...WORLD_DESTINATIONS].map((item, i) => {
    const label = document.createElement("div");
    label.className = "world-globe-label" + (i === 0 ? " hub" : "") + (i > 4 ? " secondary" : "");
    const value = i === 0 ? 100 : 54 + ((i * 13) % 42);
    label.innerHTML = `
      <span>${escapeHtml(item.name)}</span>
      <i style="--value:${value}%"></i>
      <strong>${value}%</strong>
    `;
    labels.appendChild(label);
    return { ...item, label, value, v: globeVec(item.lat, item.lng) };
  });

  const hub = markers[0];
  const routes = WORLD_DESTINATIONS.map((dest, i) => {
    const end = globeVec(dest.lat, dest.lng);
    const points = [];
    for (let step = 0; step <= 72; step += 1) points.push(globeSlerp(hub.v, end, step / 72));
    return { points, dest, i };
  });

  const globeDots = buildGlobeDots();
  let width = 0;
  let height = 0;
  let dpr = 1;
  let radius = 0;
  let cx = 0;
  let cy = 0;
  let raf = null;
  let visible = false;
  let startedAt = 0;
  let lastT = 0;
  let lastDraw = 0;
  let centerLng = 92;
  let targetCenterLng = 92;
  let dragging = false;
  let dragStartX = 0;
  let dragStartLng = 0;

  const tilt = -8 * GLOBE_DEG;
  const ROTATE_SPEED = 0.00016;
  const DRAW_MS = 1050;
  const STAGGER_MS = 230;
  const HOLD_MS = 1400;
  const CYCLE_MS = (routes.length - 1) * STAGGER_MS + DRAW_MS + HOLD_MS;
  const easeOut = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

  // Offscreen canvas for the STATIC sphere layers (fill gradient + soft
  // drop-shadow + outer rim). These don't change with rotation, so we paint
  // them ONCE per resize and blit the result each frame — keeping the very
  // expensive shadowBlur off the per-frame render path.
  const baseCanvas = document.createElement("canvas");
  const baseCtx = baseCanvas.getContext("2d");

  function renderBase() {
    if (!baseCtx) return;
    baseCanvas.width = canvas.width;
    baseCanvas.height = canvas.height;
    baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseCtx.clearRect(0, 0, width, height);
    const bg = baseCtx.createRadialGradient(cx - radius * 0.38, cy - radius * 0.45, radius * 0.15, cx, cy, radius * 1.08);
    bg.addColorStop(0, "rgba(255,255,255,0.98)");
    bg.addColorStop(0.56, "rgba(248,250,249,0.93)");
    bg.addColorStop(1, "rgba(226,232,232,0.82)");
    baseCtx.save();
    baseCtx.beginPath();
    baseCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    baseCtx.fillStyle = bg;
    baseCtx.shadowColor = "rgba(14, 165, 233, 0.18)";
    baseCtx.shadowBlur = 34;
    baseCtx.fill();
    baseCtx.restore();
    baseCtx.beginPath();
    baseCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    baseCtx.lineWidth = 1;
    baseCtx.strokeStyle = "rgba(14, 165, 233, 0.28)";
    baseCtx.stroke();
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(280, Math.round(rect.width));
    height = Math.max(280, Math.round(rect.height || rect.width));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = width / 2;
    cy = height / 2;
    radius = Math.min(width, height) * 0.43;
    renderBase();
  }

  function project(v, lift) {
    const c = Math.cos(centerLng * GLOBE_DEG);
    const s = Math.sin(centerLng * GLOBE_DEG);
    const x = v.x * c - v.z * s;
    const z = v.x * s + v.z * c;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const y2 = v.y * ct - z * st;
    const z2 = v.y * st + z * ct;
    const depth = Math.max(0, Math.min(1, (z2 + 0.12) / 1.12));
    return {
      x: cx + x * radius * 0.98,
      y: cy - y2 * radius * 0.98 - (lift || 0) * depth,
      z: z2,
      visible: z2 > -0.02,
      depth
    };
  }

  function drawLatitude(lat) {
    ctx.beginPath();
    let open = false;
    for (let lng = -180; lng <= 180; lng += 4) {
      const p = project(globeVec(lat, lng));
      if (!p.visible) { open = false; continue; }
      if (!open) { ctx.moveTo(p.x, p.y); open = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  function drawLongitude(lng) {
    ctx.beginPath();
    let open = false;
    for (let lat = -80; lat <= 80; lat += 4) {
      const p = project(globeVec(lat, lng));
      if (!p.visible) { open = false; continue; }
      if (!open) { ctx.moveTo(p.x, p.y); open = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  function drawSphere() {
    // static base (gradient fill + drop-shadow + outer rim) blitted from the
    // offscreen canvas — no per-frame shadowBlur here.
    ctx.drawImage(baseCanvas, 0, 0, width, height);

    // rotating layers (lat/long grid + land dots) — these DO depend on
    // rotation, so they're drawn live, but without any expensive shadow.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "rgba(26, 26, 26, 0.055)";
    for (let lat = -60; lat <= 60; lat += 20) drawLatitude(lat);
    for (let lng = -180; lng < 180; lng += 30) drawLongitude(lng);

    globeDots.forEach((dot) => {
      const p = project(dot.v);
      if (!p.visible) return;
      ctx.beginPath();
      ctx.globalAlpha = 0.17 + p.depth * 0.42;
      ctx.fillStyle = "#1a1a1a";
      ctx.arc(p.x, p.y, dot.r * (0.75 + p.depth * 0.65), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawRoute(route, progress, now) {
    const count = Math.max(2, Math.floor(route.points.length * progress));
    const glow = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    glow.addColorStop(0, "rgba(14,165,233,0)");
    glow.addColorStop(0.5, "rgba(56,189,248,0.95)");
    glow.addColorStop(1, "rgba(14,165,233,0)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let pass = 0; pass < 2; pass += 1) {
      ctx.beginPath();
      let open = false;
      for (let idx = 0; idx < count; idx += 1) {
        const p = project(route.points[idx], 13);
        if (!p.visible) { open = false; continue; }
        if (!open) { ctx.moveTo(p.x, p.y); open = true; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = pass === 0 ? "rgba(56,189,248,0.32)" : glow;
      ctx.lineWidth = pass === 0 ? 7 : 2.4;
      // shadowBlur is the single most expensive canvas op; the wide translucent
      // underpass + bright gradient core already read as a glowing thread, so
      // drop the per-segment shadow entirely.
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    const lead = project(route.points[Math.max(0, count - 1)], 13);
    if (lead.visible && progress < 1) {
      ctx.beginPath();
      ctx.globalAlpha = 0.75 + Math.sin(now / 90) * 0.15;
      ctx.fillStyle = "#e0f5ff";
      ctx.shadowColor = ACCENT_SOFT;
      ctx.shadowBlur = 6;
      ctx.arc(lead.x, lead.y, 4.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawMarkers(now) {
    markers.forEach((marker, i) => {
      const p = project(marker.v, 15);
      const pulse = i === 0 ? 10 + Math.sin(now / 240) * 2.5 : 7 + Math.sin((now + i * 160) / 260) * 1.8;
      if (p.visible) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.globalAlpha = 0.16 + p.depth * 0.26;
        ctx.strokeStyle = ACCENT_SOFT;
        ctx.lineWidth = 1.4;
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = i === 0 ? "#e0f5ff" : ACCENT_SOFT;
        ctx.shadowColor = ACCENT_SOFT;
        ctx.shadowBlur = i === 0 ? 8 : 5;
        ctx.arc(p.x, p.y, i === 0 ? 4.8 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const hideSecondary = stage.clientWidth < 520 && marker.label.classList.contains("secondary");
      marker.label.style.opacity = p.visible && !hideSecondary ? String(Math.min(1, 0.2 + p.depth)) : "0";
      marker.label.style.transform = `translate3d(${p.x}px, ${p.y - 48}px, 0) translate(-50%, -100%)`;
      marker.label.style.filter = `blur(${p.visible ? (1 - p.depth) * 2.5 : 6}px)`;
    });
  }

  function render(now) {
    // Cap the continuous loop to ~30fps: halves the per-frame canvas cost while
    // the rotation + route waves still read as smooth. One-off redraws (drag,
    // resize) bypass this since they run when !visible / !motionOK.
    if (visible && motionOK && now - lastDraw < 33) {
      raf = requestAnimationFrame(render);
      return;
    }
    if (!lastT) lastT = now;
    const dt = Math.min(40, now - lastT);
    lastT = now;
    lastDraw = now;

    if (motionOK && !dragging) targetCenterLng += ROTATE_SPEED * dt / GLOBE_DEG;
    centerLng += (targetCenterLng - centerLng) * 0.08;

    ctx.clearRect(0, 0, width, height);
    drawSphere();

    const elapsed = motionOK ? ((now - startedAt) % CYCLE_MS) : CYCLE_MS;
    routes.forEach((route) => {
      const local = elapsed - route.i * STAGGER_MS;
      const progress = motionOK ? easeOut(local / DRAW_MS) : 1;
      if (progress > 0) drawRoute(route, progress, now);
    });
    drawMarkers(now);

    if (visible && motionOK) raf = requestAnimationFrame(render);
  }

  function play() {
    stop();
    visible = true;
    centerLng = 92;
    targetCenterLng = 92;
    startedAt = performance.now();
    lastT = 0;
    raf = requestAnimationFrame(render);
  }

  function stop() {
    visible = false;
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  function onPointerDown(e) {
    dragging = true;
    dragStartX = e.clientX;
    dragStartLng = targetCenterLng;
    stage.classList.add("dragging");
    stage.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    targetCenterLng = dragStartLng - (e.clientX - dragStartX) * 0.32;
    if (!visible || !motionOK) render(performance.now());
  }

  function onPointerUp(e) {
    dragging = false;
    stage.classList.remove("dragging");
    stage.releasePointerCapture?.(e.pointerId);
  }

  resize();
  render(performance.now());
  window.addEventListener("resize", () => { resize(); render(performance.now()); }, { passive: true });
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", onPointerUp);
  stage.addEventListener("pointercancel", onPointerUp);

  if ("IntersectionObserver" in window) {
    const trigger = document.querySelector("#reach") || stage;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) play();
        else stop();
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    io.observe(trigger);
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  } else {
    play();
  }
}

/* ============================================================
   Fabric-type continuous rolling marquee
   A seamlessly-looping horizontal auto-scroll of fabric names. The track
   holds TWO identical sequences and translates by -50% via CSS @keyframes
   (.fabric-rotator-track), so the loop has no seam jump. Pause on hover is
   handled in CSS. Reduced motion / no-JS: a static comma-separated line.
   ============================================================ */
const FABRIC_TYPES = [
  "Chambray",
  "Oxford Cotton",
  "Cashmere Blend",
  "Irish Linen",
  "Egyptian Giza Cotton",
  "Heavyweight Twill",
  "Raw Silk",
  "Cotton Poplin"
];

function initFabricRotator() {
  const stage = document.querySelector("#fabricRotator");
  if (!stage) return;

  // Single item: static line, no scrolling.
  if (FABRIC_TYPES.length < 2) {
    const p = document.createElement("p");
    p.className = "fabric-rotator-static";
    p.textContent = FABRIC_TYPES.join(" · ");
    stage.replaceWith(p);
    return;
  }

  // Build a track containing repeated passes so the loop stays filled on wide screens.
  const track = document.createElement("div");
  track.className = "fabric-rotator-track";
  for (let pass = 0; pass < 4; pass++) {
    FABRIC_TYPES.forEach((name) => {
      const el = document.createElement("span");
      el.className = "fabric-rotator-item";
      el.textContent = name;
      track.appendChild(el);
    });
  }
  stage.appendChild(track);

  // Perf: the marquee is force-enabled (keeps running even under reduced motion),
  // but there's no reason to keep animating it while it's scrolled off screen.
  // Pause the CSS animation when offscreen, resume when it re-enters view — the
  // force-motion behaviour is preserved for when it's actually visible.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        track.style.animationPlayState = e.isIntersecting ? "running" : "paused";
      });
    }, { threshold: 0 });
    io.observe(stage);
  }
}

/* ---------- Hero slideshow — automatic crossfade (no manual controls) ----------
   4 slides, ~5s each, smooth opacity crossfade (CSS handles the fade), looping
   forever. It KEEPS auto-advancing regardless of cursor position over the hero
   (the hero fills the viewport, so a hover-pause would leave it looking frozen).
   Pauses only while the tab is hidden, then resumes. Reduced motion: no
   auto-advance — the first slide stays static.
   The <noscript> first-slide-visible fallback is in markup (slide.is-active). */
function initSlideshow() {
  const root = document.querySelector("#slideshow");
  const slides = root ? Array.from(root.querySelectorAll(".slide")) : [];
  if (!root || slides.length < 2) return;

  // Reduced motion: leave the first slide showing, never auto-advance.
  if (prefersReducedMotion) return;

  const INTERVAL = 3500; // 3.5s per slide
  let current = 0;
  let timer = null;
  let inView = true;

  function next() {
    current = (current + 1) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  }

  function start() {
    if (timer || !inView || document.hidden) return;
    timer = window.setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  // Intentionally NO hover pause: the hero fills the viewport, so pausing on
  // hover would make the slideshow look frozen. It keeps auto-advancing
  // regardless of cursor position.
  // Pause while the tab is hidden, resume when visible.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  // Perf: pause the crossfade timer once the hero has scrolled out of view
  // (no point re-painting slides nobody can see), resume when it returns.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
        if (inView) start(); else stop();
      });
    }, { threshold: 0 });
    io.observe(root);
  }

  start();
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.querySelector("#scrollProgress");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    if (idx) el.classList.add(`d${Math.min(idx, 3)}`);
    groups.set(parent, idx + 1);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Glass nav on scroll + mobile menu ---------- */
function initNav() {
  const nav = document.querySelector("#glassNav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector("#navToggle");
  const menu = document.querySelector("#mobileMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }
}

/* ---------- Nav bar — macOS-dock hover magnification ----------
   TASK 2. Target: .nav-links. Re-creates the AnimatedDock behaviour in vanilla
   JS + CSS: as the cursor moves across the nav, the link nearest the cursor
   scales up / lifts the most and neighbours fall off with distance; everything
   settles back smoothly on mouse-leave. We track the cursor X and, per link,
   compute a Gaussian-style falloff of distance from each link's centre to the
   cursor, then write per-link scale + lift into CSS custom properties (the
   springy easing lives in the CSS transition on .nav-links a). Reduced motion:
   skip entirely — links keep their static size. */
function initNavDock() {
  if (prefersReducedMotion) return;
  const nav = document.querySelector(".nav-links");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a"));
  if (!links.length) return;

  nav.classList.add("dock");

  const MAX_SCALE = 0.22;   // peak extra scale at the cursor (→ ~1.22)
  const MAX_LIFT = 6;       // px the nearest link lifts
  const FALLOFF = 70;       // px — distance over which the effect fades

  let raf = null;
  let pending = null;

  function apply(clientX) {
    links.forEach((link) => {
      const r = link.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(clientX - center);
      // smooth Gaussian-ish falloff: 1 at the cursor → 0 far away
      const t = Math.exp(-(dist * dist) / (2 * FALLOFF * FALLOFF));
      link.style.setProperty("--dock-scale", (1 + MAX_SCALE * t).toFixed(3));
      link.style.setProperty("--dock-lift", (-MAX_LIFT * t).toFixed(2) + "px");
    });
  }

  function reset() {
    links.forEach((link) => {
      link.style.setProperty("--dock-scale", "1");
      link.style.setProperty("--dock-lift", "0px");
    });
  }

  nav.addEventListener("mousemove", (e) => {
    pending = e.clientX;
    if (raf === null) {
      raf = requestAnimationFrame(() => { raf = null; if (pending !== null) apply(pending); });
    }
  });
  nav.addEventListener("mouseleave", () => {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    pending = null;
    reset();
  });

  reset();
}

/* ---------- Smooth scroll for in-page anchors ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

/* ---------- Enquiry form ---------- */
/* Sends the landing #contact enquiry to FormSubmit via AJAX (no redirect).
   Keeps the existing required-field + email validation, includes the _honey
   honeypot, and shows an inline confirmation on success or a graceful
   fallback (email-us) message on failure so the UX never breaks. */
function initForm() {
  const form = document.querySelector("#leadForm");
  const note = document.querySelector("#formNote");
  if (!form) return;

  const isEmail = (v) => (window.AsaForms ? window.AsaForms.validEmail(v)
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim()));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return; // bot filled the honeypot — drop silently

    const nameEl = form.querySelector('[name="name"]');
    const emailEl = form.querySelector('[name="email"]');
    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";

    if (nameEl && !name) { nameEl.setAttribute("aria-invalid", "true"); nameEl.focus(); return; }
    if (nameEl) nameEl.removeAttribute("aria-invalid");
    if (emailEl && !isEmail(email)) { emailEl.setAttribute("aria-invalid", "true"); emailEl.focus(); return; }
    if (emailEl) emailEl.removeAttribute("aria-invalid");

    const fd = new FormData(form);
    const fields = {
      name: name,
      email: email,
      interest: (fd.get("interest") || "").toString(),
      message: (fd.get("message") || "").toString().trim(),
      _honey: honey ? honey.value : ""
    };

    const btn = form.querySelector('button[type="submit"]');
    const originalLabel = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

    try {
      if (!window.AsaForms) throw new Error("AsaForms unavailable");
      await window.AsaForms.submit(fields, "New Asa Fabric enquiry");
      form.reset();
      if (note) {
        note.classList.remove("is-error");
        note.textContent = "Thanks — your enquiry is on its way. The team will follow up shortly.";
        note.hidden = false;
      }
    } catch (err) {
      console.error("[enquiry] submit failed:", err);
      if (note) {
        note.classList.add("is-error");
        note.textContent = window.AsaForms ? window.AsaForms.FALLBACK_MSG
          : "Couldn't send just now — email us at veersethisteam2214@gmail.com";
        note.hidden = false;
      }
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = originalLabel; }
    }
  });
}

/* ---------- Parallax (subtle, rAF-driven, reduced-motion gated) ----------
   Perf: does NOT call getBoundingClientRect() per element per scroll frame.
   Each element's absolute document center is measured ONCE (and only re-measured
   on a debounced resize); per frame we just read window.scrollY and offset the
   cached value. An IntersectionObserver gates work so only on-screen elements
   are transformed. The heavy full-bleed hero slideshow no longer parallaxes at
   all (its data-parallax was removed) — only the small stock collage remains. */
function initParallax() {
  if (prefersReducedMotion) return;
  const items = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;

  const state = items.map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    absCenter: 0,
    visible: false
  }));

  function measure() {
    const scrollY = window.scrollY || window.pageYOffset;
    state.forEach((s) => {
      // measure the true layout position with any parallax transform cleared
      const prev = s.el.style.transform;
      s.el.style.transform = "";
      const rect = s.el.getBoundingClientRect();
      s.el.style.transform = prev;
      s.absCenter = rect.top + scrollY + rect.height / 2;
    });
  }

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    const viewportCenter = (window.scrollY || window.pageYOffset) + vh / 2;
    state.forEach((s) => {
      if (!s.visible) return;
      // collage images defer their parallax until the assemble intro completes,
      // so the two transforms never fight (assemble owns the transform first).
      if (s.el.classList.contains("collage-img")) {
        const collage = s.el.closest(".stock-collage");
        if (collage && !collage.classList.contains("assembled")) return;
      }
      const centerDelta = s.absCenter - viewportCenter;
      const shift = -centerDelta * s.speed;
      s.el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const s = state.find((x) => x.el === e.target);
        if (s) s.visible = e.isIntersecting;
      });
      update();
    }, { rootMargin: "10% 0px 10% 0px" });
    state.forEach((s) => io.observe(s.el));
  } else {
    state.forEach((s) => { s.visible = true; });
  }

  let rT = null;
  window.addEventListener("resize", () => {
    if (rT) window.clearTimeout(rT);
    rT = window.setTimeout(() => { measure(); update(); }, 150);
  }, { passive: true });

  measure();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Available Fabric Lots — "assemble" intro animation ----------
   When the stock-teaser collage scrolls into view, its three images animate
   from a spread-out / scaled / faded start into their existing overlapping
   collage layout (the final resting positions are UNCHANGED — they are the
   plain CSS defaults). Implemented purely with CSS transforms toggled by a
   class so it degrades gracefully without GSAP:
     • `.pre-assemble` (set immediately) holds each image offset + faded.
     • `.assembled` (set on first intersect) transitions to the natural state.
   Reduced motion / no IntersectionObserver: we never add `.pre-assemble`, so
   the collage shows its final positions immediately with no motion. Parallax
   on the collage images is deferred (see initParallax) until `.assembled`. */
function initStockAssemble() {
  const collage = document.querySelector(".stock-collage");
  if (!collage) return;

  // Reduced motion or no IO support: leave the collage at its final layout.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    collage.classList.add("assembled");
    return;
  }

  // Seed the spread-out / faded start state before first paint of the section.
  collage.classList.add("pre-assemble");

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        // Next frame so the browser registers the pre-assemble state first,
        // guaranteeing a transition rather than an instant jump.
        requestAnimationFrame(() => {
          collage.classList.remove("pre-assemble");
          collage.classList.add("assembled");
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(collage);
}

/* ---------- Stats strip — static values ----------
   The stat values (`.stat > strong`) and labels (`.stat > span`) render as
   their final static text exactly as authored in the markup. A previous build
   scrambled/decoded the characters on scroll; that animation was removed, so
   the numbers and labels now simply show as-is, always. */
function initStatsScramble() {
  /* no-op: the markup already carries the final static stat text. */
}

/* ---------- Footer year ---------- */
function initYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Resilient startup ----------
   Each init runs inside its own try/catch so a single feature throwing
   (e.g. a GSAP-path error in the fan carousel) can NEVER halt the inits
   that follow it and blank the rest of the page. Any failure is logged
   with the feature name and the others still run. */
/* ============================================================
   CLIENT REVIEWS / TESTIMONIALS — auto-advancing carousel
   21st.dev-style testimonial row, re-created in vanilla JS (no React /
   motion / npm). Renders cards (quote + initials avatar + 5 stars + name
   + role) from the TESTIMONIALS array into #testimonialsTrack, then runs
   a paged horizontal carousel:
     • shows 3 / 2 / 1 cards by reading the CSS var --cards-visible
       (set responsively in styles.css), pages by that many cards
     • auto-advances ~5s/step, loops infinitely, pauses on hover and on
       a hidden tab (visibilitychange); manual prev/next <button> arrows
       + position dots; clicking any control resets the auto timer
     • motion gating mirrors the site: auto-advance runs unless the
       browser reports reduced motion AND promptMotionEnabled is false.
       Under genuine reduced-motion-without-force, no auto-advance but the
       arrows/dots still work and every review stays reachable.
   ------------------------------------------------------------------ */
/* PLACEHOLDER testimonials — clearly fake but realistic B2B textile copy.
   Edit freely: { quote, name, role, initials }. No real brands. */
const TESTIMONIALS = [
  {
    quote: "The cottons arrive exactly to shade and weight, every order. It's roll-to-cut accuracy we can plan a whole season around.",
    name: "Hana Mori",
    role: "Head of Production, Atelier Mori",
    initials: "HM"
  },
  {
    quote: "Cut lengths come trimmed clean and measured true. We've stopped re-checking metreage on delivery — it's simply right.",
    name: "Tomas Reyes",
    role: "Founder, Northbound Tailoring",
    initials: "TR"
  },
  {
    quote: "Sourcing used to mean chasing five suppliers. Now one enquiry returns matching lots, weights and prices the same day.",
    name: "Priya Anand",
    role: "Procurement Lead, Veil & Co",
    initials: "PA"
  },
  {
    quote: "Swatches turned up fast and the bulk roll matched them perfectly. Reliable cloth makes the rest of our line easier.",
    name: "Greta Lindqvist",
    role: "Design Director, Studio Linde",
    initials: "GL"
  },
  {
    quote: "Dispatch is quick and the paperwork is clean. For a small mill, that dependable cadence is worth more than a discount.",
    name: "Marcus Bell",
    role: "Owner, Bell & Loom Mill",
    initials: "MB"
  },
  {
    quote: "Honest grading and consistent hand-feel. When they say a linen is shirt-weight, it behaves exactly that way on the table.",
    name: "Yuki Sato",
    role: "Buyer, Form & Fold",
    initials: "YS"
  }
];

function initTestimonials() {
  const track = document.getElementById("testimonialsTrack");
  const viewport = document.getElementById("testimonialsViewport");
  const carousel = document.getElementById("testimonialsCarousel");
  if (!track || !viewport || !carousel || !TESTIMONIALS.length) return;

  // 5-pointed star + chevron arrow as inline SVG (no icon font dependency).
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.9l-5.81 3.06 1.11-6.47L2.6 9.91l6.5-.95L12 2.5z"/></svg>';
  const stars = Array.from({ length: 5 }, () => STAR).join("");

  // Build the real cards (replaces the <noscript> fallback).
  track.innerHTML = TESTIMONIALS.map(function (t) {
    return (
      '<article class="testimonial-card">' +
        '<div class="testimonial-stars" aria-label="Rated 5 out of 5">' + stars + "</div>" +
        '<p class="testimonial-quote"><span>' + escapeHtml(t.quote) + "</span></p>" +
        '<div class="testimonial-person">' +
          '<span class="testimonial-avatar" aria-hidden="true">' + escapeHtml(t.initials) + "</span>" +
          '<span class="testimonial-meta">' +
            '<span class="testimonial-name">' + escapeHtml(t.name) + "</span>" +
            '<span class="testimonial-role">' + escapeHtml(t.role) + "</span>" +
          "</span>" +
        "</div>" +
      "</article>"
    );
  }).join("");

  const cards = Array.from(track.children);
  const total = cards.length;

  // Build controls (arrows + dots). Pages are computed after measuring.
  const controls = document.createElement("div");
  controls.className = "testimonials-controls";
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "testimonials-arrow";
  prevBtn.setAttribute("aria-label", "Previous reviews");
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 6 9 12 15 18"></polyline></svg>';
  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "testimonials-arrow";
  nextBtn.setAttribute("aria-label", "Next reviews");
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 6 15 12 9 18"></polyline></svg>';
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "testimonials-dots";
  controls.appendChild(prevBtn);
  controls.appendChild(dotsWrap);
  controls.appendChild(nextBtn);
  carousel.appendChild(controls);

  const STEP_MS = 5000;
  // auto-advance allowed unless genuine reduced motion (force overrides it)
  const autoAllowed = promptMotionEnabled || !prefersReducedMotion;

  let page = 0;
  let pageCount = 1;
  let perView = 3;
  let timer = null;
  let inView = true;

  function cardsVisible() {
    const v = parseInt(getComputedStyle(track).getPropertyValue("--cards-visible"), 10);
    return v > 0 ? v : 1;
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonials-dot";
      dot.setAttribute("aria-label", "Go to review page " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restartTimer();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function syncDots() {
    Array.from(dotsWrap.children).forEach(function (d, i) {
      const active = i === page;
      d.classList.toggle("is-active", active);
      if (active) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }

  function applyTransform() {
    if (!cards.length) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const cardW = cards[0].getBoundingClientRect().width;
    const startIndex = Math.min(page * perView, Math.max(0, total - perView));
    const offset = startIndex * (cardW + gap);
    track.style.transform = "translateX(" + (-offset) + "px)";
  }

  function goTo(p) {
    page = ((p % pageCount) + pageCount) % pageCount;
    applyTransform();
    syncDots();
  }

  function next() { goTo(page + 1); }
  function prev() { goTo(page - 1); }

  function measure() {
    perView = cardsVisible();
    pageCount = Math.max(1, Math.ceil(total / perView));
    if (page > pageCount - 1) page = pageCount - 1;
    buildDots();
    applyTransform();
    syncDots();
    // hide controls entirely if everything fits on one page
    controls.style.display = pageCount > 1 ? "" : "none";
  }

  function startTimer() {
    if (!autoAllowed || pageCount <= 1 || !inView || document.hidden) return;
    if (timer !== null) return;
    timer = window.setInterval(next, STEP_MS);
  }
  function stopTimer() {
    if (timer !== null) { window.clearInterval(timer); timer = null; }
  }
  function restartTimer() { stopTimer(); startTimer(); }

  prevBtn.addEventListener("click", function () { prev(); restartTimer(); });
  nextBtn.addEventListener("click", function () { next(); restartTimer(); });

  // pause on hover / focus within, resume on leave
  carousel.addEventListener("mouseenter", stopTimer);
  carousel.addEventListener("mouseleave", startTimer);
  carousel.addEventListener("focusin", stopTimer);
  carousel.addEventListener("focusout", startTimer);

  // pause when the tab is hidden
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  // re-measure on resize (responsive 3/2/1) — debounced
  let rT = null;
  window.addEventListener("resize", function () {
    if (rT) window.clearTimeout(rT);
    rT = window.setTimeout(measure, 150);
  });

  // Perf: pause auto-advance (and its layout/paint work) while the carousel is
  // scrolled out of view; resume when it returns.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
        if (inView) startTimer(); else stopTimer();
      });
    }, { threshold: 0 });
    io.observe(carousel);
  }

  measure();
  startTimer();
}

/* ---------- Consultation / sample-request modal ----------
   An accessible two-tab dialog (Request Info & Sample / Book a Consultation),
   opened by the floating action button and the enquiry-section CTAs. Mirrors
   the server-side rules in api/_lib/validation.js for instant feedback, then
   POSTs to /api/consultation. Honors prefers-reduced-motion (via CSS) and
   degrades to the quick #leadForm when JS is unavailable (the dialog is inert
   until this runs). */
const CONSULT_ENDPOINT = "/api/consultation";
const CONSULT_LEAD_DAYS = 2;

function consultEarliestDate(leadDays) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + leadDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function consultFormatDate(iso) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

function consultValidEmail(v) {
  return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
function consultValidPhone(v) {
  const s = (v || "").trim();
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 20 && /^[+0-9 ()\-]+$/.test(s);
}

function initConsultation() {
  const overlay = document.getElementById("consultModal");
  const dialog = overlay && overlay.querySelector(".consult-dialog");
  if (!overlay || !dialog) return;

  const fab = document.getElementById("fabConsult");
  const tabs = Array.from(overlay.querySelectorAll(".consult-tab"));
  const sampleForm = document.getElementById("consultPanelSample");
  const bookForm = document.getElementById("consultPanelBook");
  const forms = { sample: sampleForm, consultation: bookForm };
  const successEl = overlay.querySelector("[data-success]");
  const closers = Array.from(overlay.querySelectorAll("[data-consult-close]"));
  const openers = Array.from(document.querySelectorAll("[data-consult-open]"));
  if (!sampleForm || !bookForm) return;

  let lastFocused = null;

  // Progressive enhancement: only reveal the floating action once JS is live.
  if (fab) fab.hidden = false;

  /* ----- date+2 rule on the consultation date field ----- */
  const dateInput = bookForm.querySelector('input[name="preferredDate"]');
  const earliest = consultEarliestDate(CONSULT_LEAD_DAYS);
  if (dateInput) {
    dateInput.min = earliest;
    const hint = bookForm.querySelector("[data-earliest-hint]");
    if (hint) hint.textContent = "Earliest available date: " + consultFormatDate(earliest);
  }

  /* ----- tab switching (click + roving arrow keys) ----- */
  function typeOfTab(tab) {
    return tab.id === "consultTabBook" ? "consultation" : "sample";
  }
  function selectTab(type, focusTab) {
    tabs.forEach((tab) => {
      const isActive = typeOfTab(tab) === type;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && focusTab) tab.focus();
    });
    if (successEl) successEl.hidden = true;
    Object.keys(forms).forEach((key) => { forms[key].hidden = key !== type; });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(typeOfTab(tab)));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + dir + tabs.length) % tabs.length];
      selectTab(typeOfTab(next), true);
    });
  });

  /* ----- conditional postal-address block (sample form) ----- */
  const addressBlock = sampleForm.querySelector("[data-address]");
  const addressInputs = addressBlock
    ? Array.from(addressBlock.querySelectorAll("input"))
    : [];
  function syncAddress() {
    const method = sampleForm.querySelector('input[name="deliveryMethod"]:checked');
    const post = method && method.value === "post";
    if (addressBlock) addressBlock.hidden = !post;
    addressInputs.forEach((inp) => {
      if (post) inp.setAttribute("required", "");
      else { inp.removeAttribute("required"); clearError(inp.name); }
    });
  }
  sampleForm
    .querySelectorAll('input[name="deliveryMethod"]')
    .forEach((radio) => radio.addEventListener("change", syncAddress));

  /* ----- error helpers ----- */
  function errorSlot(form, name) {
    return form.querySelector('[data-error-for="' + name + '"]');
  }
  function setError(form, name, message) {
    const slot = errorSlot(form, name);
    if (slot) slot.textContent = message || "";
    const field = form.querySelector('[name="' + name + '"]');
    if (field && message) {
      field.setAttribute("aria-invalid", "true");
      if (slot && slot.id === "") {
        slot.id = "err-" + name + "-" + Math.random().toString(36).slice(2, 7);
      }
      if (slot) field.setAttribute("aria-describedby", slot.id);
    }
  }
  function clearError(name) {
    [sampleForm, bookForm].forEach((form) => {
      const slot = errorSlot(form, name);
      if (slot) slot.textContent = "";
      const field = form.querySelector('[name="' + name + '"]');
      if (field) field.removeAttribute("aria-invalid");
    });
  }
  function clearAllErrors(form) {
    form.querySelectorAll("[data-error-for]").forEach((s) => (s.textContent = ""));
    form.querySelectorAll('[aria-invalid="true"]').forEach((f) => f.removeAttribute("aria-invalid"));
    const formError = form.querySelector("[data-form-error]");
    if (formError) { formError.hidden = true; formError.textContent = ""; }
  }

  /* ----- client-side validation (mirrors the server) ----- */
  function readForm(form) {
    const fd = new FormData(form);
    const data = {
      type: form.dataset.type,
      website: (fd.get("website") || "").toString(),
      fullName: (fd.get("fullName") || "").toString().trim(),
      company: (fd.get("company") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim(),
      projectDetails: (fd.get("projectDetails") || "").toString().trim(),
    };
    if (form.dataset.type === "sample") {
      data.products = fd.getAll("products").map((p) => p.toString());
      data.deliveryMethod = (fd.get("deliveryMethod") || "").toString();
      data.addressLine1 = (fd.get("addressLine1") || "").toString().trim();
      data.city = (fd.get("city") || "").toString().trim();
      data.postalCode = (fd.get("postalCode") || "").toString().trim();
      data.country = (fd.get("country") || "").toString().trim();
    } else {
      data.preferredDate = (fd.get("preferredDate") || "").toString();
      data.timeSlot = (fd.get("timeSlot") || "").toString();
    }
    return data;
  }
  function validate(data) {
    const errors = {};
    if (!data.fullName) errors.fullName = "Please enter your full name.";
    if (!consultValidEmail(data.email)) errors.email = "Enter a valid email address.";
    if (!consultValidPhone(data.phone)) errors.phone = "Enter a valid phone number.";

    if (data.type === "sample") {
      if (!data.products || !data.products.length) errors.products = "Select at least one fabric of interest.";
      if (data.deliveryMethod !== "email" && data.deliveryMethod !== "post") {
        errors.deliveryMethod = "Choose how you'd like to receive information.";
      }
      if (data.deliveryMethod === "post") {
        if (!data.addressLine1) errors.addressLine1 = "Enter a delivery address.";
        if (!data.city) errors.city = "Enter a city.";
        if (!data.postalCode) errors.postalCode = "Enter a postal code.";
        if (!data.country) errors.country = "Enter a country.";
      }
    } else {
      if (!data.preferredDate) errors.preferredDate = "Choose a valid date.";
      else if (data.preferredDate < earliest) errors.preferredDate = "Earliest available date is " + consultFormatDate(earliest) + ".";
      if (!data.timeSlot) errors.timeSlot = "Choose a preferred time slot.";
    }
    return errors;
  }

  function showErrors(form, errors) {
    clearAllErrors(form);
    const names = Object.keys(errors);
    names.forEach((name) => setError(form, name, errors[name]));
    if (names.length) {
      const first = form.querySelector('[name="' + names[0] + '"]');
      if (first && typeof first.focus === "function") first.focus();
    }
  }

  /* ----- submission -----
     Delivers the sample-request / consultation-booking to FormSubmit via AJAX
     (no page redirect). The _honey honeypot is dropped silently; on success the
     shared success state shows; on network/failure a graceful inline fallback
     is shown so the UX never breaks. */
  async function handleSubmit(event, form) {
    event.preventDefault();
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return; // bot filled the honeypot — drop silently

    const type = form.dataset.type;
    const data = readForm(form);
    const errors = validate(data);
    if (Object.keys(errors).length) { showErrors(form, errors); return; }
    clearAllErrors(form);

    const submit = form.querySelector(".consult-submit");
    const label = submit && submit.querySelector(".consult-submit-label");
    const originalLabel = label ? label.innerHTML : "";
    if (submit) submit.setAttribute("aria-busy", "true");
    if (label) label.textContent = "Sending…";

    const formError = form.querySelector("[data-form-error]");

    // Flatten arrays (e.g. products) into a readable string for the email.
    const fields = Object.assign({}, data);
    if (Array.isArray(fields.products)) fields.products = fields.products.join(", ");
    fields._honey = honey ? honey.value : "";
    const subject = type === "consultation"
      ? "New Asa Fabric consultation booking"
      : "New Asa Fabric sample request";

    try {
      if (!window.AsaForms) throw new Error("AsaForms unavailable");
      await window.AsaForms.submit(fields, subject);
      showSuccess(type, data);
      form.reset();
      syncAddress();
    } catch (err) {
      console.error("[consultation] submit failed:", err);
      if (formError) {
        formError.hidden = false;
        formError.textContent = window.AsaForms
          ? window.AsaForms.FALLBACK_MSG
          : "Couldn't send just now — email us at veersethisteam2214@gmail.com";
      }
    } finally {
      if (submit) submit.removeAttribute("aria-busy");
      if (label) label.innerHTML = originalLabel;
    }
  }
  sampleForm.addEventListener("submit", (e) => handleSubmit(e, sampleForm));
  bookForm.addEventListener("submit", (e) => handleSubmit(e, bookForm));

  /* ----- success state ----- */
  function showSuccess(type, data) {
    tabs.forEach((t) => (t.closest(".consult-tabs").hidden = true));
    sampleForm.hidden = true;
    bookForm.hidden = true;
    if (!successEl) return;
    const title = successEl.querySelector("[data-success-title]");
    const body = successEl.querySelector("[data-success-body]");
    if (type === "consultation") {
      if (title) title.textContent = "Your consultation request is in.";
      if (body) body.textContent =
        "We'll confirm your appointment for " + consultFormatDate(data.preferredDate) +
        " (" + data.timeSlot + ") by email shortly.";
    } else if (data.deliveryMethod === "post") {
      if (title) title.textContent = "Your sample request is in.";
      if (body) body.textContent =
        "We'll post your fabric sample and follow up by email. A confirmation has been sent to " + data.email + ".";
    } else {
      if (title) title.textContent = "Thank you — your enquiry is in.";
      if (body) body.textContent =
        "We'll email the information you asked for shortly. A confirmation has been sent to " + data.email + ".";
    }
    successEl.hidden = false;
    const done = successEl.querySelector("[data-consult-close]");
    if (done && typeof done.focus === "function") done.focus();
  }

  /* ----- open / close + focus management ----- */
  function focusable() {
    return Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  }
  function resetForNewOpen() {
    const tablist = overlay.querySelector(".consult-tabs");
    if (tablist) tablist.hidden = false;
    if (successEl) successEl.hidden = true;
    clearAllErrors(sampleForm);
    clearAllErrors(bookForm);
  }
  function openModal(type) {
    lastFocused = document.activeElement;
    resetForNewOpen();
    selectTab(type === "consultation" ? "consultation" : "sample");
    syncAddress();
    overlay.hidden = false;
    document.body.classList.add("consult-open");
    // next frame so the entrance transition runs
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    const first = (forms[type] || sampleForm).querySelector("input, select, textarea, button");
    if (first && typeof first.focus === "function") {
      window.setTimeout(() => first.focus(), 40);
    }
  }
  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("consult-open");
    const done = () => { overlay.hidden = true; };
    if (prefersReducedMotion) done();
    else window.setTimeout(done, 320);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  openers.forEach((btn) =>
    btn.addEventListener("click", () => openModal(btn.dataset.consultOpen || "sample"))
  );
  closers.forEach((btn) => btn.addEventListener("click", closeModal));

  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); closeModal(); return; }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (!items.length) return;
    const firstEl = items[0];
    const lastEl = items[items.length - 1];
    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault(); lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault(); firstEl.focus();
    }
  });

  // initial address state
  syncAddress();
}

/* ============================================================
   ABOUT PAGE — TEAM SHOWCASE (about.html)
   Vanilla re-creation of the reference `TeamShowcase` React component.
   A staggered photo grid + a name/role roster share one hovered state:
   hovering (or focusing) a photo or a name highlights the matching pair,
   reveals that member's social icons, and dims the others. No React /
   react-icons / remote images. Renders only when #teamShowcase exists, so
   it is inert on index.html / catalogue.html. Reduced motion: highlight and
   social reveal still work; only scale/lift transitions are dropped (CSS).
   ============================================================ */

/* -------- EDITABLE: the people behind Asa Fabric --------
   Starting point only — replace roles, social links and drop real photos.
   role   : job title (EDITABLE placeholder).
   image  : assets/team/<slug>.jpg — same convention as the catalogue. If the
            file is missing it is removed on error and the initials tile shows
            instead (see assets/team/README.md for expected filenames).
   socials: use "#" placeholders until real profile URLs exist. Remove a key
            to hide that icon. Supported keys: linkedin, instagram, email. */
const TEAM = [
  {
    slug: "veer-sethi",
    name: "Veer Sethi",
    role: "Founder",                 // EDITABLE
    image: "assets/team/veer-sethi.jpg",
    socials: { linkedin: "#", instagram: "#", email: "#" }
  },
  {
    slug: "shaan",
    name: "Shaan",
    role: "Catalogue & Sourcing",    // EDITABLE
    image: "assets/team/shaan.jpg",
    socials: { linkedin: "#", instagram: "#", email: "#" }
  },
  {
    slug: "krish",
    name: "Krish",
    role: "Operations",              // EDITABLE
    image: "assets/team/krish.jpg",
    socials: { linkedin: "#", instagram: "#", email: "#" }
  }
];

// Inline SVG social icons — same visual family as the footer's social icons.
const TEAM_SOCIAL_ICONS = {
  linkedin: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5.2 8.9h3.15V20H5.2V8.9ZM6.78 4a1.83 1.83 0 1 1 0 3.66 1.83 1.83 0 0 1 0-3.66Zm4.02 4.9h3.02v1.52h.04c.42-.8 1.45-1.72 3.04-1.72 3.25 0 3.85 2.14 3.85 4.92V20H17.6v-5.65c0-1.35-.03-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98V20H10.8V8.9Z"/></svg>',
  instagram: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 2a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm5.1-2.55a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z"/></svg>',
  email: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9A2.5 2.5 0 0 1 19.5 19h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5Zm0 2a.5.5 0 0 0-.5.5v.36l8 5.14 8-5.14V7.5a.5.5 0 0 0-.5-.5h-15ZM20 10.24l-7.46 4.8a1 1 0 0 1-1.08 0L4 10.24v6.26a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-6.26Z"/></svg>'
};

function initTeamShowcase() {
  const root = document.querySelector("#teamShowcase");
  if (!root) return;
  const gallery = root.querySelector("#teamGallery");
  const roster = root.querySelector("#teamRoster");
  if (!gallery || !roster) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (name) =>
    name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const socialsHtml = (m) =>
    Object.entries(m.socials || {})
      .filter(([k]) => TEAM_SOCIAL_ICONS[k])
      .map(([k, href]) =>
        `<a class="team-social" href="${esc(href)}" aria-label="${esc(m.name)} — ${esc(k)}"` +
        (href === "#" ? ' tabindex="-1"' : "") + `>${TEAM_SOCIAL_ICONS[k]}</a>`)
      .join("");

  gallery.innerHTML = TEAM.map((m, i) => `
    <figure class="team-tile" data-member="${esc(m.slug)}" style="--i:${i}">
      <div class="team-photo">
        <span class="team-initials" aria-hidden="true">${esc(initials(m.name))}</span>
        ${m.image ? `<img class="team-photo-img" src="${esc(m.image)}" alt="${esc(m.name)}" loading="lazy" onerror="this.remove()">` : ""}
      </div>
      <figcaption class="team-tile-cap">${esc(m.name)}</figcaption>
    </figure>`).join("");

  roster.innerHTML = TEAM.map((m) => `
    <li class="team-row" data-member="${esc(m.slug)}" tabindex="0">
      <span class="team-row-main">
        <span class="team-row-name">${esc(m.name)}</span>
        <span class="team-row-role">${esc(m.role)}</span>
      </span>
      <span class="team-row-socials">${socialsHtml(m)}</span>
    </li>`).join("");

  const tiles = Array.from(gallery.querySelectorAll(".team-tile"));
  const rows = Array.from(roster.querySelectorAll(".team-row"));
  const all = tiles.concat(rows);

  const setActive = (slug) => {
    root.classList.toggle("has-active", !!slug);
    all.forEach((el) => el.classList.toggle("is-active", !!slug && el.dataset.member === slug));
  };

  tiles.forEach((t) => { t.tabIndex = 0; });

  all.forEach((el) => {
    const slug = el.dataset.member;
    el.addEventListener("mouseenter", () => setActive(slug));
    el.addEventListener("focusin", () => setActive(slug));
  });
  root.addEventListener("mouseleave", () => setActive(null));
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) setActive(null);
  });
}

function safe(fn, name) {
  try {
    fn();
  } catch (err) {
    console.error("[init] " + name + " failed:", err);
  }
}

safe(buildWorldMap, "buildWorldMap");
safe(initTestimonials, "initTestimonials");
safe(initFanCarousel, "initFanCarousel");
safe(initFabricRotator, "initFabricRotator");
safe(initSlideshow, "initSlideshow");
safe(initScrollProgress, "initScrollProgress");
safe(initReveal, "initReveal");
safe(initNav, "initNav");
safe(initNavDock, "initNavDock");
safe(initSmoothScroll, "initSmoothScroll");
safe(initForm, "initForm");
safe(initParallax, "initParallax");
safe(initStockAssemble, "initStockAssemble");
safe(initStatsScramble, "initStatsScramble");
safe(initConsultation, "initConsultation");
safe(initTeamShowcase, "initTeamShowcase");
safe(initYear, "initYear");
/* Email-capture popup lives in site-forms.js (shared across pages). */
safe(function () { if (window.AsaForms) window.AsaForms.initEmailPopup(); }, "initEmailPopup");
