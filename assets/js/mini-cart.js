const cartBtn = document.getElementById("cart-btn");
const miniCart = document.getElementById("mini-cart");
const cartCount = document.getElementById("cart-count");

// ABRIR / CERRAR
cartBtn.onclick = () => {
  miniCart.classList.toggle("show");
  miniCart.classList.toggle("hidden");
  renderMiniCart();
};

// CANTIDAD TOTAL
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;
}

// RENDER MINI CART
function renderMiniCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    miniCart.innerHTML = "<p>Tu carrito está vacío</p>";
    return;
  }

  let subtotal = 0;

  miniCart.innerHTML = `
  <h4>Carrito</h4>
  ${cart.map((item, index) => {
    subtotal += item.price * item.qty;
    return `
      <div class="mini-cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="mini-cart-item-info">
          <p class="mini-cart-title">${item.name}</p>

          <div class="qty-controls">
            <button onclick="changeMiniQty(${index}, -1)">−</button>
            <input type="number" value="${item.qty}" readonly>
            <button onclick="changeMiniQty(${index}, 1)">+</button>
          </div>

          <span>$${(item.price * item.qty).toLocaleString("es-CO")}</span>
        </div>

        <button class="remove-btn" onclick="removeMiniItem(${index})">✕</button>
      </div>
    `;
  }).join("")

  <div class="mini-cart-footer">
    <p><strong>Subtotal:</strong> $${subtotal.toLocaleString("es-CO")}</p>
    <a href="cart.html" class="btn-primary">Ver carrito</a>
  </div>
`;

    <div class="mini-cart-footer">
      <p><strong>Subtotal:</strong> $${subtotal.toLocaleString("es-CO")}</p>
      <a href="cart.html" class="btn-primary">Ver carrito</a>
    </div>
  `;
}

// ELIMINAR
function removeMiniItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderMiniCart();
  updateCartCount();
}

function changeMiniQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].qty += delta;

  if (cart[index].qty < 1) {
    cart[index].qty = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderMiniCart();
  updateCartCount();
}

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}
// INIT
updateCartCount();
