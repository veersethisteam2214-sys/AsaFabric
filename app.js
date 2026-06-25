/* =================================================================
   ASA FABRIC — app.js (vanilla, zero dependencies)

   Responsibilities
   - Data: fabric-use cards + sample catalog data
   - Render the "Crafted for every use" bento grid
   - Render the catalog grid + wire search/filter chips  (Sean's section)
   - Scroll-reveal (IntersectionObserver)
   - Animated stat counters
   - Sticky header condense, mobile nav, smooth scroll
   - Spotlight hover on cards
   All motion is guarded behind prefers-reduced-motion.
   ================================================================= */

"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -----------------------------------------------------------------
   FABRIC-USE DATA — drives the bento "Crafted for every use" grid.
   `use` maps to a catalog filter where one exists; `soon` cards are
   clearly marked placeholders for collections to be added later.
   ----------------------------------------------------------------- */
const useCases = [
  {
    title: "Shirtings",
    use: "Shirtings",
    description: "Poplin, oxford, and chambray woven for crisp collars and an easy, breathable hand.",
    palette: ["#21333f", "#16242d", "#7891a3"],
    size: "lg",
    icon: "shirt"
  },
  {
    title: "Trousers / Pants",
    use: "Trousers",
    description: "Structured twills and gabardine that hold a press and wear for years.",
    palette: ["#3a2c22", "#241a14", "#b4a27a"],
    size: "wide",
    icon: "trousers"
  },
  {
    title: "Suiting",
    use: "Suiting",
    description: "Worsted wool-blends with a refined drape for jackets, blazers, and tailored sets.",
    palette: ["#2a2c33", "#18191e", "#86785f"],
    icon: "suit"
  },
  {
    title: "Dresses",
    description: "Flowing wovens and soft linens for dressmaking lines.",
    palette: ["#4b2034", "#2a1320", "#c08aa0"],
    soon: true,
    icon: "dress"
  },
  {
    title: "Linings",
    description: "Smooth support cloth, pocketing, and inner facings.",
    palette: ["#1f2a2f", "#141c20", "#9fb7ca"],
    soon: true,
    icon: "lining"
  },
  {
    title: "Upholstery",
    description: "Heavier weaves for furnishing and soft goods.",
    palette: ["#33483d", "#1f2c26", "#c1a06a"],
    soon: true,
    icon: "upholstery"
  },
  {
    title: "Coating",
    description: "Dense melton and wool coatings for outerwear.",
    palette: ["#2d3036", "#1a1c20", "#86785f"],
    soon: true,
    icon: "coat"
  }
];

/* -----------------------------------------------------------------
   SAMPLE CATALOG DATA (placeholder lots).
   Replace with real stock data once the source is finalized.
   `use` values align with the catalog filter chips.
   ----------------------------------------------------------------- */
const fabrics = [
  {
    name: "Sea Island Poplin",
    material: "Cotton",
    use: "Shirtings",
    status: "In stock",
    width: "58 in",
    gsm: "120 GSM",
    stock: "28 rolls",
    grade: "Premium",
    roll: "$240 / roll",
    cut: "$7.40 / m",
    detail: "A fine, smooth poplin with a quiet sheen — the everyday luxury shirting.",
    tags: ["Shirts", "Blouses", "Formal"],
    colors: ["#f8f5ee", "#9fb7ca", "#0f2a44"]
  },
  {
    name: "Royal Oxford",
    material: "Cotton blend",
    use: "Shirtings",
    status: "In stock",
    width: "58 in",
    gsm: "160 GSM",
    stock: "18 rolls",
    grade: "Refined",
    roll: "$300 / roll",
    cut: "$9.50 / m",
    detail: "Textured basketweave with a soft lustre — dressy yet relaxed.",
    tags: ["Shirts", "Smart-casual"],
    colors: ["#faf7ef", "#c3d6df", "#6b8390"]
  },
  {
    name: "Indigo Chambray",
    material: "Cotton",
    use: "Shirtings",
    status: "Featured",
    width: "57 in",
    gsm: "150 GSM",
    stock: "11 rolls",
    grade: "Breathable",
    roll: "$268 / roll",
    cut: "$8.30 / m",
    detail: "Light, airy weave with a denim-washed depth of colour.",
    tags: ["Shirts", "Casual", "Workwear"],
    colors: ["#7891a3", "#d8e0e3", "#39566b"]
  },
  {
    name: "Heritage Twill",
    material: "Cotton twill",
    use: "Trousers",
    status: "In stock",
    width: "60 in",
    gsm: "235 GSM",
    stock: "14 rolls",
    grade: "Hard-wearing",
    roll: "$380 / roll",
    cut: "$11.80 / m",
    detail: "A diagonal twill that takes a sharp crease and resists wear.",
    tags: ["Trousers", "Chinos", "Workwear"],
    colors: ["#59684d", "#c6af80", "#303329"]
  },
  {
    name: "Pressed Gabardine",
    material: "Poly cotton",
    use: "Trousers",
    status: "Priority lot",
    width: "60 in",
    gsm: "210 GSM",
    stock: "16 rolls",
    grade: "Tailoring",
    roll: "$350 / roll",
    cut: "$10.60 / m",
    detail: "Tightly woven gabardine with a clean face and durable drape.",
    tags: ["Trousers", "Uniforms", "Skirts"],
    colors: ["#3f4242", "#b4a27a", "#e8dfd0"]
  },
  {
    name: "Worsted Wool Suiting",
    material: "Wool blend",
    use: "Suiting",
    status: "Premium lot",
    width: "60 in",
    gsm: "260 GSM",
    stock: "9 rolls",
    grade: "Executive",
    roll: "$610 / roll",
    cut: "$19.40 / m",
    detail: "An elevated handfeel with refined drape — tailored trousers and jackets.",
    tags: ["Blazers", "Suits", "Trousers"],
    colors: ["#2d3036", "#202a38", "#86785f"]
  },
  {
    name: "Herringbone Flannel",
    material: "Wool blend",
    use: "Suiting",
    status: "Featured",
    width: "59 in",
    gsm: "280 GSM",
    stock: "7 rolls",
    grade: "Seasonal",
    roll: "$680 / roll",
    cut: "$21.50 / m",
    detail: "A soft, brushed flannel with a classic herringbone weave.",
    tags: ["Suits", "Jackets", "Outerwear"],
    colors: ["#3a3d44", "#23252b", "#9b9079"]
  },
  {
    name: "Mixed Clearance Lot",
    material: "Assorted",
    use: "Clearance",
    status: "Clearance",
    width: "44–60 in",
    gsm: "Varies",
    stock: "By lot",
    grade: "Dead stock",
    roll: "Ask for price",
    cut: "Limited",
    detail: "Assorted dead stock bundled for resellers, export, and project buyers.",
    tags: ["Resale", "Export", "Bundle"],
    colors: ["#733d2f", "#203d47", "#d6b472"]
  }
];

