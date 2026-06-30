/* ============================================================
   Asa Fabric — Catalogue
   Self-contained (no app.js dependency): owns the catalogue data,
   search / filter / detail / request-list / enquiry, plus the
   shared nav, scroll-progress, reveal and smooth-scroll behaviours
   ported from the landing page so the page behaves identically.

   PREVIEW / TEMPLATE: placeholder swatches (no real photos), no
   stock figures shown to buyers, pricing is "quote on request",
   no real email send, the viewing calendar is illustrative.
   Fabric vocabulary is drawn from the real ASA inventory workbook.
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
function monogram(name) {
  const words = name.replace(/[()]/g, "").split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
function gsmLabel(gsm) {
  return /^\d/.test(gsm) ? gsm + " gsm" : gsm;
}

/* ---------- Catalogue data — product attributes only, no stock ----------
   name      : the cloth (display, serif)        type : fabric family (eyebrow / Type facet)
   use       : primary application (Use facet)    width / gsm : product specs (not inventory)
   garments  : what it's made into (tags + search)  detail : one-line description */
const fabrics = [
  { id: "AF-01", name: "Chambray CVC", type: "Shirting", use: "School uniforms", width: '60"', gsm: "120–145", garments: ["Shirts", "Daily uniforms"], detail: "Crisp CVC chambray with reliable shade continuity — the everyday school-shirt workhorse." },
  { id: "AF-02", name: "Cotton Dobby", type: "Shirting", use: "School uniforms", width: '44"', gsm: "110–130", garments: ["Shirts", "Blouses"], detail: "Fine self-textured dobby in white — a step up in hand-feel for premium uniform and blouse programmes." },
  { id: "AF-03", name: "Oxford", type: "Shirting", use: "Corporate", width: '58"', gsm: "150–160", garments: ["Office shirts", "Hotel shirts"], detail: "Textured oxford with a refined business finish for office staff, front-desk teams and branded uniforms." },
  { id: "AF-04", name: "Cotton Poplin", type: "Shirting", use: "Corporate", width: '58"', gsm: "110–125", garments: ["Dress shirts", "Blouses"], detail: "Smooth, closely-woven poplin with a clean drape — a dependable dress-shirt base across a wide shade range." },
  { id: "AF-05", name: "Pinpoint", type: "Shirting", use: "Hospitality", width: '57"', gsm: "130", garments: ["Service shirts"], detail: "Pinpoint oxford that wears smarter than a plain weave — tidy for hospitality and front-of-house shirting." },
  { id: "AF-06", name: "Soft Twill CVC", type: "Shirting", use: "Workwear", width: '58"', gsm: "150", garments: ["Work shirts", "Overshirts"], detail: "Soft-twill CVC with extra durability for utility shirts and hard-wearing shop uniforms." },
  { id: "AF-07", name: "Wool Blend", type: "Suiting", use: "Corporate", width: '60"', gsm: "250–270", garments: ["Blazers", "Trousers"], detail: "Elevated wool-blend handfeel for tailored jackets, blazers and front-office uniforms." },
  { id: "AF-08", name: "Poly-Viscose", type: "Suiting", use: "Corporate", width: '58"', gsm: "220", garments: ["Suits", "Skirts"], detail: "Wrinkle-resistant poly-viscose with a clean matte finish — a practical everyday suiting for staff programmes." },
  { id: "AF-09", name: "Tropical", type: "Suiting", use: "Hospitality", width: '60"', gsm: "190", garments: ["Lightweight suits"], detail: "Open, breathable tropical weave for warm-climate suiting and lightweight hospitality tailoring." },
  { id: "AF-10", name: "Birdseye", type: "Suiting", use: "Corporate", width: '58"', gsm: "240", garments: ["Executive suits"], detail: "Subtle birdseye texture that reads as quiet luxury up close — an executive-grade suiting." },
  { id: "AF-11", name: "Poly-Cotton (TC)", type: "Trousering", use: "School uniforms", width: '60"', gsm: "185–220", garments: ["Trousers", "Skirts"], detail: "Structured TC trousering built for school programmes and repeat tailoring." },
  { id: "AF-12", name: "Cotton Gabardine", type: "Trousering", use: "Corporate", width: '58"', gsm: "230", garments: ["Trousers", "Skirts"], detail: "Tightly-woven gabardine with a smart finish and good crease recovery for office trousering." },
  { id: "AF-13", name: "Bull Denim", type: "Trousering", use: "Workwear", width: '60"', gsm: "300", garments: ["Work trousers", "Aprons"], detail: "Heavy bull denim for rugged work trousers, aprons and long-wear utility garments." },
  { id: "AF-14", name: "Stretch Chino Twill", type: "Trousering", use: "Corporate", width: '58"', gsm: "240", garments: ["Chinos", "Trousers"], detail: "Comfort-stretch cotton twill for modern chino-cut staff trousers with all-day movement." },
  { id: "AF-15", name: "Cotton Drill", type: "Twill/Drill", use: "Workwear", width: '60"', gsm: "270", garments: ["Workwear", "Aprons"], detail: "Classic cotton drill — the dependable mid-weight for workwear, aprons and factory uniforms." },
  { id: "AF-16", name: "Poly Twill", type: "Twill/Drill", use: "Workwear", width: '60"', gsm: "235", garments: ["Utility trousers", "Jackets"], detail: "Durable poly twill that holds colour and shape through heavy laundering and daily wear." },
  { id: "AF-17", name: "Canvas Duck", type: "Workwear", use: "Workwear", width: '62"', gsm: "320", garments: ["Aprons", "Bags", "Jackets"], detail: "Stiff, hard-wearing cotton duck for aprons, tool bags and structured work jackets." },
  { id: "AF-18", name: "Ripstop", type: "Workwear", use: "Workwear", width: '58"', gsm: "210", garments: ["Workwear", "Outerwear"], detail: "Grid-reinforced ripstop that resists tearing — for technical workwear and light outerwear." },
  { id: "AF-19", name: "Herringbone", type: "Twill/Drill", use: "Corporate", width: '58"', gsm: "250", garments: ["Jackets", "Trousers"], detail: "Tonal herringbone with quiet visual interest — a refined twill for jackets and smart trousers." },
  { id: "AF-20", name: "Pure Linen", type: "Linen", use: "Hospitality", width: '56"', gsm: "180", garments: ["Shirts", "Tablewear"], detail: "Natural pure linen with a breathable, characterful slub — premium for hospitality and resort wear." },
  { id: "AF-21", name: "Linen-Cotton", type: "Linen", use: "Hospitality", width: '57"', gsm: "165", garments: ["Shirts", "Dresses"], detail: "Linen-cotton that keeps the linen hand while easing the creasing — versatile for service and resort lines." },
  { id: "AF-22", name: "Cotton Voile", type: "Linen", use: "Corporate", width: '44"', gsm: "80", garments: ["Blouses", "Layers"], detail: "Light, semi-sheer cotton voile for soft blouses, layering and fine summer pieces." },
  { id: "AF-23", name: "Slub Cotton", type: "Linen", use: "Hospitality", width: '56"', gsm: "150", garments: ["Shirts", "Aprons"], detail: "Textured slub cotton with an artisanal look — a favourite for cafe and boutique-hospitality uniforms." },
  { id: "AF-24", name: "TC Pocketing", type: "Lining", use: "Resale", width: '44"', gsm: "90", garments: ["Pocketing", "Bundles"], detail: "Cost-efficient TC pocketing for linings, production add-ons and resale bundles." },
  { id: "AF-25", name: "Viscose Lining", type: "Lining", use: "Corporate", width: '58"', gsm: "75", garments: ["Jacket lining", "Skirts"], detail: "Smooth viscose lining with a clean slip for tailored jackets, skirts and uniform finishing." },
  { id: "AF-26", name: "Satin Lining", type: "Lining", use: "Hospitality", width: '58"', gsm: "85", garments: ["Lining", "Trims"], detail: "Soft satin-faced lining that adds a touch of sheen to service jackets and waistcoats." },
  { id: "AF-27", name: "Apron Twill", type: "Workwear", use: "Hospitality", width: '59"', gsm: "210", garments: ["Aprons", "Chef jackets"], detail: "Substantial apron and service-jacket cloth for restaurants, hotels and front-of-house teams." },
  { id: "AF-28", name: "Chef Check", type: "Shirting", use: "Hospitality", width: '57"', gsm: "140", garments: ["Chef wear", "Aprons"], detail: "Classic kitchen check in a hard-wearing cotton-rich weave for chef and service uniforms." },
  { id: "AF-29", name: "Mixed Dead-Stock", type: "Clearance", use: "Resale", width: "Assorted", gsm: "Varies", garments: ["Resale", "Export"], detail: "Assorted dead stock positioned for resellers, export buyers and fast-moving value bundles." },
  { id: "AF-30", name: "Lining Clearance", type: "Clearance", use: "Resale", width: '44–60"', gsm: "Varies", garments: ["Lining", "Pocketing"], detail: "Mixed lining and pocketing clearance — clean, usable lots bundled into decisive offers for value buyers." }
];

