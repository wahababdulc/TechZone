// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999,
        category: "smartphones",
        image: "📱",
        description: "Latest iPhone with advanced features"
    },
    {
         id: 2,
    name: "Samsung Galaxy S24",
    price: 899,
    category: "smartphones",
    image: "image/wpic2.jpeg",  // ✅ UPDATED LINE
    description: "Powerful Android smartphone"
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        price: 1999,
        category: "laptops",
        image: "💻",
        description: "High-performance laptop for professionals"
    },
    {
        id: 4,
        name: "Dell XPS 13",
        price: 1299,
        category: "laptops",
        image: "💻",
        description: "Ultrabook with stunning display"
    },
    {
        id: 5,
        name: "Sony WH-1000XM5",
        price: 399,
        category: "audio",
        image: "🎧",
        description: "Premium noise-canceling headphones"
    },
    {
        id: 6,
        name: "AirPods Pro",
        price: 249,
        category: "audio",
        image: "🎧",
        description: "Wireless earbuds with spatial audio"
    },
    {
        id: 7,
        name: "Samsung 65\" QLED TV",
        price: 1499,
        category: "tvs",
        image: "📺",
        description: "4K Smart TV with quantum dot technology"
    },
    {
        id: 8,
        name: "LG OLED 55\" TV",
        price: 1299,
        category: "tvs",
        image: "📺",
        description: "OLED TV with perfect blacks"
    }
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load content based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            loadFeaturedProducts();
            break;
        case 'products.html':
            loadAllProducts();
            break;
        case 'cart.html':
            loadCartItems();
            break;
        case 'contact.html':
            setupContactForm();
            break;
    }
});

// Load featured products on home page
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featuredProducts = products.slice(0, 4);
    featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load all products on products page
function loadAllProducts() {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
/*
function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}*/

function createProductCard(product) {
    const isEmoji = !product.image.includes('.'); // if there's no dot (.), it's probably an emoji

    const imageHTML = isEmoji
        ? `<div class="product-image" style="font-size: 3rem;">${product.image}</div>`
        : `<div class="product-image"><img src="${product.image}" alt="${product.name}" /></div>`;

    return `
        <div class="product-card" data-category="${product.category}">
            ${imageHTML}
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}



// Filter products by category (from home page)
function filterProducts(category) {
    localStorage.setItem('filterCategory', category);
    window.location.href = 'products.html';
}

// Filter products on products page
function filterProductsPage(category) {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide products
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show all products
function showAllProducts() {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show all products
    productCards.forEach(card => {
        card.style.display = 'block';
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showNotification('Product added to cart!');
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Load cart items on cart page
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button class="cta-button" onclick="window.location.href='products.html'">
                    Shop Now
                </button>
            </div>
        `;
        totalItemsElement.textContent = '0';
        totalPriceElement.textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Update totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Create cart item HTML
function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `;
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    showNotification('Item removed from cart');
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        showNotification('Cart cleared');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Proceed to checkout? Total: $${totalPrice.toFixed(2)}`)) {
        // Simulate checkout process
        showNotification('Order placed successfully! Thank you for shopping with TechZone.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
    }
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simulate form submission
        showNotification(`Thank you ${name}! Your message has been sent. We'll get back to you soon.`);
        contactForm.reset();
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Check for filter category on products page load
document.addEventListener('DOMContentLoaded', function() {
    const filterCategory = localStorage.getItem('filterCategory');
    if (filterCategory && window.location.pathname.includes('products.html')) {
        setTimeout(() => {
            filterProductsPage(filterCategory);
            localStorage.removeItem('filterCategory');
        }, 100);
    }
});