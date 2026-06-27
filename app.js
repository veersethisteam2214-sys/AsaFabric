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

const fabrics = [
  {
    name: "TC Uniform Shirting",
    material: "TC blend",
    use: "School uniforms",
    status: "Ready roll",
    width: "58 in",
    gsm: "120-145 GSM",
    stock: "28 rolls",
    grade: "Uniform grade",
    roll: "THB 2,450 / roll",
    cut: "THB 78 / meter",
    detail: "Crisp everyday shirting with easy-care structure and reliable color continuity.",
    applications: ["Shirts", "Daily uniforms", "Institution orders"],
    colors: ["#f8f5ee", "#9fb7ca", "#0f2a44"]
  },
  {
    name: "Poly Cotton Trousering",
    material: "Poly cotton",
    use: "School uniforms",
    status: "Priority lot",
    width: "60 in",
    gsm: "185-220 GSM",
    stock: "16 rolls",
    grade: "High volume",
    roll: "THB 3,900 / roll",
    cut: "THB 118 / meter",
    detail: "Structured trouser and skirt fabric for programs, office uniforms, and repeat tailoring orders.",
    applications: ["Trousers", "Skirts", "Uniform sets"],
    colors: ["#3f4242", "#b4a27a", "#e8dfd0"]
  },
  {
    name: "Chambray Work Shirt",
    material: "Chambray",
    use: "Workwear",
    status: "Ready roll",
    width: "57 in",
    gsm: "150 GSM",
    stock: "11 rolls",
    grade: "Breathable",
    roll: "THB 2,980 / roll",
    cut: "THB 92 / meter",
    detail: "Light woven texture for utility shirts, shop uniforms, service crews, and casual workwear lines.",
    applications: ["Work shirts", "Shop uniforms", "Service teams"],
    colors: ["#7891a3", "#d8e0e3", "#39566b"]
  },
  {
    name: "Wool Blend Suiting",
    material: "Wool blend",
    use: "Corporate wear",
    status: "Premium lot",
    width: "60 in",
    gsm: "260 GSM",
    stock: "9 rolls",
    grade: "Executive",
    roll: "THB 6,800 / roll",
    cut: "THB 215 / meter",
    detail: "Elevated suiting handfeel for tailored trousers, jackets, blazers, and front-office uniforms.",
    applications: ["Blazers", "Trousers", "Office uniforms"],
    colors: ["#2d3036", "#202a38", "#86785f"]
  },
  {
    name: "TC Pocketing and Lining",
    material: "TC blend",
    use: "Resale deals",
    status: "Clearance",
    width: "44 in",
    gsm: "90 GSM",
    stock: "42 rolls",
    grade: "Value lot",
    roll: "THB 1,750 / roll",
    cut: "THB 52 / meter",
    detail: "Cost-efficient support fabric for linings, pockets, sampling, resale bundles, and production add-ons.",
    applications: ["Pocketing", "Lining", "Bundle deals"],
    colors: ["#efe4d2", "#1d1c1a", "#b88a44"]
  },
  {
    name: "Poly Twill Utility Cloth",
    material: "Poly twill",
    use: "Workwear",
    status: "Ready roll",
    width: "60 in",
    gsm: "235 GSM",
    stock: "14 rolls",
    grade: "Heavy duty",
    roll: "THB 4,250 / roll",
    cut: "THB 132 / meter",
    detail: "Durable twill for aprons, factory trousers, operational uniforms, and long-wear utility garments.",
    applications: ["Aprons", "Factory wear", "Utility trousers"],
    colors: ["#59684d", "#c6af80", "#303329"]
  },
  {
    name: "Oxford Staff Shirting",
    material: "Cotton blend",
    use: "Corporate wear",
    status: "Ready roll",
    width: "58 in",
    gsm: "160 GSM",
    stock: "18 rolls",
    grade: "Polished",
    roll: "THB 3,350 / roll",
    cut: "THB 105 / meter",
    detail: "Textured shirting with a refined business finish for office staff, hotel teams, and branded uniforms.",
    applications: ["Office shirts", "Hotel shirts", "Staff programs"],
    colors: ["#faf7ef", "#c3d6df", "#6b8390"]
  },
  {
    name: "Hospitality Apron Twill",
    material: "Cotton twill",
    use: "Hospitality",
    status: "Limited lot",
    width: "59 in",
    gsm: "210 GSM",
    stock: "7 rolls",
    grade: "Service grade",
    roll: "THB 3,760 / roll",
    cut: "THB 124 / meter",
    detail: "Substantial apron and service jacket fabric for restaurants, hotels, cafes, and front-of-house teams.",
    applications: ["Aprons", "Chef jackets", "Service uniforms"],
    colors: ["#4b2034", "#f1e8db", "#8e785d"]
  },
  {
    name: "Mixed Clearance Lot",
    material: "Assorted",
    use: "Resale deals",
    status: "Bundle deal",
    width: "44-60 in",
    gsm: "Varies",
    stock: "By lot",
    grade: "Value lot",
    roll: "Ask for lot price",
    cut: "Limited cuts",
    detail: "Assorted mixed stock positioned for resellers, export buyers, small shops, and fast-moving value bundles.",
    applications: ["Resale", "Export", "Small shop bundles"],
    colors: ["#733d2f", "#203d47", "#d6b472"]
  }
];