/* Catalog filter chips (Shirtings / Trousers / Suiting + extras) */
const filters = ["All", "Shirtings", "Trousers", "Suiting", "Clearance"];

/* Inline SVG icon set for use cards */
const ICONS = {
  shirt: '<path d="M6 4l3-1 3 2 3-2 3 1 3 4-3 2v8H6v-8L3 8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  trousers: '<path d="M7 3h10l-1 18h-3l-1-9-1 9H7L6 3z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  suit: '<path d="M8 3l4 4 4-4 4 3-2 15h-4l-2-8-2 8H6L4 6z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  dress: '<path d="M9 3l3 3 3-3 3 6-2 2 2 9H7l2-9-2-2z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  lining: '<path d="M5 4h14v16H5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 4v16M15 4v16" stroke="currentColor" stroke-width="1" opacity=".5"/>',
  upholstery: '<rect x="4" y="9" width="16" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 9V7a2 2 0 0 1 4 0M14 9V7a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  coat: '<path d="M8 3l4 3 4-3 4 4-3 2v11h-4l-1-7-1 7H7V9L4 7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'
};
const ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* DOM refs */
const usesGrid = document.querySelector("#usesGrid");
const catalogGrid = document.querySelector("#catalogGrid");
const filterChips = document.querySelector("#filterChips");
const searchInput = document.querySelector("#fabricSearch");

let activeFilter = "All";

/* -----------------------------------------------------------------
   Weave background generator (CSS gradients standing in for photos)
   ----------------------------------------------------------------- */
function weave(colors) {
  const [a, b, c] = colors;
  return `linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px), ` +
         `linear-gradient(0deg, rgba(0,0,0,0.20) 1px, transparent 1px), ` +
         `linear-gradient(135deg, ${a}, ${b} 55%, ${c})`;
}

/* -----------------------------------------------------------------
   Render: "Crafted for every use" bento grid
   ----------------------------------------------------------------- */
function renderUseCases() {
  usesGrid.innerHTML = useCases.map((item) => {
    const sizeClass = item.size === "lg" ? "use-card--lg" : item.size === "wide" ? "use-card--wide" : "";
    const soonBadge = item.soon ? '<span class="use-card__soon">Coming soon</span>' : "";
    const soonClass = item.soon ? "is-soon" : "";
    const link = item.soon
      ? ""
      : `<a class="use-card__link" href="#catalog" data-jump="${item.use}">Explore ${ARROW}</a>`;
    return `
      <article class="use-card reveal ${sizeClass} ${soonClass}" ${item.soon ? "" : "data-spotlight"}>
        <span class="use-card__weave" style="background-image:${weave(item.palette)}"></span>
        ${soonBadge}
        <div class="use-card__body">
          <span class="use-card__icon"><svg viewBox="0 0 24 24">${ICONS[item.icon] || ""}</svg></span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          ${link}
        </div>
      </article>`;
  }).join("");
}

