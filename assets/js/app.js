let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   CARGAR PRODUCTOS
============================= */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    updateCartCount();
    renderMiniCart();
  });

/* =============================
   UTILIDADES
============================= */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(CART));
}

function updateCartCount() {
  const count = CART.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

/* =============================
   AGREGAR PRODUCTO
============================= */
function addToCart(id) {
  const item = CART.find(p => p.id === id);

  if (item) {
    item.qty++;
  } else {
    CART.push({ id, qty: 1 });
  }

  saveCart();
  updateCartCount();
  renderMiniCart();
}

/* =============================
   CAMBIAR CANTIDAD
============================= */
function changeQty(id, delta) {
  const item = CART.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    CART = CART.filter(p => p.id !== id);
  }

  saveCart();
  updateCartCount();
  renderMiniCart();
}

/* =============================
   TOGGLE MINI CART
============================= */
function toggleMiniCart() {
  const miniCart = document.getElementById("mini-cart");
  miniCart.classList.toggle("hidden");
  miniCart.classList.toggle("show");
}

/* =============================
   RENDER MINI CART (PASO 3)
============================= */
function renderMiniCart() {
  const container = document.getElementById("mini-cart-items");
  const totalEl = document.getElementById("mini-cart-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  CART.forEach(({ id, qty }) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const subtotal = p.price * qty;
    total += subtotal;

    container.innerHTML += `
      <div class="mini-cart-item">
        <img src="${p.image}" alt="${p.name}">

        <div class="mini-cart-item-info">
          <p class="mini-cart-title">${p.name}</p>

          <p class="mini-cart-unit">
            $${p.price.toLocaleString("es-CO")} c/u
          </p>

          <div class="qty-controls">
            <button onclick="changeQty('${id}', -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty('${id}', 1)">+</button>
          </div>

          <p class="mini-cart-subtotal">
            Subtotal: $${subtotal.toLocaleString("es-CO")}
          </p>
        </div>
      </div>
    `;
  });

  totalEl.textContent = "$" + total.toLocaleString("es-CO");
}
