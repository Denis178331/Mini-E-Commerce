document.addEventListener('DOMContentLoaded', function() {
    const cartLink = document.querySelector('.cart-link');
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    const animationClass = 'cart-pop-animation';
    const cartCountSpan = document.querySelector('.cart-count');
    let cartCount = 0;

    function triggerCartAnimation() {
        cartLink.classList.remove(animationClass);
        void cartLink.offsetWidth; 
        cartLink.classList.add(animationClass);
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            cartCount++;
            cartCountSpan.textContent = cartCount;
            triggerCartAnimation();
        });
    });

    const ratingContainers = document.querySelectorAll('.product-rating');
    ratingContainers.forEach(container => {
        const initialRating = parseFloat(container.getAttribute('data-average-rating'));
        const reviewCount = parseInt(container.getAttribute('data-review-count'));
        const productId = container.getAttribute('data-product-id');
        const starWrapper = document.createElement('div');
        starWrapper.classList.add('star-container');
        const ratingText = document.createElement('span');
        ratingText.classList.add('rating-text');
        
        function updateStarAppearance(currentRating) {
             starWrapper.innerHTML = ''; 
             for (let i = 1; i <= 5; i++) {
                 const star = document.createElement('span');
                 star.textContent = '★'; 
                 star.classList.add('star');
                 star.setAttribute('data-value', i); 
                 if (i <= currentRating) {
                     star.classList.add('filled');
                 }
                 starWrapper.appendChild(star);
             }
         }
        
        updateStarAppearance(initialRating);
        ratingText.textContent = `(${initialRating.toFixed(1)} of 5, ${reviewCount} reviews)`;
        container.appendChild(starWrapper);
        container.appendChild(ratingText);
        
        starWrapper.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('star')) {
                const hoverValue = parseInt(e.target.getAttribute('data-value'));
                starWrapper.querySelectorAll('.star').forEach(star => {
                    if (parseInt(star.getAttribute('data-value')) <= hoverValue) {
                        star.classList.add('hovered');
                    } else {
                        star.classList.remove('hovered');
                    }
                });
            }
        });
        starWrapper.addEventListener('mouseout', () => {
            starWrapper.querySelectorAll('.star').forEach(star => {
                star.classList.remove('hovered');
            });
        });
        starWrapper.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                const selectedRating = parseInt(e.target.getAttribute('data-value'));
                alert(`Thank you! You rated Product ${productId} with ${selectedRating} stars!`);
                updateStarAppearance(selectedRating); 
            }
        });
    });
  
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-result-container'); 
    function generateStars(rating) {
        let starsHtml = '<span class="search-star-container">';
        const fullStars = Math.floor(rating);

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star filled">★</span>';
        }
        for (let i = 0; i < (5 - Math.ceil(rating)); i++) {
            starsHtml += '<span class="star">★</span>';
        }
        
        starsHtml += '</span>';
        return starsHtml;
    }

    const productData = [
        { id: 1, name: 'Wireless Headphones', price: '€59.99', image: 'tomasz-gawlowski-YDZPdqv3FcA-unsplash.jpg', rating: 4.0, reviews: 32 },
        { id: 2, name: 'Smart Watch', price: '€129.99', image: 'daniel-korpai-hbTKIbuMmBI-unsplash.jpg', rating: 3.0, reviews: 40 },
        { id: 3, name: 'Mechanical Keyboard', price: '€89.99', image: 'pedro-costa-aXY5doQNZTc-unsplash.jpg', rating: 4.5, reviews: 20 },
        { id: 4, name: 'Gaming Mouse', price: '€44.99', image: 'maar-gaming-Pv--vb5vwzQ-unsplash.jpg', rating: 3.9, reviews: 30 }
    ];

    function displayResults(results) {
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
                <img src="${product.image}" alt="${product.name}">
                <div class="search-result-details">
                    <h4>${product.name}</h4>
                    <div class="search-product-rating">
                       ${ratingStars}
                       ${ratingText}
                    </div>
                    <p>${product.price}</p>
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
        displayResults(filteredResults);
    }

    if (searchInput) {
        searchInput.addEventListener('input', liveSearch);
    }
    document.addEventListener('click', (e) => {
        if (searchInput && resultsContainer) {
            if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
                resultsContainer.style.display = 'none';
            }
        }
    });

});