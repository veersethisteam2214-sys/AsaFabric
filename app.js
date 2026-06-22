const useCases = [
  {
    title: "School uniforms",
    description: "TC shirting, poly cotton trousering, navy suiting, white shirt fabric, and daily-wear blends.",
    count: "6 matching lots",
    tone: "academy",
    palette: ["#0f2a44", "#f4f0e7", "#b9c6d0"]
  },
  {
    title: "Corporate wear",
    description: "Oxford shirting, wool blend suiting, office trousering, and polished staff uniform materials.",
    count: "5 matching lots",
    tone: "executive",
    palette: ["#202631", "#b08a4f", "#d8dde2"]
  },
  {
    title: "Workwear",
    description: "Poly twills, chambray, apron cloth, utility shirting, and hard-wearing operational fabrics.",
    count: "4 matching lots",
    tone: "utility",
    palette: ["#33483d", "#c1a06a", "#2a2b28"]
  },
  {
    title: "Hospitality",
    description: "Clean shirting, apron, jacket, and trouser fabric for hotels, restaurants, and service teams.",
    count: "3 matching lots",
    tone: "service",
    palette: ["#4b2034", "#f1e8db", "#8e785d"]
  },
  {
    title: "Resale deals",
    description: "Mixed dead stock, lining, pocketing, and clearance bundles for value buyers and resellers.",
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

const useGrid = document.querySelector("#useGrid");
const catalogGrid = document.querySelector("#catalogGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#fabricSearch");
let activeFilter = "all";

function weaveBackground(colors) {
  const [first, second, third] = colors;
  return `linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.18) 1px, transparent 1px), radial-gradient(circle at 26% 20%, rgba(255,255,255,0.28), transparent 28%), linear-gradient(135deg, ${first}, ${second} 48%, ${third})`;
}

function renderUseCases() {
  useGrid.innerHTML = useCases.map((item) => `
    <article class="use-card ${item.tone}">
      <span class="use-pattern" style="background-image: ${weaveBackground(item.palette)}"></span>
      <div>
        <small>${item.count}</small>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </article>
  `).join("");
}

function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = fabrics.filter((fabric) => {
    const matchesFilter = activeFilter === "all" || fabric.use === activeFilter;
    const searchable = `${fabric.name} ${fabric.material} ${fabric.use} ${fabric.status} ${fabric.width} ${fabric.gsm} ${fabric.detail} ${fabric.applications.join(" ")}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  catalogGrid.innerHTML = filtered.map((fabric) => `
    <article class="fabric-card">
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
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderCatalog();
  });
});

searchInput.addEventListener("input", renderCatalog);

renderUseCases();
renderCatalog();
