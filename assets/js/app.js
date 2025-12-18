let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart")) || [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    renderProducts(PRODUCTS);
    updateCartCount();
  });

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>$${p.price.toLocaleString("es-CO")}</p>
        <button onclick="addToCart('${p.id}')">
          Agregar al carrito
        </button>
      </div>
    `;
  });
}

function addToCart(id) {
  const item = CART.find(p => p.id === id);

  if (item) item.qty++;
  else CART.push({ id, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
}

function updateCartCount() {
  const total = CART.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

/* BUSCADOR */
const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    renderProducts(PRODUCTS.filter(p => p.name.toLowerCase().includes(v)));
  });
}

/* PRODUCT DETAIL */
if (location.pathname.includes("product.html")) {
  const id = new URLSearchParams(location.search).get("id");

  fetch("data/products.json")
    .then(r => r.json())
    .then(p => {
      const prod = p.find(x => x.id === id);
      if (!prod) return;

      document.getElementById("product-image").src = prod.image;
      document.getElementById("product-name").textContent = prod.name;
      document.getElementById("product-description").textContent = prod.description;
      document.getElementById("product-price").textContent =
        "$" + prod.price.toLocaleString("es-CO");

      document.getElementById("add-to-cart-btn").onclick =
        () => addToCart(prod.id);
    });
}

/* CART PAGE */
if (document.getElementById("cart-items")) {
  fetch("data/products.json")
    .then(r => r.json())
    .then(products => {
      const cont = document.getElementById("cart-items");
      let subtotal = 0;

      cont.innerHTML = "";

      CART.forEach(item => {
        const p = products.find(x => x.id === item.id);
        if (!p) return;

        const total = p.price * item.qty;
        subtotal += total;

        cont.innerHTML += `
          <div class="cart-item">
            <img src="${p.image}">
            <div>
              <h4>${p.name}</h4>
              <div class="qty-controls">
                <button onclick="changeQty('${p.id}',-1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty('${p.id}',1)">+</button>
              </div>
              <strong>$${total.toLocaleString("es-CO")}</strong>
            </div>
          </div>
        `;
      });

      const iva = subtotal * .19;
      document.getElementById("subtotal").textContent =
        "$" + subtotal.toLocaleString("es-CO");
      document.getElementById("iva").textContent =
        "$" + iva.toLocaleString("es-CO");
      document.getElementById("total").textContent =
        "$" + (subtotal + iva).toLocaleString("es-CO");
    });
}

function changeQty(id, d) {
  const item = CART.find(p => p.id === id);
  if (!item) return;

  item.qty += d;
  if (item.qty <= 0)
    CART = CART.filter(p => p.id !== id);

  localStorage.setItem("cart", JSON.stringify(CART));
  location.reload();
}

function checkout() {
  let msg = "Hola, quiero comprar:%0A";
  CART.forEach(i => msg += `- ${i.id} x${i.qty}%0A`);
  window.location.href = `https://wa.me/57TU_NUMERO?text=${msg}`;
}
