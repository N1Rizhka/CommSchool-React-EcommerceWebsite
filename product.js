import { fetchProducts } from './data.js';

// Function to get product ID from URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Display product details with layout improvements
async function displayProductDetails() {
  const productDetailsContainer = document.getElementById("product-details"); // Define this variable at the beginning
  const productId = getProductIdFromURL();
  const products = await fetchProducts();
  const product = products.find(p => p.id == productId);

  if (product && productDetailsContainer) {
    const container = productDetailsContainer.querySelector(".flex");
    container.innerHTML = `
      <!-- Product Image -->
      <div class="flex-shrink-0 lg:w-1/2">
        <img src="${product.img}" alt="${product.title}" class="w-full h-auto object-cover rounded-lg shadow-md">
      </div>

      <!-- Product Info -->
      <div class="lg:w-1/2 space-y-4">
        <h1 class="text-3xl font-bold text-gray-900">${product.title}</h1>
        <p class="text-2xl font-semibold text-gray-700">Price: $${product.price}</p>
        <p class="text-lg text-green-500">Availability: In Stock</p>

        <!-- Color Selection -->
        <div>
          <p class="text-lg font-medium text-gray-800">Select Color:</p>
          <div class="flex gap-2 mt-2">
            <span class="w-6 h-6 bg-red-500 rounded-full cursor-pointer"></span>
            <span class="w-6 h-6 bg-blue-500 rounded-full cursor-pointer"></span>
            <span class="w-6 h-6 bg-yellow-500 rounded-full cursor-pointer"></span>
          </div>
        </div>

        <!-- Size Selection -->
        <div>
          <p class="text-lg font-medium text-gray-800">Select Size:</p>
          <div class="flex gap-2 mt-2">
            <span class="px-3 py-1 border rounded-md cursor-pointer">S</span>
            <span class="px-3 py-1 border rounded-md cursor-pointer">M</span>
            <span class="px-3 py-1 border rounded-md cursor-pointer">L</span>
            <span class="px-3 py-1 border rounded-md cursor-pointer">XL</span>
            <span class="px-3 py-1 border rounded-md cursor-pointer">XXL</span>
          </div>
        </div>

        <!-- Product Description -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Product Description:</h3>
          <p class="text-gray-600">${product.info}</p>
        </div>

        <!-- Add to Cart Button -->
        <button class="add-to-cart w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
          Add to Cart
        </button>
      </div>
    `;
  } else if (productDetailsContainer) {
    productDetailsContainer.innerHTML = `<p class="text-red-500">Sorry, we must have sold it already :(</p>`;
  }
}


// Call the function on page load
document.addEventListener("DOMContentLoaded", displayProductDetails);
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const productData = JSON.parse(event.target.getAttribute("data-product"));
    import("./cart.js").then((module) => {
      module.addToCart(productData);
    });
  }
});

