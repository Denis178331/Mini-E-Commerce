const productCatalog = [
    { id: 1, name: 'Wireless Headphones', price: 59.99, image: 'https://placehold.co/100x100/4f46e5/ffffff?text=Headphones' },
    { id: 2, name: 'Smart Watch', price: 129.99, image: 'https://placehold.co/100x100/10b981/ffffff?text=Watch' },
    { id: 3, name: 'Mechanical Keyboard', price: 89.99, image: 'https://placehold.co/100x100/f59e0b/ffffff?text=Keyboard' },
    { id: 4, name: 'Gaming Mouse', price: 44.99, image: 'https://placehold.co/100x100/ef4444/ffffff?text=Mouse' },
    { id: 5, name: '4K Monitor', price: 249.99, image: 'https://placehold.co/100x100/3b82f6/ffffff?text=Monitor' },
    { id: 6, name: 'SSD 1TB', price: 109.99, image: 'https://placehold.co/100x100/a855f7/ffffff?text=SSD' },
    { id: 7, name: 'Webcam HD', price: 34.99, image: 'https://placehold.co/100x100/14b8a6/ffffff?text=Webcam' },
    { id: 8, name: 'Premium Laptop Stand', price: 159.99, image: 'https://placehold.co/100x100/6b7280/ffffff?text=Stand' },
    { id: 9, name: 'Playstation 5', price: 550.88, image: 'https://placehold.co/100x100/1f2937/ffffff?text=PS5' }
];
let cart = [];

const TAX_RATE = 0.19;
const STORAGE_KEY = 'shoppingCartData';
const cartItemsContainer = document.getElementById('cart-items');
const subtotalDisplay = document.getElementById('subtotal');
const taxDisplay = document.getElementById('tax');
const totalDisplay = document.getElementById('total');
const itemCountDisplay = document.getElementById('item-count');
const clearCartBtn = document.getElementById('clear-cart-btn');
const addDummyItemBtn = document.getElementById('add-dummy-item-btn');

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated')); 
    } catch (e) {
        console.error("Could not save cart to localStorage:", e);
    }
}
function loadCart() {
    try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
            cart = JSON.parse(savedCart);
        } else {
            cart = []; 
        }
    } catch (e) {
        console.error("Could not load cart from localStorage:", e);
        cart = []; 
    }
}
function calculateTotal() {
    let subtotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let taxValue = subtotalValue * TAX_RATE;
    let totalValue = subtotalValue + taxValue;

    if (subtotalDisplay) subtotalDisplay.textContent = "€" + subtotalValue.toFixed(2);
    if (taxDisplay) taxDisplay.textContent = "€" + taxValue.toFixed(2);
    if (totalDisplay) totalDisplay.textContent = "€" + totalValue.toFixed(2);
    if (itemCountDisplay) itemCountDisplay.textContent = cart.length; 
    
    const cartCountSpan = document.querySelector('.cart-count');
    if (cartCountSpan) {
        const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountSpan.textContent = totalItemsInCart;
    }
}

/**
 * PUBLIC FUNCTION: Adds a new product or increments quantity if it already exists.
 * This is the function called from the products page (via products.js).
 * @param {object} product - Must contain: id (number), name (string), price (number), image (string, optional).
 */
window.addToCart = function(product) {
    if (!product || !product.id || !product.name || typeof product.price !== 'number') {
        console.error("Invalid product format provided to addToCart:", product);
        return;
    }
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || "https://placehold.co/100x100/7c3aed/ffffff?text=No+Img" 
        };
        cart.push(newItem);
    }
    if (cartItemsContainer) {
        renderCart();
    } else {
        saveCart(); 
        calculateTotal();
    }
}


/**
 * Changes the quantity of an item and re-renders the cart.
 * @param {number} id - The unique ID of the product.
 * @param {number} change - The value to add or subtract (-1 or 1).
 */
function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        let newQuantity = cart[itemIndex].quantity + change;      
        if (newQuantity < 1) {
            removeItem(id); 
            return;
        }
        cart[itemIndex].quantity = newQuantity;
        renderCart();
    }
}

/**
 * Sets the quantity of an item directly from the input field value.
 * @param {number} id - The unique ID of the product.
 * @param {string} value - The new quantity value (string from input).
 */
function setQuantity(id, value) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        let newQuantity = parseInt(value, 10);
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        cart[itemIndex].quantity = newQuantity;
        
        const inputElement = document.querySelector(`.product-row[data-id="${id}"] input[type="number"]`);
        if (inputElement) {
             inputElement.value = newQuantity;
        }
        
        renderCart();
    }
}
/**
 * Removes an item from the cart array by ID.
 * @param {number} id - The unique ID of the product to remove.
 */
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}
function clearCart() {
    cart = [];
    renderCart();
}
function addDummyItem() {
    const randomIndex = Math.floor(Math.random() * productCatalog.length);
    const productToAdd = productCatalog[randomIndex];
    window.addToCart(productToAdd); 
    if (!cartItemsContainer) {
        console.log(`Test: Adăugat ${productToAdd.name} în coș.`);
    }
}
function renderCart() {
    if (!cartItemsContainer) return; 
    cartItemsContainer.innerHTML = ''; 
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message text-center py-10">
                <p class="text-gray-500 text-lg">
                    Your shopping cart is empty.
                </p>
                <p class="text-sm text-gray-400 mt-2">Add products to start shopping!</p>
            </div>
        `;
    }
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'product-row'; 
        itemElement.setAttribute('data-id', item.id);
        
        const itemTotal = (item.price * item.quantity).toFixed(2);
        itemElement.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center; justify-content: space-between;">
                <!-- Product Image and Details -->
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;" onerror="this.onerror=null; this.src='https://placehold.co/80x80/7c3aed/ffffff?text=No+Img';">
                    
                    <div style="flex-grow: 1;">
                        <p style="font-weight: 600; color: #333; margin: 0;">${item.name}</p>
                        <p style="font-size: 0.9em; color: #666; margin: 0;">Unit Price: €${item.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <!-- Quantity and Total Price Controls -->
            <div style="display: flex; align-items: center; gap: 20px;">
                <!-- Quantity Control -->
                <div class="qty-input-group" style="display: flex; align-items: center; border: 1px solid #ccc; border-radius: 6px;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="padding: 8px; border: none; background: #f0f0f0; cursor: pointer; border-radius: 6px 0 0 6px;">
                        -
                    </button>
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="setQuantity(${item.id}, this.value)" 
                           style="width: 50px; text-align: center; border: none; padding: 8px 0; outline: none;">
                    <button onclick="updateQuantity(${item.id}, 1)" style="padding: 8px; border: none; background: #f0f0f0; cursor: pointer; border-radius: 0 6px 6px 0;">
                        +
                    </button>
                </div>
                
                <!-- Product Total Price -->
                <div class="product-total-price" style="min-width: 80px; text-align: right; font-weight: 700; color: #1e90ff;">
                    <span>€${itemTotal}</span>
                </div>

                <!-- Delete Button -->
                <button onclick="removeItem(${item.id})" class="delete-btn" title="Remove product" 
                        style="padding: 10px; border: none; background: transparent; cursor: pointer; color: #ef4444; font-size: 1.2em;">
                    🗑️
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    calculateTotal();
    saveCart();
}
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
window.removeItem = removeItem;

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCart();
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    if (addDummyItemBtn) {
        addDummyItemBtn.addEventListener('click', addDummyItem);
    }
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            loadCart();
            renderCart();
        }
    });
    window.addEventListener('cartUpdated', () => {
        loadCart();
        renderCart();
    });
    calculateTotal(); 
});
