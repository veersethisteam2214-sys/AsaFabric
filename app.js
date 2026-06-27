const useCases = [
  {
    title: "Shirtings",
    description: "Crisp TC shirting, oxford, and chambray — easy-care cloth with reliable shade continuity for uniforms and staff shirts.",
    count: "9 matching lots",
    tone: "academy",
    palette: ["#0f2a44", "#f4f0e7", "#b9c6d0"]
  },
  {
    title: "Pants & Trousers",
    description: "Structured poly cotton and twill trousering for school programs, office uniforms, and repeat tailoring orders.",
    count: "7 matching lots",
    tone: "executive",
    palette: ["#202631", "#b08a4f", "#d8dde2"]
  },
  {
    title: "Suitings",
    description: "Elevated wool-blend suiting with refined hand-feel for tailored trousers, jackets, blazers, and front-office uniforms.",
    count: "5 matching lots",
    tone: "utility",
    palette: ["#33483d", "#c1a06a", "#2a2b28"]
  },
  {
    title: "Workwear & Utility",
    description: "Hard-wearing twills, apron cloth, and utility shirting built for factory floors, service crews, and long-wear garments.",
    count: "6 matching lots",
    tone: "service",
    palette: ["#4b2034", "#f1e8db", "#8e785d"]
  },
  {
    title: "Resale & Clearance",
    description: "Mixed dead stock, lining, and pocketing bundles priced for value buyers, resellers, and export sourcing.",
    count: "8 matching lots",
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
    detail: "Crisp everyday shirting for school uniforms with easy-care structure and reliable color continuity.",
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
    detail: "Structured trouser and skirt fabric for school programs, office uniforms, and repeat tailoring orders.",
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
    grade: "Dead stock",
    roll: "Ask for lot price",
    cut: "Limited cuts",
    detail: "Assorted dead stock positioned for resellers, export buyers, small shops, and fast-moving value bundles.",
    applications: ["Resale", "Export", "Small shop bundles"],
    colors: ["#733d2f", "#203d47", "#d6b472"]
  }
];

/* ---------- Helpers ---------- */
// Refined woven-cloth texture from a fabric's palette.
// (Unsplash CDN is blocked by this environment's egress policy, so we ship
// crisp CSS fabric textures instead of broken remote images.)
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

/* ---------- Renderers ---------- */
const useGrid = document.querySelector("#useGrid");
const catalogGrid = document.querySelector("#catalogGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#fabricSearch");
let activeFilter = "all";

function renderUseCases() {
  if (!useGrid) return;
  const cards = useCases.map((item) => `
    <article class="use-card ${item.tone}" tabindex="0">
      <span class="use-pattern" style="background-image: ${weaveBackground(item.palette)}"></span>
      <small>${escapeHtml(item.count)}</small>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </article>
  `).join("");

  const soon = `
    <article class="use-card soon">
      <div>
        <span class="soon-mark" aria-hidden="true">+</span>
        <h3>More coming soon</h3>
        <p>Denims, linings, fashion fabrics and more uses are being added to the house.</p>
      </div>
    </article>
  `;

  useGrid.innerHTML = cards + soon;
}

function renderCatalog() {
  if (!catalogGrid) return;
  const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
  const filtered = fabrics.filter((fabric) => {
    const matchesFilter = activeFilter === "all" || fabric.use === activeFilter;
    const searchable = `${fabric.name} ${fabric.material} ${fabric.use} ${fabric.status} ${fabric.width} ${fabric.gsm} ${fabric.detail} ${fabric.applications.join(" ")}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  catalogGrid.innerHTML = filtered.map((fabric) => `
    <article class="fabric-card">
      <div class="fabric-visual">
        <div class="fabric-visual-img" style="background-image: ${weaveBackground(fabric.colors)}"></div>
        <span class="status">${escapeHtml(fabric.status)}</span>
      </div>
      <div class="fabric-body">
        <div class="fabric-heading">
          <div>
            <small>${escapeHtml(fabric.material)}</small>
            <h3>${escapeHtml(fabric.name)}</h3>
          </div>
          <strong>${escapeHtml(fabric.grade)}</strong>
        </div>
        <p>${escapeHtml(fabric.detail)}</p>
        <div class="spec-grid">
          <div><span>Use</span><strong>${escapeHtml(fabric.use)}</strong></div>
          <div><span>Width</span><strong>${escapeHtml(fabric.width)}</strong></div>
          <div><span>Weight</span><strong>${escapeHtml(fabric.gsm)}</strong></div>
          <div><span>Stock</span><strong>${escapeHtml(fabric.stock)}</strong></div>
        </div>
        <div class="application-tags">
          ${fabric.applications.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="price-row">
          <div>
            <small>Full roll</small>
            <strong>${escapeHtml(fabric.roll)}</strong>
          </div>
          <div>
            <small>Cut length</small>
            <strong>${escapeHtml(fabric.cut)}</strong>
          </div>
        </div>
      </div>
    </article>
  `).join("") || `<p class="empty-state">No fabrics match that search yet. Try a different material or clear the filter.</p>`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderCatalog();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", renderCatalog);
}

renderUseCases();
renderCatalog();

/* ---------- Hero slideshow ---------- */
function initSlideshow() {
  const root = document.querySelector("#slideshow");
  const slides = root ? Array.from(root.querySelectorAll(".slide")) : [];
  const dotsWrap = document.querySelector("#slideDots");
  const prevBtn = document.querySelector("#slidePrev");
  const nextBtn = document.querySelector("#slideNext");
  if (!root || slides.length < 2) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 5500;
  let current = 0;
  let timer = null;

  // build dots
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
  function prev() { goTo(current - 1); }

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

  // pause on hover
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  // pause when tab hidden
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

  // Stagger items within shared parents for a sequenced feel.
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

/* ---------- Floating nav on scroll + mobile menu ---------- */
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
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
}

/* ---------- Animated stat count-up ---------- */
function initStats() {
  const nums = document.querySelectorAll(".stat strong[data-count]");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    nums.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  nums.forEach((el) => observer.observe(el));
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

/* ---------- Footer year ---------- */
function initYear() {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
}

initSlideshow();
initScrollProgress();
initReveal();
initNav();
initSmoothScroll();
initStats();
initForm();
initYear();