/* ---------- Featured fabric image set (swap these URLs for your own portrait fabric photos) ---------- */
/* Remote lh3 refs are used because the egress policy blocks downloads; each card has a solid bg fallback. */
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
].map((c, i) => ({ ...c, img: FAN_IMAGES[i % FAN_IMAGES.length] }));

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

/* ---------- Renderers ---------- */
/* NOTE: the sellable price grid + search/filter has been removed from the landing
   page (the "Available Fabric Lots" section is now a teaser only). The `fabrics`
   array above is RESERVED for the catalogue team's full experience and is no longer
   rendered here. `useCases` still drives the "Fabrics by use" editorial grid. */
const useGrid = document.querySelector("#useGrid");

function renderUseCases() {
  if (!useGrid) return;
  const cards = useCases.map((item) => `
    <article class="use-card ${item.tone} reveal" tabindex="0">
      <span class="use-pattern" style="background-image: ${weaveBackground(item.palette)}"></span>
      <small>${escapeHtml(item.overline || item.count)}</small>
      <h3>${escapeHtml(item.title)} <span class="arrow" aria-hidden="true">→</span></h3>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join("");

  const soon = `
    <article class="use-card soon reveal">
      <div>
        <span class="soon-mark" aria-hidden="true">+</span>
        <h3>More coming soon</h3>
        <p>Denims, linings and more uses are being added.</p>
      </div>
    </article>
  `;

  useGrid.innerHTML = cards + soon;
}

renderUseCases();

/* ============================================================
   Featured Fabrics — fan carousel (ported from React+GSAP)
   ============================================================ */
function initFanCarousel() {
  const root = document.querySelector("#fanCarousel");
  const layout = document.querySelector("#fanLayout");
  const dotsWrap = document.querySelector("#fanDots");
  const prevBtn = document.querySelector("#fanPrev");
  const nextBtn = document.querySelector("#fanNext");
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
      <img alt="" loading="lazy" src="${card.img}">
      <div class="fan-cap"><small>${escapeHtml(card.tag)}</small><strong>${escapeHtml(card.title)}</strong></div>
    `;
    layout.appendChild(el);
    return el;
  });

  // ----- Static fallback (no GSAP or reduced motion) -----
  if (!window.gsap) {
    layout.classList.add("static");
    if (dotsWrap && dotsWrap.parentElement) dotsWrap.parentElement.style.display = "none";
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

    updateDots();
  }

  function entrance() {
    if (entered) return;
    entered = true;
    const mult = responsiveMultiplier();
    const half = Math.floor(VISIBLE / 2);
    els.forEach((el, i) => {
      let offset = i - center;
      const n = cards.length;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      if (Math.abs(offset) > half) { gsap.set(el, { autoAlpha: 0 }); return; }

      const pos = FAN_POSITIONS[String(offset)] || FAN_POSITIONS["0"];
      const x = pos.x * mult * 16;
      const y = pos.y * 16;
      gsap.fromTo(el,
        { autoAlpha: 0, x: 0, y: 80, scale: 0.6, rotation: 0 },
        { autoAlpha: 1, x, y, scale: pos.scale, rotation: pos.rot,
          duration: 1.1, ease: "elastic.out(1, 0.7)", delay: Math.abs(offset) * 0.08,
          zIndex: 100 - Math.abs(offset) }
      );
    });
    updateDots();
  }

  // hover handlers
  els.forEach((el, i) => {
    el.addEventListener("mouseenter", () => { hovered = i; applyLayout(true); });
    el.addEventListener("mouseleave", () => { hovered = -1; applyLayout(true); });
  });

  // dots
  let dots = [];
  function buildDots() {
    if (!dotsWrap) return;
    dots = cards.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", `Featured fabric ${i + 1}`);
      d.addEventListener("click", () => { center = i; applyLayout(true); });
      dotsWrap.appendChild(d);
      return d;
    });
  }
  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle("active", i === center));
  }
  buildDots();

  if (prevBtn) prevBtn.addEventListener("click", () => { center = (center - 1 + cards.length) % cards.length; applyLayout(true); });
  if (nextBtn) nextBtn.addEventListener("click", () => { center = (center + 1) % cards.length; applyLayout(true); });

  window.addEventListener("resize", () => applyLayout(false), { passive: true });

  // ----- Auto-advance while hovering the carousel (paused otherwise) -----
  // Respects reduced motion (hasGsap is false under reduced motion, so this is gated).
  let autoTimer = null;
  const AUTO_INTERVAL = 1200;
  function autoStart() {
    if (autoTimer || prefersReducedMotion) return;
    autoTimer = window.setInterval(() => {
      center = (center + 1) % cards.length;
      applyLayout(true);
    }, AUTO_INTERVAL);
  }
  function autoStop() {
    if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; }
  }
  root.addEventListener("mouseenter", autoStart);
  root.addEventListener("mouseleave", autoStop);
  document.addEventListener("visibilitychange", () => { if (document.hidden) autoStop(); });

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
   B2B Global Supply — animated dotted world map
   Ported from a framer-motion + `dotted-map` "WorldMap" React
   component to vanilla SVG + JS.

   Dotted background: assets/world-dots.svg, generated build-time with
   the `dotted-map` npm package. To regenerate (no runtime dependency):
     npm install dotted-map
     node -e "import('dotted-map').then(({default:D})=>{ \
       const m=new D({height:100,grid:'diagonal'}); \
       process.stdout.write(m.getSVG({radius:0.22,color:'#1A1A1A40', \
         shape:'circle',backgroundColor:'transparent'})); })" > assets/world-dots.svg

   Projection (equirectangular, 800x400 viewBox), matching the original:
     x = (lng + 180) * (800 / 360)
     y = (90  - lat) * (400 / 180)
   Quadratic-bezier control point: midX = (x1+x2)/2, midY = min(y1,y2) - 50.
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
  { name: "Sydney",    lat: -33.8688, lng: 151.2093 }
];

