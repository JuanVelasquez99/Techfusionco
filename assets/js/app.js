const container = document.getElementById("product-list");

products.forEach(product => {
  container.innerHTML += `
    <div class="product-card">
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>$${product.price.toLocaleString()}</p>
      <a href="product.html?id=${product.id}">
        <button>Ver producto</button>
      </a>
    </div>
  `;
});

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
}
