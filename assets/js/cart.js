const cartItemsContainer = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// RENDER CARRITO
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartSummary.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    cartItemsContainer.innerHTML += `
      <div class="cart-item fade-slide">
        <img src="${item.image}" alt="${item.name}">

        <div style="flex:1">
          <h4>${item.name}</h4>
          <p>$${item.price.toLocaleString("es-CO")}</p>

          <div class="qty-controls">
            <button onclick="changeQty(${index}, -1)">-</button>
            <input type="number" value="${item.qty}" min="1" readonly>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
      </div>
    `;
  });

  renderSummary();
}

// CAMBIAR CANTIDAD
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart();
}

// ELIMINAR ITEM
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// TOTAL
function renderSummary() {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  cartSummary.innerHTML = `
    <h3>Total</h3>
    <p class="total">$${total.toLocaleString("es-CO")}</p>
    <button onclick="checkout()">Finalizar compra</button>
  `;
}

// CHECKOUT (placeholder)
function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let message = "Hola 👋, quiero hacer un pedido en TechFusion:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    message += `• ${item.name}%0A`;
    message += `  Cantidad: ${item.qty}%0A`;
    message += `  Precio: $${item.price.toLocaleString("es-CO")}%0A%0A`;
  });

  message += `Total: $${total.toLocaleString("es-CO")}%0A%0A`;
  message += "Quedo atento(a) para finalizar la compra ✅";

  const phone = "573237960343"; // <-- CAMBIA ESTE NÚMERO
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
}


// GUARDAR
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// INIT
renderCart();
