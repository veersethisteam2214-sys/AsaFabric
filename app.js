const useCases = [
  {
    title: "School uniforms",
    description: "Durable TC, poly cotton, and suiting fabrics for shirts, skirts, trousers, and daily uniforms.",
    count: "6 matching lots",
    palette: ["#25364a", "#f2f0e8", "#728392"]
  },
  {
    title: "Corporate wear",
    description: "Clean shirting, trouser, and blazer-friendly stock for office uniforms and staff programs.",
    count: "5 matching lots",
    palette: ["#4b5968", "#c7aa74", "#eee6da"]
  },
  {
    title: "Workwear",
    description: "Hard-wearing twills and blends for factory uniforms, aprons, operational wear, and field teams.",
    count: "4 matching lots",
    palette: ["#536b55", "#d2b06f", "#34312e"]
  },
  {
    title: "Resale deals",
    description: "Value-focused dead stock lots for resellers, small shops, export buyers, and clearance bundles.",
    count: "8 matching lots",
    palette: ["#9c5d44", "#5a4057", "#f4ead9"]
  }
];

const fabrics = [
  {
    name: "TC Uniform Shirting",
    material: "TC blend",
    use: "School uniforms",
    color: "White / Sky / Navy",
    width: "58 in",
    gsm: "120-145 GSM",
    roll: "THB 2,450 / roll",
    cut: "THB 78 / meter",
    detail: "Crisp everyday uniform fabric with easy-care structure and steady shade options.",
    colors: ["#f8f5ee", "#9fb7ca", "#24384f"]
  },
  {
    name: "Poly Cotton Trousering",
    material: "Poly cotton",
    use: "School uniforms",
    color: "Charcoal / Khaki",
    width: "60 in",
    gsm: "185-220 GSM",
    roll: "THB 3,900 / roll",
    cut: "THB 118 / meter",
    detail: "Reliable trouser and skirt fabric for school, office, and high-volume tailoring orders.",
    colors: ["#3f4242", "#b4a27a", "#e8dfd0"]
  },
  {
    name: "Chambray Work Shirt",
    material: "Chambray",
    use: "Workwear",
    color: "Blue chambray",
    width: "57 in",
    gsm: "150 GSM",
    roll: "THB 2,980 / roll",
    cut: "THB 92 / meter",
    detail: "Lightweight woven texture for utility shirts, shop uniforms, and casual workwear.",
    colors: ["#7891a3", "#d8e0e3", "#39566b"]
  },
  {
    name: "Wool Blend Suiting",
    material: "Wool blend",
    use: "Corporate wear",
    color: "Graphite / Midnight",
    width: "60 in",
    gsm: "260 GSM",
    roll: "THB 6,800 / roll",
    cut: "THB 215 / meter",
    detail: "Premium suiting handfeel for tailored trousers, jackets, blazers, and front-office uniforms.",
    colors: ["#2d3036", "#202a38", "#86785f"]
  },
  {
    name: "TC Pocketing and Lining",
    material: "TC blend",
    use: "Resale deals",
    color: "Natural / Black",
    width: "44 in",
    gsm: "90 GSM",
    roll: "THB 1,750 / roll",
    cut: "THB 52 / meter",
    detail: "Cost-efficient support fabric for linings, pockets, sampling, and bundle offers.",
    colors: ["#efe4d2", "#1d1c1a", "#b88a44"]
  },
  {
    name: "Poly Twill Utility Cloth",
    material: "Poly twill",
    use: "Workwear",
    color: "Olive / Sand",
    width: "60 in",
    gsm: "235 GSM",
    roll: "THB 4,250 / roll",
    cut: "THB 132 / meter",
    detail: "Structured twill for aprons, factory trousers, operational uniforms, and durable sets.",
    colors: ["#59684d", "#c6af80", "#303329"]
  },
  {
    name: "Oxford Uniform Shirting",
    material: "Cotton blend",
    use: "Corporate wear",
    color: "White / Pale blue",
    width: "58 in",
    gsm: "160 GSM",
    roll: "THB 3,350 / roll",
    cut: "THB 105 / meter",
    detail: "Textured shirting with a polished business look for staff uniforms and office shirts.",
    colors: ["#faf7ef", "#c3d6df", "#6b8390"]
  },
  {
    name: "Mixed Clearance Lot",
    material: "Assorted",
    use: "Resale deals",
    color: "Multi shade",
    width: "44-60 in",
    gsm: "Varies",
    roll: "Ask for lot price",
    cut: "Limited cuts",
    detail: "Dead stock selection positioned for fast-moving value buyers and bundle negotiations.",
    colors: ["#9c5d44", "#25364a", "#536b55"]
  }
];

const useGrid = document.querySelector("#useGrid");
const catalogGrid = document.querySelector("#catalogGrid");
const filterButtons = document.querySelectorAll(".filter-chip");
const searchInput = document.querySelector("#fabricSearch");
let activeFilter = "all";

function weaveBackground(colors) {
  const [first, second, third] = colors;
  return `linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(135deg, ${first}, ${second} 48%, ${third})`;
}

function renderUseCases() {
  useGrid.innerHTML = useCases.map((item) => `
    <article class="use-card">
      <div>
        <span class="use-pattern" style="background-image: ${weaveBackground(item.palette)}"></span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <small>${item.count}</small>
    </article>
  `).join("");
}

function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = fabrics.filter((fabric) => {
    const matchesFilter = activeFilter === "all" || fabric.use === activeFilter;
    const searchable = `${fabric.name} ${fabric.material} ${fabric.use} ${fabric.color} ${fabric.detail}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });

  catalogGrid.innerHTML = filtered.map((fabric) => `
    <article class="fabric-card">
      <div class="fabric-visual" style="background-image: ${weaveBackground(fabric.colors)}"></div>
      <div class="fabric-body">
        <div class="fabric-meta">
          <span>${fabric.material}</span>
          <span>${fabric.use}</span>
          <span>${fabric.gsm}</span>
        </div>
        <h3>${fabric.name}</h3>
        <p>${fabric.detail}</p>
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