const SVGNS = "http://www.w3.org/2000/svg";
const WORLD_W = 800;
const WORLD_H = 400;

function worldProject(lat, lng) {
  return {
    x: (lng + 180) * (WORLD_W / 360),
    y: (90 - lat) * (WORLD_H / 180)
  };
}

function svgEl(name, attrs) {
  const el = document.createElementNS(SVGNS, name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function buildWorldMap() {
  const stage = document.querySelector("#worldMapStage");
  if (!stage) return;

  const ACCENT = "#6F4E37"; // on-brand brown (not the demo's blue)

  // --- 1. Dotted-map background (static, baked-in asset). Guarded:
  //     if the generated SVG is unavailable, a CSS dot-pattern fallback
  //     <svg> is used so the section still reads as a dotted map. ---
  const dots = new Image();
  dots.className = "world-dots";
  dots.alt = "";
  dots.setAttribute("aria-hidden", "true");
  dots.src = "assets/world-dots.svg";
  dots.addEventListener("error", () => {
    // Fallback: replace the failed <img> with an inline dot-grid SVG so
    // the backdrop still resembles a dotted map (approximate, on-brand).
    if (!dots.parentNode) return;
    const fb = svgEl("svg", {
      class: "world-dots",
      viewBox: `0 0 ${WORLD_W} ${WORLD_H}`,
      preserveAspectRatio: "xMidYMid meet"
    });
    const defs = svgEl("defs", {});
    const pat = svgEl("pattern", {
      id: "worldDotFallback", x: "0", y: "0",
      width: "10", height: "10", patternUnits: "userSpaceOnUse"
    });
    pat.appendChild(svgEl("circle", { cx: "2", cy: "2", r: "1", fill: "#1A1A1A40" }));
    defs.appendChild(pat);
    fb.appendChild(defs);
    fb.appendChild(svgEl("rect", {
      x: "0", y: "0", width: WORLD_W, height: WORLD_H, fill: "url(#worldDotFallback)"
    }));
    dots.parentNode.replaceChild(fb, dots);
  });
  stage.appendChild(dots);

  // --- 2. Routes / points / labels layer (vanilla SVG, on top) ---
  const svg = svgEl("svg", {
    class: "world-routes",
    viewBox: `0 0 ${WORLD_W} ${WORLD_H}`,
    preserveAspectRatio: "xMidYMid meet"
  });

  // glow filter (as in the original component)
  const defs = svgEl("defs", {});
  const filter = svgEl("filter", {
    id: "worldGlow", x: "-50%", y: "-50%", width: "200%", height: "200%"
  });
  filter.appendChild(svgEl("feGaussianBlur", { stdDeviation: "2.2", result: "blur" }));
  const merge = svgEl("feMerge", {});
  merge.appendChild(svgEl("feMergeNode", { in: "blur" }));
  merge.appendChild(svgEl("feMergeNode", { in: "SourceGraphic" }));
  filter.appendChild(merge);
  defs.appendChild(filter);
  svg.appendChild(defs);

  const hub = worldProject(WORLD_HUB.lat, WORLD_HUB.lng);

  // Small flag so very-small viewports can hide secondary labels
  function syncCompact() {
    stage.classList.toggle("compact", stage.clientWidth < 520);
  }
  syncCompact();
  window.addEventListener("resize", syncCompact, { passive: true });

  const STAGGER = 0.3;   // seconds between routes
  const DRAW_DUR = 1.6;  // seconds for a line to draw + dot to travel
  const PERIOD = WORLD_DESTINATIONS.length * STAGGER + DRAW_DUR + 0.8;

  WORLD_DESTINATIONS.forEach((dest, i) => {
    const end = worldProject(dest.lat, dest.lng);
    const midX = (hub.x + end.x) / 2;
    const midY = Math.min(hub.y, end.y) - 50;
    const d = `M ${hub.x} ${hub.y} Q ${midX} ${midY} ${end.x} ${end.y}`;

    const path = svgEl("path", {
      d, fill: "none", stroke: ACCENT, "stroke-width": "1",
      "stroke-opacity": "0.55", "stroke-linecap": "round"
    });
    svg.appendChild(path);

    if (!prefersReducedMotion) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      const draw = svgEl("animate", {
        attributeName: "stroke-dashoffset",
        begin: `${i * STAGGER}s`, dur: `${PERIOD}s`,
        repeatCount: "indefinite",
        // draw in over the first ~45% of the period, then hold drawn,
        // then snap back to undrawn just before the loop repeats
        keyTimes: "0;0.45;0.97;1", values: `${len};0;0;${len}`,
        calcMode: "spline", keySplines: "0.4 0 0.2 1;0 0 1 1;0 0 1 1"
      });
      path.appendChild(draw);

      // travelling glowing dot
      const dot = svgEl("circle", {
        r: "2.6", fill: ACCENT, filter: "url(#worldGlow)"
      });
      const motion = svgEl("animateMotion", {
        path: d, begin: `${i * STAGGER}s`, dur: `${PERIOD}s`,
        repeatCount: "indefinite",
        keyPoints: "0;1;1", keyTimes: "0;0.45;1",
        calcMode: "spline", keySplines: "0.4 0 0.2 1;0 0 1 1"
      });
      dot.appendChild(motion);
      // fade the dot out while it idles at the destination
      const dotFade = svgEl("animate", {
        attributeName: "opacity", begin: `${i * STAGGER}s`,
        dur: `${PERIOD}s`, repeatCount: "indefinite",
        keyTimes: "0;0.42;0.55;1", values: "1;1;0;0"
      });
      dot.appendChild(dotFade);
      svg.appendChild(dot);
    }
  });

  // points (origin + destinations) with pulse + label
  function addPoint(p, name, isHub, secondary) {
    // pulse (expanding fading ring)
    if (!prefersReducedMotion) {
      const pulse = svgEl("circle", {
        cx: p.x, cy: p.y, r: "2", fill: "none",
        stroke: ACCENT, "stroke-width": "1"
      });
      pulse.appendChild(svgEl("animate", {
        attributeName: "r", from: "2", to: "10",
        dur: "2s", begin: isHub ? "0s" : "0.4s", repeatCount: "indefinite"
      }));
      pulse.appendChild(svgEl("animate", {
        attributeName: "opacity", from: "0.6", to: "0",
        dur: "2s", begin: isHub ? "0s" : "0.4s", repeatCount: "indefinite"
      }));
      svg.appendChild(pulse);
    }
    // solid point
    svg.appendChild(svgEl("circle", {
      cx: p.x, cy: p.y, r: isHub ? "3.4" : "2.6", fill: ACCENT
    }));
    // label
    const lbl = svgEl("text", {
      x: p.x, y: p.y - 7, "text-anchor": "middle",
      class: "world-route-label" + (secondary ? " secondary" : "")
    });
    lbl.textContent = name;
    svg.appendChild(lbl);
  }

  addPoint(hub, WORLD_HUB.name, true, false);
  WORLD_DESTINATIONS.forEach((dest, i) => {
    const p = worldProject(dest.lat, dest.lng);
    // mark some as secondary so they can be hidden on tiny screens
    addPoint(p, dest.name, false, i >= 3);
  });

  stage.appendChild(svg);

  // --- 3. Pause SMIL animations while the map is off-screen (perf).
  //     Static under reduced motion, so this only matters when animating. ---
  if (!prefersReducedMotion && "IntersectionObserver" in window &&
      typeof svg.pauseAnimations === "function") {
    try { svg.pauseAnimations(); } catch (e) { /* no-op */ }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        try {
          if (e.isIntersecting) svg.unpauseAnimations();
          else svg.pauseAnimations();
        } catch (err) { /* no-op */ }
      });
    }, { threshold: 0.15 });
    io.observe(stage);
  }
}

