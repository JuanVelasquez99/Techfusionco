let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

/* Cargar productos */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    renderCart();
  });

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  if (CART.length === 0) {
    container.innerHTML = "<p>El carrito está vacío</p>";
    totalEl.textContent = "$0";
    return;
  }

  CART.forEach((id, index) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    total += product.price;

    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${product.name}</strong></p>
      <p>$${product.price.toLocaleString("es-CO")}</p>
      <button onclick="removeFromCart(${index})">Eliminar</button>
      <hr>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = "$" + total.toLocaleString("es-CO");
}

function removeFromCart(index) {
  CART.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(CART));
  renderCart();
}

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
