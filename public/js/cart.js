// Cart Management Logic for ComponentesGamingUG
const cart = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.save();
        this.updateUI();

        // Auto-open cart sidebar when a product is added
        const checkbox = document.getElementById('cart-toggle-checkbox');
        if (checkbox) {
            checkbox.checked = true;
            localStorage.setItem('cartOpen', 'true');
        }
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUI();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateUI();
        }
    },

    save() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateUI() {
        this.updateBadge();
        this.renderCart();
    },

    updateBadge() {
        const badge = document.querySelector('.cart-badge');
        const totalPrice = document.querySelector('.cart-section span');
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (badge) badge.textContent = itemCount;
        if (totalPrice) totalPrice.textContent = '$' + this.getTotal().toFixed(2);
    },

    renderCart() {
        const cartBody = document.querySelector('.cart-body');
        if (!cartBody) return;
        
        if (this.items.length === 0) {
            cartBody.innerHTML = `
                <i class="ph ph-shopping-cart cart-empty-icon"></i>
                <p>No hay productos en el carrito.</p>
            `;
            return;
        }

        const cartHTML = `
            <div class="cart-items">
                ${this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="qty-btn minus" data-id="${item.id}">−</button>
                                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="qty-input">
                                <button class="qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-actions">
                            <button class="btn-specs" data-id="${item.id}" title="Ver especificaciones">
                                <i class="ph ph-eye"></i>
                            </button>
                            <button class="btn-remove" data-id="${item.id}" title="Eliminar">
                                <i class="ph ph-x"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="total-price">$${this.getTotal().toFixed(2)}</span>
                </div>
                <button class="btn-checkout">Proceder al Pago</button>
            </div>
        `;

        cartBody.innerHTML = cartHTML;
        this.attachEventListeners();
    },

    attachEventListeners() {
        // Remove buttons
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.removeItem(productId);
            });
        });

        // View specs buttons
        document.querySelectorAll('.btn-specs').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const item = this.items.find(i => i.id === productId);
                if (item) {
                    alert(`${item.name}\n\nPrecio: $${item.price.toFixed(2)}\nCantidad: ${item.quantity}`);
                }
            });
        });

        // Quantity buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const item = this.items.find(i => i.id === productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const item = this.items.find(i => i.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Quantity input
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.id;
                const quantity = parseInt(e.target.value) || 1;
                this.updateQuantity(productId, quantity);
            });
        });
    }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sync checkbox state with localStorage to persist open state
    const checkbox = document.getElementById('cart-toggle-checkbox');
    if (checkbox) {
        // Restore state on load
        const isCartOpen = localStorage.getItem('cartOpen') === 'true';
        checkbox.checked = isCartOpen;

        // Save state on change
        checkbox.addEventListener('change', () => {
            localStorage.setItem('cartOpen', checkbox.checked);
        });
    }

    // 2. Add event listeners to "Añadir al Carrito" buttons
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.currentTarget.closest('.product-card');
            if (!productCard) return;

            // Resolve unique deterministic ID based on title
            const titleEl = productCard.querySelector('.product-title');
            if (!titleEl) return;
            const titleText = titleEl.textContent.trim();
            const resolvedId = productCard.dataset.id || titleText.toLowerCase().replace(/[^a-z0-9]/g, '-');

            const priceEl = productCard.querySelector('.product-price');
            const price = priceEl ? parseFloat(priceEl.textContent.replace('$', '').trim()) : 0.00;

            const imgEl = productCard.querySelector('.product-image');
            const image = imgEl ? imgEl.src : '';

            const catEl = productCard.querySelector('.product-category');
            const category = catEl ? catEl.textContent.trim() : '';

            const product = {
                id: resolvedId,
                name: titleText,
                price: price,
                image: image,
                category: category
            };
            
            cart.addItem(product);
            
            // Visual feedback
            const originalContent = e.currentTarget.innerHTML;
            e.currentTarget.textContent = '✓ Agregado';
            setTimeout(() => {
                e.currentTarget.innerHTML = originalContent;
            }, 1500);
        });
    });

    // 3. Initialize cart UI
    cart.updateUI();
});