/* ---------- Hero slideshow ---------- */
function initSlideshow() {
  const root = document.querySelector("#slideshow");
  const slides = root ? Array.from(root.querySelectorAll(".slide")) : [];
  const dotsWrap = document.querySelector("#slideDots");
  const prevBtn = document.querySelector("#slidePrev");
  const nextBtn = document.querySelector("#slideNext");
  if (!root || slides.length < 2) return;

  const reduced = prefersReducedMotion;
  const INTERVAL = 6000;
  let current = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i, true));
    if (dotsWrap) dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(index, manual) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    if (manual) restart();
  }

  function next() { goTo(current + 1); }

  function start() {
    if (reduced || timer) return;
    timer = window.setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }
  function restart() { stop(); start(); }

  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1, true));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1, true));

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

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
function initForm() {
  const form = document.querySelector("#leadForm");
  const note = document.querySelector("#formNote");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) note.hidden = false;
    form.reset();
  });
}

/* ---------- Parallax (subtle, rAF-driven, reduced-motion gated) ---------- */
function initParallax() {
  if (prefersReducedMotion) return;
  const items = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const rect = el.getBoundingClientRect();
      // distance of element center from viewport center
      const centerDelta = (rect.top + rect.height / 2) - vh / 2;
      const shift = -centerDelta * speed;
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ---------- Footer year ---------- */
function initYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

buildWorldMap();
initFanCarousel();
initSlideshow();
initScrollProgress();
initReveal();
initNav();
initSmoothScroll();
initForm();
initParallax();
initYear();
