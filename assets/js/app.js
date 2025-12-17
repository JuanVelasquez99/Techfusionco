let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    renderProducts(PRODUCTS);
  });

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price.toLocaleString("es-CO")}</p>
        <button onclick="addToCart('${p.id}')">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

function addToCart(id) {
  CART.push(id);
  localStorage.setItem("cart", JSON.stringify(CART));
  alert("Producto agregado al carrito");
}

/* 🔍 Buscador */
document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

function checkout() {
  fetch("data/products.json")
    .then(r => r.json())
    .then(products => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      let msg = "Hola, quiero comprar:%0A";
      let total = 0;

      cart.forEach(id => {
        const p = products.find(x => x.id === id);
        msg += `- ${p.name} ($${p.price})%0A`;
        total += p.price;
      });

      msg += `%0ATotal: $${total}`;
      window.location.href = `https://wa.me/57TU_NUMERO?text=${msg}`;
    });
}
/* PRODUCT DETAIL PAGE */
if (window.location.pathname.includes("product.html")) {

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      document.getElementById("product-image").src = product.image;
      document.getElementById("product-image").alt = product.name;
      document.getElementById("product-name").textContent = product.name;
      document.getElementById("product-description").textContent = product.description;
      document.getElementById("product-price").textContent =
        "$" + product.price.toLocaleString("es-CO");

      document.getElementById("add-to-cart-btn")
        .addEventListener("click", () => {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart.push(product.id);
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Producto agregado al carrito");
        });

      document.getElementById("whatsapp-link").href =
        `https://wa.me/57TU_NUMERO?text=Hola,%20quiero%20información%20del%20producto:%20${product.name}`;
    });
}

