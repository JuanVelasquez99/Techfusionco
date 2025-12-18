let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   CARGA PRODUCTOS
============================= */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    renderProducts(PRODUCTS);
    updateCartCount();
    renderCart();
  });

/* =============================
   HOME
============================= */
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price.toLocaleString("es-CO")}</p>
        <button onclick="addToCart('${p.id}')">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

function addToCart(id) {
  const item = CART.find(p => p.id === id);

  if (item) item.qty++;
  else CART.push({ id, qty: 1 });

  saveCart();
}

/* =============================
   CARRITO REACTIVO
============================= */
function renderCart() {
  const cont = document.getElementById("cart-items");
  if (!cont) return;

  cont.innerHTML = "";
  let subtotal = 0;

  CART.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;

    const unitPrice = p.price;
    const itemTotal = unitPrice * item.qty;
    subtotal += itemTotal;

    cont.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}">

        <div class="cart-item-info">
          <h4>${p.name}</h4>

          <p class="unit-price">
            Precio unitario:
            <strong>$${unitPrice.toLocaleString("es-CO")}</strong>
          </p>

          <div class="qty-controls">
            <button onclick="changeQty('${p.id}', -1)">−</button>

            <input
              type="number"
              min="1"
              value="${item.qty}"
              oninput="updateQty('${p.id}', this.value)"
            >

            <button onclick="changeQty('${p.id}', 1)">+</button>
          </div>

          <p class="item-total">
            Subtotal producto:
            <strong>$${itemTotal.toLocaleString("es-CO")}</strong>
          </p>
        </div>

        <button
          class="remove-item"
          onclick="removeItem('${p.id}')"
          aria-label="Eliminar producto">
          🗑️
        </button>
      </div>
    `;
  });

  updateTotals(subtotal);
}

function changeQty(id, delta) {
  const item = CART.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty < 1) item.qty = 1;

  saveCart();
}

function updateQty(id, value) {
  const qty = parseInt(value, 10);
  if (isNaN(qty) || qty < 1) return;

  const item = CART.find(p => p.id === id);
  if (!item) return;

  item.qty = qty;
  saveCart();
}

function removeItem(id) {
  CART = CART.filter(p => p.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
  renderCart();
}

/* =============================
   TOTALES
============================= */
function updateTotals(subtotal) {
  const iva = subtotal * 0.19;

  const s = document.getElementById("subtotal");
  const i = document.getElementById("iva");
  const t = document.getElementById("total");

  if (!s || !i || !t) return;

  s.textContent = "$" + subtotal.toLocaleString("es-CO");
  i.textContent = "$" + iva.toLocaleString("es-CO");
  t.textContent = "$" + (subtotal + iva).toLocaleString("es-CO");
}

/* =============================
   CONTADOR HEADER
============================= */
function updateCartCount() {
  const total = CART.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

/* =============================
   BUSCADOR
============================= */
const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    renderProducts(PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(v)
    ));
  });
}

/* =============================
   PRODUCT DETAIL
============================= */
if (location.pathname.includes("product.html")) {
  const id = new URLSearchParams(location.search).get("id");

  fetch("data/products.json")
    .then(r => r.json())
    .then(p => {
      const prod = p.find(x => x.id === id);
      if (!prod) return;

      document.getElementById("product-image").src = prod.image;
      document.getElementById("product-name").textContent = prod.name;
      document.getElementById("product-description").textContent = prod.description;
      document.getElementById("product-price").textContent =
        "$" + prod.price.toLocaleString("es-CO");

      document.getElementById("add-to-cart-btn").onclick =
        () => addToCart(prod.id);
    });
}

/* =============================
   CHECKOUT WHATSAPP
============================= */
function checkout() {
  let msg = "Hola, quiero comprar:%0A";

  CART.forEach(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    if (!p) return;
    msg += `- ${p.name} | ${i.qty} x $${p.price.toLocaleString("es-CO")}%0A`;
  });

  window.location.href =
    `https://wa.me/57TU_NUMERO?text=${msg}`;
}
