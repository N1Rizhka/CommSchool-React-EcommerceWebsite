// Function to add a product to the cart
function addToCart(product) {
  // Retrieve the existing cart or initialize it as an empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex !== -1) {
    // If the product already exists, increase the quantity by 1
    cart[existingProductIndex].quantity += 1;
  } else {
    // If the product doesn't exist, add it to the cart with a quantity of 1
    cart.push({ ...product, quantity: 1 });
  }

  // Update the cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  showAlert("Product successfully added to the cart!", "success");
  displayCartItems(); // Update the cart display if viewing cart.html
}


// Alert function for success messages
function showAlert(message, type) {
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type} fixed top-4 right-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow-lg`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 2000);
}

// Function to display cart items in cart.html
function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById("cart-items");
  const cartSubtotalElem = document.getElementById("cart-subtotal");
  const cartTaxElem = document.getElementById("cart-tax");
  const cartTotalElem = document.getElementById("cart-total");

  if (!cartContainer) return; // Exit if not on cart.html

  cartContainer.innerHTML = ""; // Clear existing items

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "flex gap-4 bg-yellow-400 px-4 py-6 rounded-md shadow-md";
    cartItem.innerHTML = `
      <div class="flex gap-4">
        <div class="w-24 h-24 flex-shrink-0">
          <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover rounded-md">
        </div>
        <div class="flex flex-col justify-between">
          <h3 class="text-lg font-bold text-gray-800">${item.title}</h3>
          <div class="flex items-center gap-2 mt-2">
            <button class="decrement-btn bg-white p-1 rounded-full w-6 h-6 flex items-center justify-center" data-product-id="${item.id}">
              -
            </button>
            <span class="font-semibold">${item.quantity}</span>
            <button class="increment-btn bg-white p-1 rounded-full w-6 h-6 flex items-center justify-center" data-product-id="${item.id}">
              +
            </button>
          </div>
        </div>
      </div>
      <div class="ml-auto flex flex-col items-end justify-between">
        <span class="text-lg font-bold text-white">$${itemTotal.toFixed(1)}</span>
        <button class="remove-btn text-white hover:text-red-600" data-product-id="${item.id}">
          remove
        </button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });

  const tax = subtotal * 0.1; // Example tax calculation at 10%
  const shipping = 2.00; // Fixed shipping cost
  const total = subtotal + tax + shipping;

  // Update the summary elements
  cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  cartTaxElem.textContent = `$${tax.toFixed(2)}`;
  cartTotalElem.textContent = `$${total.toFixed(2)}`;

  // Save these values to localStorage for use on the checkout page
  localStorage.setItem('cartSubtotal', subtotal.toFixed(2));
  localStorage.setItem('cartShipping', shipping.toFixed(2));
  localStorage.setItem('cartTax', tax.toFixed(2));
  localStorage.setItem('cartTotal', total.toFixed(2));
}

// Function to decrement quantity or remove item if quantity is 1
function decrementCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = cart.find(item => item.id === parseInt(productId));

  if (product) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart = cart.filter(item => item.id !== parseInt(productId));
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
  }
}

// Function to increment quantity
function incrementCartItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const product = cart.find(item => item.id === parseInt(productId));

  if (product) {
    product.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
  }
}

// Event listeners for cart item buttons
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.classList.contains("decrement-btn")) {
      const productId = event.target.dataset.productId;
      decrementCartItem(productId);
    }

    if (event.target.classList.contains("increment-btn")) {
      const productId = event.target.dataset.productId;
      incrementCartItem(productId);
    }

    if (event.target.classList.contains("remove-btn")) {
      const productId = event.target.dataset.productId;
      decrementCartItem(productId); // Call decrement to reduce quantity or remove item if it's 1
    }
  });

  // Display cart items on page load (only for cart.html)
  displayCartItems();
});

export { addToCart };
