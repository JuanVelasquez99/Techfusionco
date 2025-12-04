/* TechFusion v2 - app.js
 - Carga productos desde data/products.json
 - Filtros avanzados, orden, rango de precio
 - Carrito avanzado: add, remove, qty, persist (localStorage)
 - Checkout: WhatsApp + placeholders para Wompi/Nequi/Bold/Daviplata
*/

const CONFIG = {
  WHATSAPP_NUMBER: "573237960343",
  WOMPI_CHECKOUT_URL: "",    // si tienes URL directa al checkout de Wompi ponla aquí
  BOLD_CHECKOUT_URL: "",     // si Bold te da checkout URL
  NEQUI_PHONE: "",           // número o referencia para pagos Nequi (ej: 320XXXXXXX)
  DAVIPLATA_PHONE: ""        // número o referencia para Daviplata
};

let PRODUCTS = [];
let CART = loadCart();

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then(r => r.json())
    .then(data => {
      PRODUCTS = data;
      renderProducts(PRODUCTS);
      setupControls();
      updateCartUI();
      if (isProductPage()) loadProductDetail();
      if (isCartPage()) renderCartPage();
    })
    .catch(err => console.error("Error cargando productos:", err));
});

/* ------- UI helpers ------- */

function el(q){return document.querySelector(q);}
function isProductPage(){return window.location.pathname.includes("product.html");}
function isCartPage(){return window.location.pathname.includes("cart.html");}

/* ------- Productos ------- */