/* =================================================================
   ===== CATALOG SECTION — owned by Sean (catalog functionality).
   Landing page provides the shell + sample data (chips, search, grid);
   full filtering/data wiring is Sean's scope. =====
   ================================================================= */
function renderChips() {
  filterChips.innerHTML = filters.map((f) =>
    `<button class="chip ${f === activeFilter ? "is-active" : ""}" type="button" data-filter="${f}" aria-pressed="${f === activeFilter}">${f}</button>`
  ).join("");
}

function renderCatalog() {
  const query = (searchInput.value || "").trim().toLowerCase();
  const filtered = fabrics.filter((fabric) => {
    const matchesFilter = activeFilter === "All" || fabric.use === activeFilter;
    const haystack = `${fabric.name} ${fabric.material} ${fabric.use} ${fabric.status} ${fabric.detail} ${fabric.tags.join(" ")}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });

  catalogGrid.innerHTML = filtered.map((fabric) => `
    <article class="fabric-card">
      <div class="fabric-card__visual" style="background-image:${weave(fabric.colors)}">
        <span class="fabric-card__status">${fabric.status}</span>
      </div>
      <div class="fabric-card__body">
        <div class="fabric-card__top">
          <div>
            <span class="fabric-card__material">${fabric.material}</span>
            <h3 class="fabric-card__name">${fabric.name}</h3>
          </div>
          <span class="fabric-card__grade">${fabric.grade}</span>
        </div>
        <p class="fabric-card__detail">${fabric.detail}</p>
        <div class="spec">
          <div><span>Use</span><strong>${fabric.use}</strong></div>
          <div><span>Width</span><strong>${fabric.width}</strong></div>
          <div><span>Weight</span><strong>${fabric.gsm}</strong></div>
          <div><span>Stock</span><strong>${fabric.stock}</strong></div>
        </div>
        <div class="tags">${fabric.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="price-row">
          <div><small>Full roll</small><strong>${fabric.roll}</strong></div>
          <div><small>Cut length</small><strong>${fabric.cut}</strong></div>
        </div>
      </div>
    </article>
  `).join("") || `<p class="empty-state">No fabrics match that search yet.</p>`;
}

/* Chip + search wiring */
filterChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeFilter = btn.dataset.filter;
  renderChips();
  renderCatalog();
});
searchInput.addEventListener("input", renderCatalog);
/* ===== END CATALOG SECTION (Sean) ===== */

/* Jump-to-catalog filtered, from bento "Explore" links */
document.addEventListener("click", (e) => {
  const jump = e.target.closest("[data-jump]");
  if (!jump) return;
  const target = jump.dataset.jump;
  if (filters.includes(target)) {
    activeFilter = target;
    renderChips();
    renderCatalog();
  }
});

/* -----------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   ----------------------------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
}

/* -----------------------------------------------------------------
   Animated stat counters
   ----------------------------------------------------------------- */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  if (prefersReducedMotion) { el.textContent = target + suffix; return; }
  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const nums = document.querySelectorAll(".stat__num");
  if (!("IntersectionObserver" in window)) { nums.forEach(animateCount); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => io.observe(n));
}

/* -----------------------------------------------------------------
   Sticky header condense on scroll
   ----------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector("#siteHeader");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* -----------------------------------------------------------------
   Mobile nav toggle
   ----------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector("#navToggle");
  const nav = document.querySelector("#primaryNav");
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* -----------------------------------------------------------------
   Smooth scroll for in-page anchors (offset for sticky header)
   ----------------------------------------------------------------- */
function initSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

/* -----------------------------------------------------------------
   Spotlight hover — feeds --mx/--my to spotlight cards
   ----------------------------------------------------------------- */
function initSpotlight() {
  if (prefersReducedMotion) return;
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest("[data-spotlight]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

/* -----------------------------------------------------------------
   Hero parallax (subtle pointer-driven tilt on the swatch stack)
   ----------------------------------------------------------------- */
function initHeroParallax() {
  if (prefersReducedMotion) return;
  const visual = document.querySelector("[data-parallax]");
  if (!visual) return;
  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    visual.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  hero.addEventListener("pointerleave", () => { visual.style.transform = ""; });
}

/* -----------------------------------------------------------------
   Dismissible announcement bar
   ----------------------------------------------------------------- */
function initAnnounce() {
  const close = document.querySelector("#announceClose");
  const bar = document.querySelector("#announce");
  if (close && bar) close.addEventListener("click", () => { bar.hidden = true; });
}

/* -----------------------------------------------------------------
   Footer year
   ----------------------------------------------------------------- */
function initYear() {
  const y = document.querySelector("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* -----------------------------------------------------------------
   Init
   ----------------------------------------------------------------- */
renderUseCases();
renderChips();
renderCatalog();
initReveal();
initCounters();
initStickyHeader();
initMobileNav();
initSmoothScroll();
initSpotlight();
initHeroParallax();
initAnnounce();
initYear();
