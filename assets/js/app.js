const productList = document.getElementById("product-list");
const categoryLinks = document.querySelectorAll("nav a[data-category]");

function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  list.forEach(product => {
    productList.innerHTML += `
      <div class="product-card fade-slide">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toLocaleString("es-CO")}</p>
        <a href="product.html?id=${product.id}">
          <button>Ver producto</button>
        </a>
      </div>
    `;
  });
}

// EVENTOS DE FILTRO
categoryLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const category = link.dataset.category;

    if (category === "all") {
      renderProducts(products);
    } else {
      const filtered = products.filter(
        p => p.category === category
      );
      renderProducts(filtered);
    }
  });
});

// INIT
renderProducts(products);
