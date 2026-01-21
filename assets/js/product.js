const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

const product = products.find(p => p.id === productId);
const container = document.getElementById("product-page");

if (!container) {
  console.error("No existe el contenedor product-page");
}

if (!product) {
  container.innerHTML = "<p>Producto no encontrado</p>";
} else {
  container.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">$${product.price.toLocaleString("es-CO")}</p>
      <p>${product.description}</p>

      <div class="qty-controls">
        <button id="minus">-</button>
        <input type="number" id="qty" value="1" min="1">
        <button id="plus">+</button>
      </div>

      <button id="add-to-cart">Agregar al carrito</button>
    </div>
  `;

  const qtyInput = document.getElementById("qty");

  document.getElementById("minus").addEventListener("click", () => {
    if (qtyInput.value > 1) qtyInput.value--;
  });

  document.getElementById("plus").addEventListener("click", () => {
    qtyInput.value++;
  });

  document.getElementById("add-to-cart").addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }

localStorage.setItem("cart", JSON.stringify(cart));

if (typeof updateCartCount === "function") {
  updateCartCount();
}
const cartBtn = document.getElementById("cart-btn");

if (cartBtn) {
  cartBtn.classList.add("cart-bounce");
  setTimeout(() => {
    cartBtn.classList.remove("cart-bounce");
  }, 400);
}
alert("Producto agregado al carrito");
  });
}
