const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

const product = products.find(p => p.id === productId);

const container = document.getElementById("product-page");

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

  // CONTROLES DE CANTIDAD
  const qtyInput = document.getElementById("qty");

  document.getElementById("minus").onclick = () => {
    if (qtyInput.value > 1) qtyInput.value--;
  };

  document.getElementById("plus").onclick = () => {
    qtyInput.value++;
  };

  // AGREGAR AL CARRITO
document.getElementById("add-to-cart").onclick = () => {
  const qty = parseInt(qtyInput.value);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      ...product,
      qty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
};

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
  };
}
