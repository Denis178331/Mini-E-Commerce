document.addEventListener('DOMContentLoaded', function() {
    const productData = [
        { id: 1, name: 'Wireless Headphones', price: 59.99, image: 'tomasz-gawlowski-YDZPdqv3FcA-unsplash.jpg', rating: 4.0, reviews: 32 },
        { id: 2, name: 'Smart Watch', price: 129.99, image: 'daniel-korpai-hbTKIbuMmBI-unsplash.jpg', rating: 3.0, reviews: 40 },
        { id: 3, name: 'Mechanical Keyboard', price: 89.99, image: 'pedro-costa-aXY5doQNZTc-unsplash.jpg', rating: 4.5, reviews: 20 },
        { id: 4, name: 'Gaming Mouse', price: 44.99, image: 'maar-gaming-Pv--vb5vwzQ-unsplash.jpg', rating: 3.9, reviews: 30 },
        { id: 5, name: '4K Monitor', price: 249.99, image: 'quaritsch-photography-m2zuB8DqwyM-unsplash.jpg', rating: 4.8, reviews: 55 },
        { id: 6, name: 'SSD 1TB', price: 109.99, image: 'andrey-matveev-UbpPW0Xsqlw-unsplash.jpg', rating: 4.2, reviews: 65 },
        { id: 7, name: 'Webcam HD', price: 34.99, image: 'deeterontop-nP4WPqYAhTQ-unsplash.jpg', rating: 3.5, reviews: 12 },
        { id: 8, name: 'Premium Laptop Stand', price: 159.99, image: 'workperch-wnZ3ai3_idw-unsplash.jpg', rating: 4.6, reviews: 48 },
        { id: 9, name: 'Playstation 5', price: 550.88, image: 'martin-katler-caNzzoxls8Q-unsplash.jpg', rating: 4.1, reviews: 70 }, 
    ];

    const productListContainer = document.getElementById('full-product-list');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartLink = document.querySelector('.cart-link');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-result-container'); 
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const animationClass = 'cart-pop-animation';

    function triggerCartAnimation() {
        cartLink.classList.remove(animationClass);
        void cartLink.offsetWidth; 
        cartLink.classList.add(animationClass);
    }
    window.handleAddToCart = function(product) {
        if (typeof window.addToCart === 'function') {
            window.addToCart(product);
            const savedCart = JSON.parse(localStorage.getItem('shoppingCartData') || '[]');
            const currentItemCount = savedCart.length;
            cartCountSpan.textContent = currentItemCount;
            triggerCartAnimation();

        } else {
            console.error("Eroare: Scriptul 'cart.js' nu a fost încărcat sau functia 'addToCart' lipsește.");
        }
    }
    
    function initCartButtons() {
        const addToCartButtons = document.querySelectorAll('.product-card .add-to-cart-btn');
        addToCartButtons.forEach(button => {
            const oldButton = button;
            const newButton = oldButton.cloneNode(true);
            oldButton.parentNode.replaceChild(newButton, oldButton);
        });
        const newAddToCartButtons = document.querySelectorAll('.product-card .add-to-cart-btn');
        newAddToCartButtons.forEach(button => {
            const productId = parseInt(button.closest('.product-card').getAttribute('data-product-id'), 10);
            const product = productData.find(p => p.id === productId);

            if (product) {
                 button.addEventListener('click', () => window.handleAddToCart(product));
            }
        });
    }
    function initRatings(container) {
        const ratingContainers = container.querySelectorAll('.product-rating');
        ratingContainers.forEach(container => {
            const initialRating = parseFloat(container.getAttribute('data-average-rating'));
            const reviewCount = parseInt(container.getAttribute('data-review-count'));
            
            let html = '';
            for (let i = 1; i <= 5; i++) {
                html += `<span class="star ${i <= initialRating ? 'filled' : ''}">★</span>`;
            }
            container.innerHTML = `<div class="star-container">${html}</div><span class="rating-text">(${initialRating.toFixed(1)} / ${reviewCount})</span>`;
        });
    }
    function generateStars(rating) {
        let starsHtml = '<span class="search-star-container">';
        const fullStars = Math.floor(rating);
        const stars = [];

        for (let i = 0; i < 5; i++) {
            stars.push(`<span class="star ${i < fullStars ? 'filled' : ''}">★</span>`);
        }
        starsHtml += stars.join('');
        starsHtml += '</span>';
        return starsHtml;
    }   
    function displaySearchResults(results) {
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '';      
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 10px; color: #666;">No products found.</div>';
            resultsContainer.style.display = 'block';
            return;
        }
        results.forEach(product => {
            const itemLink = document.createElement('a');
            itemLink.href = `#product-${product.id}`;
            itemLink.classList.add('search-result-item');        
            const ratingStars = generateStars(product.rating);
            const ratingText = `<span class="search-rating-text">(${product.rating.toFixed(1)} / ${product.reviews})</span>`; 
            const html = `
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://placehold.co/40x40/7c3aed/ffffff?text=No+Img';">
                <div class="search-result-details">
                    <h4>${product.name}</h4>
                    <div class="search-product-rating">
                        ${ratingStars}
                        ${ratingText}
                    </div>
                    <p>€${product.price.toFixed(2)}</p>
                </div>`;
            itemLink.innerHTML = html;
            resultsContainer.appendChild(itemLink);
        });
        resultsContainer.style.display = 'block';
    }
    
    function liveSearch() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }
        const filteredResults = productData.filter(product => 
            product.name.toLowerCase().includes(query)
        );
        displaySearchResults(filteredResults);
    } 
    
    function displayProducts(productsToDisplay) {
        if (!productListContainer) return;
        productListContainer.innerHTML = ''; 
        if (productsToDisplay.length === 0) {
            productListContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 50px;">No products match your current filters.</p>';
            return;
        }
        productsToDisplay.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.setAttribute('data-product-id', product.id); 
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='https://placehold.co/200x200/7c3aed/ffffff?text=No+Img';">
                <h3>${product.name}</h3>
                <div class="product-rating" data-average-rating="${product.rating}" data-review-count="${product.reviews}">
                    </div>
                <p class="product-price">€${product.price.toFixed(2)}</p>
                <!-- Butonul nu mai are onclick în HTML, evenimentul se atașează în JS cu ID-ul real al produsului -->
                <button class="btn add-to-cart-btn">Add to Cart</button>
            `;
            productListContainer.appendChild(card);
        });
        initRatings(productListContainer);
        initCartButtons();
    }
    
    function applyFilters() {
        const priceFilters = document.querySelectorAll('input[name="price-filter"]:checked');
        
        let filteredList = [...productData];
        if (priceFilters.length > 0) {
            filteredList = filteredList.filter(product => {
                const price = product.price;
                let isPriceMatch = false;
                priceFilters.forEach(filter => {
                    if (filter.value === 'low' && price < 70) isPriceMatch = true;
                    if (filter.value === 'medium' && price >= 70 && price <= 150) isPriceMatch = true;
                    if (filter.value === 'high' && price > 150) isPriceMatch = true;
                });
                return isPriceMatch;
            });
        }
        
        displayProducts(filteredList);
    }
    
    function resetFilters() {
        document.querySelectorAll('.sidebar-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        displayProducts(productData);
    }
    function updateHeaderCartCount() {
        const savedCart = JSON.parse(localStorage.getItem('shoppingCartData') || '[]');
        cartCountSpan.textContent = savedCart.length;
    }
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', liveSearch);
    }

    if (resultsContainer && searchInput) {
        document.addEventListener('click', (e) => {
            if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
                resultsContainer.style.display = 'none';
            }
        });
    }
    displayProducts(productData);
    updateHeaderCartCount();
});
