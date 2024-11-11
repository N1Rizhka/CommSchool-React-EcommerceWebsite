import { fetchProducts } from './data.js';

let allProducts = []; // Global variable to store all products

// Display 4 random products (for the homepage)
async function displayRandomProducts() {
  const products = await fetchProducts();
  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

  const container = document.getElementById("product-grid");

  // Check if container exists before proceeding
  if (!container) {
    console.error("Element with ID 'product-grid' not found.");
    return;
  }

  container.innerHTML = ""; // Clear any existing content

  randomProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "shadow-sm rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col justify-between h-full cursor-pointer";
    productCard.innerHTML = `
      <div class="bg-white p-4 flex justify-center items-center h-64 product-frame">
        <img src="${product.img}" alt="${product.title}" class="max-h-full max-w-full object-contain">
      </div>
      <div class="p-4 text-center flex-col product-frame">
        <h3 class="text-md font-semibold text-gray-800 h-16">${product.title}</h3>
        <p class="text-sm text-gray-500 h-6 mt-10">${product.company}</p>
        <p class="mt-2 text-lg font-bold text-gray-900">$${product.price}</p>
      </div>
      <div class="p-4">
        <button class="add-to-cart w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}' >
          Add to Cart
        </button>
      </div>
    `;

    // Event listener to open product.html with product ID as a query parameter
    productCard.querySelectorAll(".product-frame").forEach(frame => {
      frame.addEventListener("click", () => {
        window.location.href = `product.html?id=${product.id}`;
      });
    });

    container.appendChild(productCard);
  });
}


// Display all products (for the catalogue page)
async function displayAllProducts() {
  allProducts = await fetchProducts(); // Fetch and store all products in the global array
  displayFilteredProducts(allProducts); // Display all products initially
}

// Display products based on a filtered list
function displayFilteredProducts(filteredProducts) {
  const container = document.getElementById("product-grid");
  container.innerHTML = ""; // Clear any existing content

  filteredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "shadow-sm rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col justify-between h-full cursor-pointer";
    productCard.innerHTML = `
      <div class="bg-white p-4 flex justify-center items-center h-64 product-frame">
        <img src="${product.img}" alt="${product.title}" class="max-h-full max-w-full object-contain">
      </div>
      <div class="p-4 text-center flex-col product-frame">
        <h3 class="text-md font-semibold text-gray-800 h-16">${product.title}</h3>
        <p class="text-sm text-gray-500 h-6 mt-10">${product.company}</p>
        <p class="mt-2 text-lg font-bold text-gray-900">$${product.price}</p>
      </div>
      <div class="p-4">
        <button class="add-to-cart w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
          Add to Cart
        </button>
      </div>
    `;

    // Event listener to open product.html with product ID as a query parameter
    productCard.querySelectorAll(".product-frame").forEach(frame => {
      frame.addEventListener("click", () => {
        window.location.href = `product.html?id=${product.id}`;
      });
    });

    container.appendChild(productCard);
  });
}

// Filter products based on search input
function filterProducts(query) {
  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.company.toLowerCase().includes(query.toLowerCase())
  );
  displayFilteredProducts(filteredProducts);
}

// Initialize search functionality on the catalogue page
function initializeSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      filterProducts(event.target.value);
    });
  }
}

// Call the appropriate function based on the page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("catalogue.html")) {
    displayAllProducts(); // Call on the catalogue page
    initializeSearch();   // Initialize search on the catalogue page
  } else {
    displayRandomProducts(); // Call on the homepage
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const productData = JSON.parse(event.target.getAttribute("data-product"));
    import("./cart.js").then((module) => {
      module.addToCart(productData);
    });
  }
});
