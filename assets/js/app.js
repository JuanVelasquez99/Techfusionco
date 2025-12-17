let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   INIT
========================= */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;

    updateCartCount();

    if (document.getElementById("product-grid")) {
      renderProducts(PRODUCTS);
    }

    if (document.getElementById("search")) {
      initSearch();
    }

    if (window.location.pathname.includes("product.html")) {
      loadProductDetail();
    }
  });

/* =========================
   CART COUNTER
========================= */
function updateCartCount() {
  const counter = document.getElementById("cart-count");
  if (!counter) return;
  counter.textContent = CART.length;
}

/* =========================
   HOME / GRID
========================= */
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>
          <a href="product.html?id=${p.id}">
            ${p.name}
          </a>
        </h3>
        <p class="price">$${p.price.toLocaleString("es-CO")}</p>
        <button onclick="addToCart('${p.id}')">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

/* =========================
   ADD TO CART
========================= */
function addToCart(id) {
  CART.push(id);
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
  alert("Producto agregado al carrito");
}

/* =========================
   SEARCH
========================= */
function initSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });
}

/* =========================
   CHECKOUT WHATSAPP
========================= */
function checkout() {
  let msg = "Hola, quiero comprar:%0A";
  let total = 0;

  CART.forEach(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    msg += `- ${p.name} ($${p.price})%0A`;
    total += p.price;
  });

  msg += `%0ATotal: $${total.toLocaleString("es-CO")}`;
  window.location.href = `https://wa.me/57TU_NUMERO?text=${msg}`;
}

/* =========================
   PRODUCT DETAIL
========================= */
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.name;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-description").textContent = product.description;
  document.getElementById("product-price").textContent =
    "$" + product.price.toLocaleString("es-CO");

  document
    .getElementById("add-to-cart-btn")
    .addEventListener("click", () => addToCart(product.id));

  document.getElementById("whatsapp-link").href =
    `https://wa.me/57TU_NUMERO?text=Hola,%20quiero%20información%20del%20producto:%20${product.name}`;
}
