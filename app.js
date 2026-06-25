/* ===== Data ===== */

const fabricCategories = [
  {
    title: "Shirtings",
    description: "Crisp TC, oxford, and cotton-blend shirting for school, office, and hospitality programs.",
    tag: "9 lots",
    keyword: "shirting",
    palette: ["#0f2a44", "#f4f0e7", "#b9c6d0"]
  },
  {
    title: "Suitings",
    description: "Wool blend and structured suiting with an elevated handfeel for tailored, front-office wear.",
    tag: "5 lots",
    keyword: "suiting",
    palette: ["#202631", "#b08a4f", "#d8dde2"]
  },
  {
    title: "Trousering",
    description: "Poly cotton and durable bottom-weight cloth for school, office, and uniform trousers.",
    tag: "6 lots",
    keyword: "trouser",
    palette: ["#3f4242", "#b4a27a", "#e8dfd0"]
  },
  {
    title: "Workwear Cloth",
    description: "Chambray, poly twill, and utility fabric engineered for aprons, factory, and service wear.",
    tag: "7 lots",
    keyword: "twill",
    palette: ["#33483d", "#c1a06a", "#2a2b28"]
  },
  {
    title: "Linings & Support",
    description: "Cost-efficient pocketing, lining, and support cloth for production add-ons and sampling.",
    tag: "4 lots",
    keyword: "lining",
    palette: ["#4b2034", "#f1e8db", "#8e785d"]
  },
  {
    title: "Clearance Lots",
    description: "Mixed dead stock and bundle deals for resellers, export buyers, and value sourcing.",
    tag: "8 lots",
    keyword: "clearance",
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
    applications: ["Shirting", "Daily uniforms", "Institution orders"],
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
    applications: ["Trouser", "Skirts", "Uniform sets"],
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
    applications: ["Suiting", "Blazers", "Office uniforms"],
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
    applications: ["Aprons", "Twill", "Utility trousers"],
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
    applications: ["Shirting", "Hotel shirts", "Staff programs"],
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
    detail: "Assorted dead stock clearance positioned for resellers, export buyers, small shops, and fast-moving value bundles.",
    applications: ["Resale", "Clearance", "Small shop bundles"],
    colors: ["#733d2f", "#203d47", "#d6b472"]
  }
];

/* ===== Element refs ===== */
const fabricUseGrid = document.querySelector("#fabricUseGrid");
const catalogGrid = document.querySelector("#catalogGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#fabricSearch");
const siteHeader = document.querySelector("#siteHeader");
const leadForm = document.querySelector("#leadForm");

let activeFilter = "all";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Helpers ===== */
function weaveBackground(colors) {
  const [first, second, third] = colors;
  return `linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.18) 1px, transparent 1px), radial-gradient(circle at 26% 20%, rgba(255,255,255,0.28), transparent 28%), linear-gradient(135deg, ${first}, ${second} 48%, ${third})`;
}