function renderProducts(list){
  const grid = el("#productGrid");
  if(!grid) return;
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="assets/img/${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">$${formatNumber(p.price)}</p>
      <p class="muted">${p.category}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn" data-id="${p.id}" onclick="addToCart(${p.id})">Agregar</button>
        <a class="btn ghost" href="product.html?id=${p.id}">Detalle</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ------- Controles y filtros ------- */

function setupControls(){
  const search = el("#searchInput");
  const cat = el("#categoryFilter");
  const sort = el("#sortSelect");
  const min = el("#minPrice");
  const max = el("#maxPrice");
  const priceBtn = el("#priceFilterBtn");
  const clear = el("#clearFilters");

  if (search) search.addEventListener("input", () => applyFilters());
  if (cat) cat.addEventListener("change", () => applyFilters());
  if (sort) sort.addEventListener("change", () => applyFilters());
  if (priceBtn) priceBtn.addEventListener("click", () => applyFilters());
  if (clear) clear.addEventListener("click", () => {
    search.value = ""; cat.value = "all"; min.value=""; max.value=""; sort.value="default"; applyFilters();
  });

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.addEventListener("click", () => location.href="cart.html");

  const themeToggle = document.getElementById("themeToggle");
  if(themeToggle){
    themeToggle.addEventListener("click", toggleTheme);
    applySavedTheme();
  }
}

function applyFilters(){
  const q = el("#searchInput")?.value.toLowerCase() || "";
  const cat = el("#categoryFilter")?.value || "all";
  const sort = el("#sortSelect")?.value || "default";
  const min = Number(el("#minPrice")?.value || 0);
  const max = Number(el("#maxPrice")?.value || 0);

  let filtered = PRODUCTS.filter(p => {
    const matchesQ = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCat = cat === "all" || p.category === cat;
    const matchesMin = !min || p.price >= min;
    const matchesMax = !max || p.price <= max;
    return matchesQ && matchesCat && matchesMin && matchesMax;
  });

  if(sort === "price-asc") filtered.sort((a,b)=>a.price-b.price);
  if(sort === "price-desc") filtered.sort((a,b)=>b.price-a.price);

  renderProducts(filtered);
}

/* ------- Carrito avanzado ------- */

function loadCart(){
  try {
    const raw = localStorage.getItem("tf_cart_v2");
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.error("Error cargando carrito:", e);
    return [];
  }
}
function saveCart(){
  localStorage.setItem("tf_cart_v2", JSON.stringify(CART));
  updateCartUI();
}
function updateCartUI(){
  const count = CART.reduce((s,i)=>s+i.qty,0);
  const elCount = document.getElementById("cartCount");
  if(elCount) elCount.textContent = count;
}

function addToCart(id){
  const prod = PRODUCTS.find(p=>p.id==id);
  if(!prod) return alert("Producto no encontrado");
  const exists = CART.find(i=>i.id==id);
  if(exists) exists.qty++;
  else CART.push({id: prod.id, name: prod.name, price: prod.price, image: prod.image, qty: 1});
  saveCart();
  alert(`${prod.name} agregado al carrito`);
}

function changeQty(id, delta){
  const item = CART.find(i=>i.id==id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else saveCart();
  if(isCartPage()) renderCartPage();
}

function removeFromCart(id){
  CART = CART.filter(i=>i.id != id);
  saveCart();
  if(isCartPage()) renderCartPage();
}

function clearCart(){
  if(!confirm("¿Vaciar todo el carrito?")) return;
  CART = [];
  saveCart();
  if(isCartPage()) renderCartPage();
}

/* ------- Carrito UI (cart.html) ------- */

function renderCartPage(){
  const container = document.getElementById("cartItems");
  if(!container) return;
  container.innerHTML = "";
  if(CART.length === 0) container.innerHTML = "<p>Tu carrito está vacío.</p>";
  CART.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="assets/img/${item.image}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong>
        <p class="muted">$${formatNumber(item.price)}</p>
        <div class="qty-controls">
          <button class="btn small" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="btn small" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="btn ghost small" onclick="removeFromCart(${item.id})">Eliminar</button>
        </div>
      </div>
      <div style="min-width:90px;text-align:right">
        <p>$${formatNumber(item.price * item.qty)}</p>
      </div>
    `;
    container.appendChild(div);
  });

  // resumen
  const subtotal = CART.reduce((s,i)=>s + (i.price * i.qty), 0);
  const tax = Math.round(subtotal * 0.19); // IVA 19% (ajustable)
  const total = subtotal + tax;

  el("#subtotal").textContent = `$${formatNumber(subtotal)}`;
  el("#taxes").textContent = `$${formatNumber(tax)}`;
  el("#total").textContent = `$${formatNumber(total)}`;

  // botones y acciones
  document.getElementById("whatsappCheckout").href = createWhatsAppCheckoutMessage(subtotal, tax, total);

  document.getElementById("wompiBtn").onclick = () => {
    if(CONFIG.WOMPI_CHECKOUT_URL){
      window.open(CONFIG.WOMPI_CHECKOUT_URL, "_blank");
    } else {
      alert("Aún no hay URL de Wompi configurada. Usa WhatsApp o configura WOMPI_CHECKOUT_URL en app.js");
    }
  };

  document.getElementById("boldBtn").onclick = () => {
    if(CONFIG.BOLD_CHECKOUT_URL){
      window.open(CONFIG.BOLD_CHECKOUT_URL, "_blank");
    } else {
      alert("Aún no hay URL de Bold configurada. Usa WhatsApp o configura BOLD_CHECKOUT_URL en app.js");
    }
  };

  document.getElementById("nequiBtn").onclick = () => {
    if(CONFIG.NEQUI_PHONE){
      const msg = encodeURIComponent(`Hola, quiero pagar con Nequi. Mi pedido: ${cartSummaryText()}`);
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    } else {
      alert("Configura NEQUI_PHONE en app.js con el número o referencia.");
    }
  };

  document.getElementById("daviplataBtn").onclick = () => {
    if(CONFIG.DAVIPLATA_PHONE){
      const msg = encodeURIComponent(`Hola, quiero pagar con Daviplata. Mi pedido: ${cartSummaryText()}`);
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    } else {
      alert("Configura DAVIPLATA_PHONE en app.js con el número o referencia.");
    }
  };

  document.getElementById("clearCart").onclick = clearCart;
}

/* ------- Detalle de producto ------- */

function loadProductDetail(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = PRODUCTS.find(x => x.id == id);
  const container = el("#productDetail");
  if(!container) return;
  if(!p) { container.innerHTML = "<p>Producto no encontrado.</p>"; return; }

  container.innerHTML = `
    <img src="assets/img/${p.image}" alt="${p.name}">
    <div class="info">
      <h2>${p.name}</h2>
      <p class="price">$${formatNumber(p.price)}</p>
      <p>${p.description}</p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn" onclick="addToCart(${p.id})">Agregar al carrito</button>
        <a class="btn ghost" href="cart.html">Ir al carrito</a>
      </div>
    </div>
  `;
}

/* ------- Checkout helpers ------- */

function cartSummaryText(){
  return CART.map(i=>`${i.qty}x ${i.name}`).join(", ");
}

function createWhatsAppCheckoutMessage(subtotal, tax, total){
  const items = CART.map(i => `${i.qty}x ${i.name} ($${formatNumber(i.price * i.qty)})`).join("%0A");
  const msg = encodeURIComponent(
    `Hola, quiero hacer el pedido:%0A${items}%0A%0ASubtotal: $${formatNumber(subtotal)}%0AIVA: $${formatNumber(tax)}%0ATotal: $${formatNumber(total)}%0A%0AMi nombre: _______ %0ADirección/Contacto: _______`
  );
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
}

/* ------- Utilities ------- */

function formatNumber(n){ return n.toLocaleString('es-CO'); }

/* ------- Theme toggle (dark/light) ------- */

function toggleTheme(){
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next === "dark" ? "dark" : "light");
  localStorage.setItem("tf_theme", next);
}

function applySavedTheme(){
  const saved = localStorage.getItem("tf_theme");
  if(saved === "dark") document.documentElement.setAttribute("data-theme","dark");
}

/* ------- Helpers para export global (necesario para botones inline) ------- */
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