/* ---------- State ---------- */
const state = { query: "", types: new Set(), uses: new Set() };
let requestList = loadRequest();
let hasRendered = false;

/* ---------- Fuse (graceful fallback to includes) ---------- */
let fuse = null;
if (window.Fuse) {
  fuse = new window.Fuse(fabrics, {
    keys: [
      { name: "name", weight: 0.4 },
      { name: "type", weight: 0.2 },
      { name: "use", weight: 0.15 },
      { name: "garments", weight: 0.15 },
      { name: "detail", weight: 0.1 }
    ],
    threshold: 0.35, ignoreLocation: true, minMatchCharLength: 2
  });
}

/* ---------- Elements ---------- */
const grid = document.querySelector("#catalogGrid");
const emptyState = document.querySelector("#emptyState");
const resultsCount = document.querySelector("#resultsCount");
const clearFiltersBtn = document.querySelector("#clearFilters");
const searchInput = document.querySelector("#fabricSearch");
const searchClear = document.querySelector("#searchClear");
const typeFilters = document.querySelector("#typeFilters");
const useFilters = document.querySelector("#useFilters");
const modal = document.querySelector("#fabricModal");

/* ---------- Filter tabs ---------- */
function uniqueBy(key) { return [...new Set(fabrics.map((f) => f[key]))]; }
function buildTabs() {
  const types = uniqueBy("type");
  const uses = ["School uniforms", "Corporate", "Workwear", "Hospitality", "Resale"].filter((u) => uniqueBy("use").includes(u));
  typeFilters.innerHTML = tabHtml("all", "All", "type", true) + types.map((t) => tabHtml(t, t, "type")).join("");
  useFilters.innerHTML = tabHtml("all", "All", "use", true) + uses.map((u) => tabHtml(u, u, "use")).join("");
  document.querySelectorAll(".fab-tab").forEach((tab) => tab.addEventListener("click", onTabClick));
}
function tabHtml(value, label, facet, isAll) {
  return `<button class="fab-tab" type="button" role="switch" aria-pressed="${isAll ? "true" : "false"}" data-facet="${facet}" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
}
function onTabClick(e) {
  const tab = e.currentTarget;
  const set = tab.dataset.facet === "type" ? state.types : state.uses;
  const v = tab.dataset.value;
  if (v === "all") set.clear();
  else set.has(v) ? set.delete(v) : set.add(v);
  syncTabs(tab.dataset.facet);
  render();
}
function syncTabs(facet) {
  const set = facet === "type" ? state.types : state.uses;
  (facet === "type" ? typeFilters : useFilters).querySelectorAll(".fab-tab").forEach((tab) => {
    const v = tab.dataset.value;
    tab.setAttribute("aria-pressed", String(v === "all" ? set.size === 0 : set.has(v)));
  });
}

/* ---------- Filtering ---------- */
function currentList() {
  let list = state.query && fuse
    ? fuse.search(state.query).map((r) => r.item)
    : (state.query ? fabrics.filter((f) => searchable(f).includes(state.query.toLowerCase())) : fabrics.slice());
  if (state.types.size) list = list.filter((f) => state.types.has(f.type));
  if (state.uses.size) list = list.filter((f) => state.uses.has(f.use));
  return list;
}
function searchable(f) {
  return `${f.name} ${f.type} ${f.use} ${f.garments.join(" ")} ${f.detail}`.toLowerCase();
}

/* ---------- Render grid ---------- */
function cardHtml(f, i) {
  const added = requestList.includes(f.id);
  const meta = [f.use, f.width, gsmLabel(f.gsm)].join(" · ");
  return `<article class="fab-card${hasRendered ? "" : " reveal"}" style="--i:${i % 8}">
    <span class="fab-swatch" data-tone="${escapeHtml(f.type)}" aria-hidden="true">
      <span class="fab-mono">${escapeHtml(monogram(f.name))}</span>
      <span class="fab-swatch-tag">Sample on request</span>
    </span>
    <div class="fab-info">
      <p class="fab-type">${escapeHtml(f.type)}</p>
      <h3 class="fab-name"><button class="fab-open" type="button" data-id="${f.id}">${escapeHtml(f.name)}</button></h3>
      <p class="fab-meta">${escapeHtml(meta)}</p>
      <div class="fab-foot">
        <span class="fab-quote">Quote on request</span>
        <button class="fab-add${added ? " is-added" : ""}" type="button" data-id="${f.id}" aria-label="${added ? "Remove " + escapeHtml(f.name) + " from" : "Add " + escapeHtml(f.name) + " to"} request list">${added ? "Added" : "Add"}<span class="fab-add-x" aria-hidden="true"></span></button>
      </div>
    </div>
  </article>`;
}
function render() {
  const list = currentList();
  grid.innerHTML = list.map(cardHtml).join("");
  emptyState.hidden = list.length > 0;
  const filtered = state.types.size || state.uses.size || state.query;
  resultsCount.textContent = filtered ? `${list.length} of ${fabrics.length}` : `${fabrics.length} fabrics`;
  clearFiltersBtn.hidden = !filtered;

  grid.querySelectorAll(".fab-open").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.id)));
  grid.querySelectorAll(".fab-add").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); toggleRequest(b.dataset.id); }));

  if (!hasRendered) { revealObserve(grid.querySelectorAll(".reveal")); hasRendered = true; }
  searchClear.hidden = !state.query;
}

/* ---------- Modal ---------- */
function specRow(k, v) {
  return `<div class="m-spec"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`;
}
function openModal(id) {
  const f = fabrics.find((x) => x.id === id);
  if (!f) return;
  const added = requestList.includes(f.id);
  modal.innerHTML = `<div class="m-inner">
    <button class="m-close" type="button" data-close aria-label="Close">&times;</button>
    <div class="m-banner" data-tone="${escapeHtml(f.type)}" aria-hidden="true">
      <span class="m-mono">${escapeHtml(monogram(f.name))}</span>
      <span class="fab-swatch-tag">Sample on request</span>
    </div>
    <div class="m-body">
      <p class="m-type">${escapeHtml(f.type)}</p>
      <h2 class="m-name">${escapeHtml(f.name)}</h2>
      <p class="m-detail">${escapeHtml(f.detail)}</p>
      <dl class="m-specs">
        ${specRow("Application", f.use)}
        ${specRow("Width", f.width)}
        ${specRow("Weight", gsmLabel(f.gsm))}
        ${specRow("Best for", f.garments.join(", "))}
      </dl>
      <p class="m-quote">Pricing — <strong>quote on request.</strong> Sold by the roll or cut to length.</p>
      <div class="m-actions">
        <button class="btn btn-solid" type="button" data-act="sample">Request a sample <span aria-hidden="true">→</span></button>
        <button class="btn btn-ghost" type="button" data-act="quote">Request a quote</button>
        <button class="btn btn-ghost" type="button" data-act="add">${added ? "Added to request" : "Add to request"}</button>
      </div>
      <button class="m-spec-link" type="button" data-act="spec">Download spec sheet (PDF)</button>
    </div>
  </div>`;
  modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => modal.close()));
  modal.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => modalAction(b.dataset.act, f)));
  if (typeof modal.showModal === "function") modal.showModal();
}
function modalAction(act, f) {
  if (act === "add") { toggleRequest(f.id); openModal(f.id); return; }
  if (act === "spec") { printSpecSheet(f); return; }
  if (act === "sample" || act === "quote") {
    if (!requestList.includes(f.id)) toggleRequest(f.id, true);
    modal.close(); setIntent(act); goToEnquiry();
  }
}
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

/* ---------- Request list ---------- */
function loadRequest() { try { return JSON.parse(localStorage.getItem("asa-request-list")) || []; } catch (_) { return []; } }
function saveRequest() { try { localStorage.setItem("asa-request-list", JSON.stringify(requestList)); } catch (_) {} }
function toggleRequest(id, forceAdd) {
  const i = requestList.indexOf(id);
  if (i > -1 && !forceAdd) requestList.splice(i, 1);
  else if (i === -1) requestList.push(id);
  saveRequest(); refreshRequestUI();
}
function refreshRequestUI() {
  const n = requestList.length;
  ["requestCount", "drawerCount"].forEach((id) => {
    const el = document.querySelector("#" + id);
    if (el) { el.textContent = String(n); el.dataset.empty = String(n === 0); }
  });
  grid.querySelectorAll(".fab-add").forEach((b) => {
    const added = requestList.includes(b.dataset.id);
    b.classList.toggle("is-added", added);
    b.firstChild.textContent = added ? "Added" : "Add";
  });
  renderDrawer(); renderSelectedSummary();
}
function renderDrawer() {
  const body = document.querySelector("#drawerBody");
  if (!body) return;
  if (!requestList.length) {
    body.innerHTML = `<p class="drawer-empty">Your request list is empty. Add fabrics to request samples or a quote together.</p>`;
    return;
  }
  body.innerHTML = requestList.map((id) => {
    const f = fabrics.find((x) => x.id === id);
    if (!f) return "";
    return `<div class="drawer-item">
      <span class="drawer-mono" data-tone="${escapeHtml(f.type)}" aria-hidden="true">${escapeHtml(monogram(f.name))}</span>
      <div class="drawer-item-body">
        <p class="drawer-item-name">${escapeHtml(f.name)}</p>
        <p class="drawer-item-cat">${escapeHtml(f.type)} · ${escapeHtml(f.use)}</p>
      </div>
      <button class="drawer-item-remove" type="button" data-id="${f.id}" aria-label="Remove ${escapeHtml(f.name)}">&times;</button>
    </div>`;
  }).join("");
  body.querySelectorAll(".drawer-item-remove").forEach((b) => b.addEventListener("click", () => toggleRequest(b.dataset.id)));
}
function renderSelectedSummary() {
  const wrap = document.querySelector("#selectedChips");
  if (!wrap) return;
  if (!requestList.length) {
    wrap.innerHTML = `<span class="selected-empty">No fabrics selected yet — add some from the catalogue above.</span>`;
  } else {
    wrap.innerHTML = requestList.map((id) => {
      const f = fabrics.find((x) => x.id === id);
      if (!f) return "";
      return `<span class="selected-chip">${escapeHtml(f.name)}<button type="button" data-id="${f.id}" aria-label="Remove ${escapeHtml(f.name)}">&times;</button></span>`;
    }).join("");
    wrap.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => toggleRequest(b.dataset.id)));
  }
  syncMessage();
}

/* ---------- Drawer open/close ---------- */
const drawer = document.querySelector("#requestDrawer");
const drawerScrim = document.querySelector("#drawerScrim");
function setDrawer(open) {
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  drawerScrim.hidden = !open;
}
document.querySelector("#openRequest").addEventListener("click", () => setDrawer(true));
document.querySelector("#drawerClose").addEventListener("click", () => setDrawer(false));
drawerScrim.addEventListener("click", () => setDrawer(false));
document.querySelector("#drawerClear").addEventListener("click", () => { requestList = []; saveRequest(); refreshRequestUI(); });
document.querySelector("#drawerSend").addEventListener("click", () => { setDrawer(false); setIntent("sample"); goToEnquiry(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

/* ---------- Enquiry ---------- */
const intentSelect = document.querySelector("#intentSelect");
const enquiryMessage = document.querySelector("#enquiryMessage");
const viewingBlock = document.querySelector("#viewingBlock");
function setIntent(value) { if (intentSelect) { intentSelect.value = value; onIntentChange(); } }
function onIntentChange() {
  if (viewingBlock) viewingBlock.hidden = intentSelect.value !== "viewing";
  syncMessage();
}
function syncMessage() {
  if (!enquiryMessage) return;
  if (enquiryMessage.dataset.touched === "true") return;
  if (!requestList.length) { enquiryMessage.value = ""; return; }
  const names = requestList.map((id) => (fabrics.find((x) => x.id === id) || {}).name).filter(Boolean);
  const verb = { sample: "Please send samples of", quote: "Please quote", viewing: "I'd like to view", general: "I'm interested in" }[intentSelect ? intentSelect.value : "sample"];
  enquiryMessage.value = `${verb}: ${names.join(", ")}.\nQuantity / format: `;
}
if (intentSelect) intentSelect.addEventListener("change", onIntentChange);
if (enquiryMessage) enquiryMessage.addEventListener("input", () => { enquiryMessage.dataset.touched = "true"; });
function goToEnquiry() {
  const t = document.querySelector("#enquiry");
  if (t) t.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
}

/* ---------- Calendar placeholder ---------- */
const SLOTS = ["10:00", "11:30", "13:00", "14:30", "16:00"];
let calView = new Date();
calView = new Date(calView.getFullYear(), calView.getMonth(), 1);
let calSelected = null;
function buildCalendar() {
  const g = document.querySelector("#calGrid");
  const monthEl = document.querySelector("#calMonth");
  if (!g || !monthEl) return;
  const year = calView.getFullYear(), month = calView.getMonth();
  monthEl.textContent = calView.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dow = ["S", "M", "T", "W", "T", "F", "S"];
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let html = dow.map((d) => `<span class="cal-dow">${d}</span>`).join("");
  for (let i = 0; i < first; i++) html += `<span></span>`;
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    const disabled = date < today || date.getDay() === 0;
    const sel = calSelected && date.toDateString() === calSelected.toDateString();
    html += `<button type="button" class="cal-day${disabled ? "" : " has-slots"}${sel ? " is-selected" : ""}" data-date="${date.toISOString()}" ${disabled ? "disabled" : ""}>${d}</button>`;
  }
  g.innerHTML = html;
  g.querySelectorAll(".cal-day[data-date]").forEach((b) => b.addEventListener("click", () => selectDay(new Date(b.dataset.date))));
}
function selectDay(date) {
  calSelected = date; buildCalendar();
  const slots = document.querySelector("#calSlots");
  slots.innerHTML = SLOTS.map((t) => `<button type="button" class="cal-slot" data-time="${t}">${t}</button>`).join("");
  slots.querySelectorAll(".cal-slot").forEach((b) => b.addEventListener("click", () => {
    slots.querySelectorAll(".cal-slot").forEach((s) => s.classList.remove("is-selected"));
    b.classList.add("is-selected");
    confirmSlot(date, b.dataset.time);
  }));
}
function confirmSlot(date, time) {
  const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  if (enquiryMessage && enquiryMessage.dataset.touched !== "true") {
    const base = enquiryMessage.value.split("\nPreferred viewing:")[0];
    enquiryMessage.value = `${base}\nPreferred viewing: ${label} at ${time}.`;
  }
}
document.querySelector("#calPrev").addEventListener("click", () => { calView.setMonth(calView.getMonth() - 1); clampCal(); buildCalendar(); });
document.querySelector("#calNext").addEventListener("click", () => { calView.setMonth(calView.getMonth() + 1); clampCal(); buildCalendar(); });
function clampCal() {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), 1);
  const max = new Date(now.getFullYear(), now.getMonth() + 2, 1);
  if (calView < min) calView = min;
  if (calView > max) calView = max;
}

/* ---------- PDF / print (no stock figures) ---------- */
function ensurePrintHeader() {
  let h = document.querySelector(".print-header");
  if (!h) { h = document.createElement("div"); h.className = "print-header"; const main = document.querySelector("main"); main.insertBefore(h, main.firstChild); }
  return h;
}
function exportPdf() {
  const list = currentList();
  const facets = [];
  if (state.types.size) facets.push([...state.types].join(", "));
  if (state.uses.size) facets.push([...state.uses].join(", "));
  if (state.query) facets.push('"' + state.query + '"');
  const when = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  ensurePrintHeader().innerHTML =
    `<div class="print-brand">Asa Fabric<small>Catalogue · ${escapeHtml(when)}</small></div>` +
    `<div class="print-meta">${escapeHtml(String(list.length))} fabrics${facets.length ? "<br>" + escapeHtml(facets.join(" · ")) : ""}<br>Quality fabrics, by the roll or the cut · Quote on request</div>`;
  document.body.classList.remove("printing-spec");
  window.print();
}
function printSpecSheet(f) {
  let sheet = document.querySelector("#specSheet");
  if (!sheet) { sheet = document.createElement("div"); sheet.id = "specSheet"; document.body.appendChild(sheet); }
  const when = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  sheet.innerHTML = `
    <div class="print-header" style="display:flex">
      <div class="print-brand">Asa Fabric<small>Fabric Spec Sheet · ${escapeHtml(when)}</small></div>
      <div class="print-meta">${escapeHtml(f.id)}<br>Quote on request</div>
    </div>
    <div class="spec-banner" data-tone="${escapeHtml(f.type)}"><span>${escapeHtml(monogram(f.name))}</span></div>
    <p class="spec-cat">${escapeHtml(f.type)} · ${escapeHtml(f.use)}</p>
    <h2>${escapeHtml(f.name)}</h2>
    <p class="spec-detail">${escapeHtml(f.detail)}</p>
    <div class="spec-rows">
      <div><span class="k">Application</span><span class="v">${escapeHtml(f.use)}</span></div>
      <div><span class="k">Width</span><span class="v">${escapeHtml(f.width)}</span></div>
      <div><span class="k">Weight</span><span class="v">${escapeHtml(gsmLabel(f.gsm))}</span></div>
      <div><span class="k">Best for</span><span class="v">${escapeHtml(f.garments.join(", "))}</span></div>
      <div><span class="k">Format</span><span class="v">By the roll or cut to length</span></div>
      <div><span class="k">Pricing</span><span class="v">Quote on request</span></div>
    </div>
    <p class="spec-foot">ASA FABRIC · Quality fabrics, by the roll or the cut · Request a sample or quote any time.</p>`;
  if (modal.open) modal.close();
  document.body.classList.add("printing-spec");
  window.print();
}
window.addEventListener("afterprint", () => document.body.classList.remove("printing-spec"));

/* ---------- Search / reset wiring ---------- */
let searchTimer = null;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.query = searchInput.value.trim(); render(); }, 120);
});
searchClear.addEventListener("click", () => { searchInput.value = ""; state.query = ""; render(); searchInput.focus(); });
clearFiltersBtn.addEventListener("click", resetFilters);
function resetFilters() {
  state.query = ""; state.types.clear(); state.uses.clear();
  searchInput.value = "";
  syncTabs("type"); syncTabs("use"); render();
}
const exportBtn = document.querySelector("#exportPdf");
if (exportBtn) exportBtn.addEventListener("click", exportPdf);

/* ---------- Quick type-links in nav / footer ---------- */
document.querySelectorAll("[data-type-link]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const v = link.dataset.typeLink;
    state.types.clear();
    if (v !== "all") state.types.add(v);
    syncTabs("type"); render();
    document.querySelector("#mobileMenu").classList.remove("open");
    document.querySelector("#catalogue").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
});

/* ============================================================
   Shared behaviours ported from the landing page (app.js)
   ============================================================ */
function revealObserve(items) {
  if (!("IntersectionObserver" in window) || !items.length) { items.forEach((el) => el.classList.add("in-view")); return; }
  const groups = new Map();
  items.forEach((el) => {
    const p = el.parentElement, idx = groups.get(p) || 0;
    if (idx) el.classList.add(`d${Math.min(idx, 3)}`);
    groups.set(p, idx + 1);
  });
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("in-view"); o.unobserve(entry.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => obs.observe(el));
}
function initScrollProgress() {
  const bar = document.querySelector("#scrollProgress");
  if (!bar) return;
  const onScroll = () => { const h = document.documentElement, max = h.scrollHeight - h.clientHeight; bar.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`; };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}
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
    menu.querySelectorAll("a:not([data-type-link])").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }
}
function initNavDock() {
  if (prefersReducedMotion) return;
  const nav = document.querySelector(".nav-links");
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll("a"));
  if (!links.length) return;
  nav.classList.add("dock");
  const MAX_SCALE = 0.22, MAX_LIFT = 6, FALLOFF = 70;
  let raf = null, pending = null;
  function apply(x) {
    links.forEach((link) => {
      const r = link.getBoundingClientRect();
      const dist = Math.abs(x - (r.left + r.width / 2));
      const t = Math.exp(-(dist * dist) / (2 * FALLOFF * FALLOFF));
      link.style.setProperty("--dock-scale", (1 + MAX_SCALE * t).toFixed(3));
      link.style.setProperty("--dock-lift", (-MAX_LIFT * t).toFixed(2) + "px");
    });
  }
  const reset = () => links.forEach((l) => { l.style.setProperty("--dock-scale", "1"); l.style.setProperty("--dock-lift", "0px"); });
  nav.addEventListener("mousemove", (e) => { pending = e.clientX; if (raf === null) raf = requestAnimationFrame(() => { raf = null; if (pending !== null) apply(pending); }); });
  nav.addEventListener("mouseleave", () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } pending = null; reset(); });
  reset();
}
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([data-type-link])').forEach((link) => {
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
function initForm() {
  const form = document.querySelector("#leadForm");
  const note = document.querySelector("#formNote");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (note) { note.hidden = false; note.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" }); }
  });
}
function initYear() { const y = document.querySelector("#year"); if (y) y.textContent = new Date().getFullYear(); }
function safe(fn, name) { try { fn(); } catch (err) { console.error("[catalogue] " + name + " failed:", err); } }

/* ---------- Boot ---------- */
buildTabs();
render();
refreshRequestUI();
(function primeCalendar() {
  const openDays = (view) => {
    const y = view.getFullYear(), m = view.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let n = 0;
    for (let d = 1; d <= days; d++) { const dt = new Date(y, m, d); if (dt >= today && dt.getDay() !== 0) n++; }
    return n;
  };
  if (openDays(calView) < 6) { calView.setMonth(calView.getMonth() + 1); clampCal(); }
})();
buildCalendar();
revealObserve(document.querySelectorAll(".cat-hero .reveal, .cat-enquiry .reveal"));
safe(initScrollProgress, "initScrollProgress");
safe(initNav, "initNav");
safe(initNavDock, "initNavDock");
safe(initSmoothScroll, "initSmoothScroll");
safe(initForm, "initForm");
safe(initYear, "initYear");
