let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

/* 🔥 Cargar productos */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    updateCartCount();
    renderMiniCart();
  });

/* 💾 Guardar */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(CART));
}

/* 🔢 CONTADOR */
function updateCartCount() {
  const count = CART.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

/* ➕ AGREGAR */
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

/* 👁 TOGGLE MINI CART */
function toggleMiniCart() {
  const miniCart = document.getElementById("mini-cart");
  miniCart.classList.toggle("hidden");
  miniCart.classList.toggle("show");
}

/* ➕➖ CAMBIAR CANTIDAD */
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

/* 🧩 RENDER MINI CART */
function renderMiniCart() {
  const container = document.getElementById("mini-cart-items");
  const totalEl = document.getElementById("mini-cart-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  CART.forEach(({ id, qty }) => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    const lineTotal = p.price * qty;
    total += lineTotal;

    container.innerHTML += `
      <div class="mini-cart-item">
        <img src="${p.image}">
        <div class="mini-cart-item-info">
          <p>${p.name}</p>
          <span>$${p.price.toLocaleString("es-CO")}</span>

          <div class="qty-controls">
            <button onclick="changeQty('${id}', -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeQty('${id}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  totalEl.textContent = "$" + total.toLocaleString("es-CO");
}
