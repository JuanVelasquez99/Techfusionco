// Cargar productos desde JSON
fetch("data/products.json")
  .then(res => res.json())
  .then(products => {
    renderProducts(products);

    // Buscar
    document.getElementById("searchInput").addEventListener("input", e => {
      filterProducts(products);
    });

    // Filtrar por categoría
    document.getElementById("categoryFilter").addEventListener("change", () => {
      filterProducts(products);
    });

    // Cargar detalle de producto si estamos en product.html
    if (window.location.pathname.includes("product.html")) {
      loadProductDetail(products);
    }
  });

// Renderizar productos en la página principal
function renderProducts(products) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };

    card.innerHTML = `
      <img src="assets/img/${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
    `;

    container.appendChild(card);
  });
}

function filterProducts(products) {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

function loadProductDetail(products) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = products.find(p => p.id == id);

  const container = document.getElementById("productContainer");

  if (!product) {
    container.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  container.innerHTML = `
    <img src="assets/img/${product.image}">
    <h2>${product.name}</h2>
    <p class="price">$${product.price}</p>
    <p>${product.description}</p>

    <a 
      class="btn-whatsapp"
      href="https://wa.me/573237960343?text=Hola, estoy interesado en el producto: ${product.name}"
      target="_blank">
      Consultar por WhatsApp
    </a>
  `;
}