/* ===== Fabric-use category grid ===== */
function renderFabricCategories() {
  if (!fabricUseGrid) return;
  fabricUseGrid.innerHTML = fabricCategories.map((item) => `
    <button class="use-card reveal" type="button" data-keyword="${item.keyword}" aria-label="Browse ${item.title} in the catalogue">
      <span class="use-pattern" style="background-image: ${weaveBackground(item.palette)}"></span>
      <div>
        <small>${item.tag}</small>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </button>
  `).join("");

  fabricUseGrid.querySelectorAll(".use-card").forEach((card) => {
    card.addEventListener("click", () => {
      const keyword = card.dataset.keyword || "";
      // Reset use-case filter so the keyword search drives results.
      activeFilter = "all";
      filterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === "all");
      });
      if (searchInput) {
        searchInput.value = keyword;
      }
      renderCatalog();
      const catalog = document.querySelector("#catalog");
      if (catalog) {
        catalog.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  observeReveals(fabricUseGrid.querySelectorAll(".reveal"));
}

/* ===== Catalogue ===== */
function renderCatalog() {
  if (!catalogGrid) return;
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const filtered = fabrics.filter((fabric) => {
    const matchesFilter = activeFilter === "all" || fabric.use === activeFilter;
    const searchable = `${fabric.name} ${fabric.material} ${fabric.use} ${fabric.status} ${fabric.width} ${fabric.gsm} ${fabric.detail} ${fabric.applications.join(" ")}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  catalogGrid.innerHTML = filtered.map((fabric) => `
    <article class="fabric-card reveal">
      <div class="fabric-visual" style="background-image: ${weaveBackground(fabric.colors)}">
        <span>${fabric.status}</span>
      </div>
      <div class="fabric-body">
        <div class="fabric-heading">
          <div>
            <small>${fabric.material}</small>
            <h3>${fabric.name}</h3>
          </div>
          <strong>${fabric.grade}</strong>
        </div>
        <p>${fabric.detail}</p>
        <div class="spec-grid">
          <div><span>Use</span><strong>${fabric.use}</strong></div>
          <div><span>Width</span><strong>${fabric.width}</strong></div>
          <div><span>Weight</span><strong>${fabric.gsm}</strong></div>
          <div><span>Stock</span><strong>${fabric.stock}</strong></div>
        </div>
        <div class="application-tags">
          ${fabric.applications.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <div class="price-row">
          <div>
            <small>Full roll</small>
            <strong>${fabric.roll}</strong>
          </div>
          <div>
            <small>Cut length</small>
            <strong>${fabric.cut}</strong>
          </div>
        </div>
      </div>
    </article>
  `).join("") || `<p class="empty-state">No fabrics match that search yet.</p>`;

  observeReveals(catalogGrid.querySelectorAll(".reveal"));
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

/* ===== Scroll reveal ===== */
let revealObserver = null;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
}

function observeReveals(nodes) {
  if (!nodes) return;
  // Apply a staggered delay within sibling groups for grid cards.
  nodes.forEach((node, index) => {
    if (!node.style.transitionDelay) {
      node.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    }
    if (revealObserver) {
      revealObserver.observe(node);
    } else {
      node.classList.add("is-visible");
    }
  });
}

/* ===== Count-up metrics ===== */
function animateCount(el) {
  const target = Number(el.dataset.target || "0");
  const suffix = el.dataset.suffix || "";
  if (prefersReducedMotion || !Number.isFinite(target)) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

function setupCounters() {
  const counters = document.querySelectorAll(".count");
  if (!counters.length) return;
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    counters.forEach(animateCount);
    return;
  }
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((counter) => countObserver.observe(counter));
}

/* ===== Sticky header scroll state ===== */
function setupHeaderScroll() {
  if (!siteHeader) return;
  const onScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ===== Contact form (client-side) ===== */
function setupLeadForm() {
  if (!leadForm) return;

  const fields = [
    { id: "leadName", errId: "errName", message: "Please enter your name." },
    { id: "leadEmail", errId: "errEmail", message: "Please enter a valid email address." },
    { id: "leadIntent", errId: "errIntent", message: "Please choose a buying intent." },
    { id: "leadRequirement", errId: "errRequirement", message: "Please describe your requirement." }
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    const input = document.getElementById(field.id);
    const errEl = document.getElementById(field.errId);
    const label = input ? input.closest("label") : null;
    if (!input || !errEl || !label) return true;

    const value = input.value.trim();
    let valid = value.length > 0;
    if (valid && field.id === "leadEmail") {
      valid = emailPattern.test(value);
    }

    label.classList.toggle("invalid", !valid);
    errEl.textContent = valid ? "" : field.message;
    return valid;
  }

  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    if (input) {
      input.addEventListener("input", () => validateField(field));
      input.addEventListener("blur", () => validateField(field));
    }
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let allValid = true;
    let firstInvalid = null;
    fields.forEach((field) => {
      const ok = validateField(field);
      if (!ok && !firstInvalid) {
        firstInvalid = document.getElementById(field.id);
      }
      allValid = allValid && ok;
    });

    if (!allValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const success = document.createElement("div");
    success.className = "form-success";
    success.setAttribute("role", "status");
    success.innerHTML = `
      <span class="success-mark" aria-hidden="true">&#10003;</span>
      <strong>Thanks — your enquiry is in.</strong>
      <p>We'll send today's verified stock list, matching lots, and pricing shortly.</p>
    `;
    leadForm.replaceWith(success);
  });
}

/* ===== Init ===== */
renderFabricCategories();
renderCatalog();
setupCounters();
setupHeaderScroll();
setupLeadForm();

// Observe static (non-rendered) reveal elements.
observeReveals(document.querySelectorAll(".reveal:not(.is-visible)"));
