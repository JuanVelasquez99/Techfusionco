const productList = document.getElementById("product-list");

products.forEach(product => {
  productList.innerHTML += `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price.toLocaleString("es-CO")}</p>
      <p class="desc">${product.description}</p>
      <a href="product.html?id=${product.id}">
        <button>Ver producto</button>
      </a>
    </div>
  `;
});
