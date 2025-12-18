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
    const card = document.createElement("div");
    card.className = "product-card fade-slide";

    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>$${p.price.toLocaleString("es-CO")}</p>
      <button onclick="addToCart('${p.id}')">
        Agregar al carrito
      </button>
    `;

    grid.appendChild(card);
  });
}

function addToCart(id) {
  const item = CART.find(p => p.id === id);
  if (item) item.qty++;
  else CART.push({ id, qty: 1 });
  saveCart();
}

/* =============================
   CARRITO REACTIVO + ANIMADO
============================= */
function renderCart() {
  const cont = document.getElementById("cart-items");
  if (!cont) return;

  cont.innerHTML = "";
  let subtotal = 0;

  CART.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;

    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.className = "cart-item fade-slide";
    row.dataset.id = item.id;

    row.innerHTML = `
      <img src="${p.image}">
      <div class="cart-item-info">
        <h4>${p.name}</h4>

        <p class="unit-price">
          Precio unitario:
          <strong>$${p.price.toLocaleString("es-CO")}</strong>
        </p>

        <div class="qty-controls">
          <button onclick="changeQty('${p.id}', -1)">−</button>
          <input type="number" min="1" value="${item.qty}"
            oninput="updateQty('${p.id}', this.value)">
          <button onclick="changeQty('${p.id}', 1)">+</button>
        </div>

        <p class="item-total">
          Subtotal:
          <strong>$${itemTotal.toLocaleString("es-CO")}</strong>
        </p>
      </div>

      <button class="remove-item"
        onclick="removeItemAnimated('${p.id}')">🗑️</button>
    `;

    cont.appendChild(row);
  });

  updateTotals(subtotal);
}

function changeQty(id, delta) {
  const item = CART.find(p => p.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
}

function updateQty(id, value) {
  const qty = parseInt(value);
  if (!qty || qty < 1) return;
  const item = CART.find(p => p.id === id);
  if (!item) return;
  item.qty = qty;
  saveCart();
}

function removeItemAnimated(id) {
  const el = document.querySelector(`.cart-item[data-id="${id}"]`);
  if (!el) return;

  el.classList.add("removing");

  setTimeout(() => {
    CART = CART.filter(p => p.id !== id);
    saveCart();
  }, 200);
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
  document.getElementById("subtotal").textContent =
    "$" + subtotal.toLocaleString("es-CO");
  document.getElementById("iva").textContent =
    "$" + iva.toLocaleString("es-CO");
  document.getElementById("total").textContent =
    "$" + (subtotal + iva).toLocaleString("es-CO");
}

/* =============================
   CONTADOR
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
    renderProducts(PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  });
}

/* =============================
   CHECKOUT
============================= */
function checkout() {
  let msg = "Hola, quiero comprar:%0A";
  CART.forEach(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    msg += `- ${p.name} | ${i.qty} x $${p.price}%0A`;
  });
  window.location.href = `https://wa.me/57TU_NUMERO?text=${msg}`;
}
/* =============================
   MINI CART
============================= */

function toggleMiniCart() {
  const mini = document.getElementById("mini-cart");
  if (!mini) return;
  mini.classList.toggle("active");
  renderMiniCart();
}

function renderMiniCart() {
  const cont = document.getElementById("mini-cart-items");
  if (!cont) return;

  cont.innerHTML = "";

  if (CART.length === 0) {
    cont.innerHTML = "<p>Tu carrito está vacío</p>";
    return;
  }

  CART.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;

    const div = document.createElement("div");
    div.className = "mini-cart-item";

    div.innerHTML = `
      <img src="${p.image}">
      <div class="mini-cart-item-info">
        <p><strong>${p.name}</strong></p>
        <p>${item.qty} × $${p.price.toLocaleString("es-CO")}</p>
      </div>
      <button onclick="removeItemAnimated('${p.id}')">🗑️</button>
    `;

    cont.appendChild(div);
  });
}

/* Cierra mini cart al hacer click fuera */
document.addEventListener("click", e => {
  const cart = document.querySelector(".cart-wrapper");
  const mini = document.getElementById("mini-cart");
  if (!cart || !mini) return;
  if (!cart.contains(e.target)) mini.classList.remove("active");
});
/* =============================
   MINI CART TOGGLE
============================= */

function toggleMiniCart() {
  const mini = document.getElementById("mini-cart");
  if (!mini) {
    console.warn("Mini cart no encontrado");
    return;
  }
  mini.classList.toggle("active");
  renderMiniCart();
}
