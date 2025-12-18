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

/* 🛒 CONTADOR */
function updateCartCount() {
  document.getElementById("cart-count").textContent = CART.length;
}

/* ➕ AGREGAR */
function addToCart(id) {
  CART.push(id);
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
  renderMiniCart();
}

/* 👁 MINI CART TOGGLE */
function toggleMiniCart() {
  const miniCart = document.getElementById("mini-cart");
  miniCart.classList.toggle("hidden");
  miniCart.classList.toggle("show");
}

/* 🧩 RENDER MINI CART */
function renderMiniCart() {
  const container = document.getElementById("mini-cart-items");
  const totalEl = document.getElementById("mini-cart-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  CART.forEach(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;

    total += p.price;

    container.innerHTML += `
      <div class="mini-cart-item">
        <img src="${p.image}">
        <div class="mini-cart-item-info">
          <p>${p.name}</p>
          <span>$${p.price.toLocaleString("es-CO")}</span>
        </div>
      </div>
    `;
  });

  totalEl.textContent = "$" + total.toLocaleString("es-CO");
}
