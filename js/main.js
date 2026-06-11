document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartContinue = document.getElementById('cartContinue');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const cartItems = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');

  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModal = document.getElementById('productModal');
  const productModalClose = document.getElementById('productModalClose');
  const productModalImage = document.getElementById('productModalImage');
  const productModalBadges = document.getElementById('productModalBadges');
  const productModalTitle = document.getElementById('productModalTitle');
  const productModalMeta = document.getElementById('productModalMeta');
  const productModalPrice = document.getElementById('productModalPrice');
  const productModalSize = document.getElementById('productModalSize');
  const productModalDesc = document.getElementById('productModalDesc');
  const productQty = document.getElementById('productQty');
  const productQtyMinus = document.getElementById('productQtyMinus');
  const productQtyPlus = document.getElementById('productQtyPlus');
  const productAddToCart = document.getElementById('productAddToCart');
  const productContactBtn = document.getElementById('productContactBtn');
  const productRelatedGrid = document.getElementById('productRelatedGrid');

  const THUMB = 'assets/images/products/thumbs/';
  let cart = [
    { id: 1, name: 'Pelele con Lazo', price: 15, img: THUMB + '01-pelele-lazo.jpg', size: '12 meses', qty: 1 },
    { id: 5, name: 'Jesusito 3 piezas · Niños', price: 24.90, img: THUMB + '05-jesusito-ninos.jpg', size: '4 años', qty: 1 }
  ];

  let activeProduct = null;
  let toastTimer = null;

  const CATEGORY_HASHES = Object.keys(CATEGORIES);
  let activeCategory = null;
  let categoryShopReady = false;

  function formatPrice(price) {
    return `${price.toFixed(2).replace('.', ',')} €`;
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getProductWhatsAppMessage(productName) {
    return `Hola, quería más información sobre ${productName}.`;
  }

  function getWhatsAppUrl(message) {
    const text = encodeURIComponent(message || BRAND.whatsappMessage);
    return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
  }

  function setupContactLinks() {
    const welcomeUrl = getWhatsAppUrl();
    const whatsappBtn = document.getElementById('whatsappBtn');
    const footerContact = document.getElementById('footerContactBtn');
    const tooltip = document.querySelector('.whatsapp-btn__tooltip');

    if (whatsappBtn) whatsappBtn.href = welcomeUrl;
    if (footerContact) footerContact.href = welcomeUrl;
    if (tooltip) tooltip.textContent = BRAND.whatsappWelcome;
  }

  function renderProductCard(product, type = 'default', lazy = true) {
    const isBestseller = type === 'bestseller';
    const badgeClass = isBestseller ? 'product-card__badge--hot' : '';
    const cardClass = isBestseller ? 'product-card product-card--bestseller' : 'product-card';
    const footerExtra = product.sold
      ? `<span class="product-card__sold">${product.sold}</span>`
      : product.tag
        ? `<span class="product-card__tag">${product.tag}</span>`
        : `<span class="product-card__tag">${BRAND.instagramUser}</span>`;
    const loading = lazy ? 'loading="lazy"' : 'loading="eager" fetchpriority="high"';
    const waUrl = getWhatsAppUrl(getProductWhatsAppMessage(product.name));

    return `
      <article class="${cardClass}" data-id="${product.id}">
        ${product.badge ? `<div class="product-card__badge ${badgeClass}">${product.badge}</div>` : ''}
        ${product.instagram ? '<span class="product-card__ig" aria-label="Foto de Instagram">IG</span>' : ''}
        <div class="product-card__img">
          <img src="${product.image}" alt="${product.name}" width="400" height="400" decoding="async" ${loading}>
          <button class="product-card__quick-add"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}"
            data-img="${product.image}">+ Añadir</button>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__sizes">${product.sizes}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(product.price)}</span>
            <div class="product-card__actions">
              <a href="${waUrl}" class="product-card__wa" target="_blank" rel="noopener" aria-label="Consultar ${product.name} por WhatsApp">WhatsApp</a>
              ${footerExtra}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function mountGrid(gridId, items, type = 'default') {
    const grid = document.getElementById(gridId);
    if (!grid || grid.dataset.mounted === 'true') return;
    grid.innerHTML = items.map((p, i) => renderProductCard(p, type, i > 1)).join('');
    grid.dataset.mounted = 'true';
    bindProductInteractions(grid);
  }

  function lazyMountSection(sectionId, gridId, items, type = 'default') {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);
    if (!section || !grid) return;

    const mount = () => mountGrid(gridId, items, type);
    if (!('IntersectionObserver' in window)) {
      mount();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      mount();
      io.disconnect();
    }, { rootMargin: '240px 0px' });

    io.observe(section);
  }

  function renderProducts() {
    mountGrid('novedadesGrid', CATALOG.novedades);
    lazyMountSection('mas-vendidos', 'bestsellersGrid', CATALOG.bestsellers, 'bestseller');
    lazyMountSection('catalogo', 'catalogoGrid', CATALOG.catalogo);
  }

  function renderCategoryShop(category) {
    const grid = document.getElementById('categoryShopGrid');
    const title = document.getElementById('shopTitle');
    const tagline = document.getElementById('shopTagline');
    const tabs = document.getElementById('categoryTabs');
    if (!grid || !title || !tagline) return;

    const meta = CATEGORIES[category];
    if (!meta) return;

    activeCategory = category;
    categoryShopReady = true;
    title.textContent = meta.label;
    tagline.textContent = meta.tagline;

    const products = getProductsByCategory(category);
    grid.innerHTML = products.length
      ? products.map((p, i) => renderProductCard(p, 'default', i > 1)).join('')
      : '<p class="shop-empty">Próximamente más modelos en esta categoría.</p>';

    if (tabs) {
      tabs.querySelectorAll('[data-category]').forEach(btn => {
        btn.classList.toggle('category-tabs__btn--active', btn.dataset.category === category);
      });
    }

    bindProductInteractions(grid);
  }

  function ensureCategoryShop(category = 'peleles') {
    if (!categoryShopReady) renderCategoryShop(category);
    else if (category !== activeCategory) renderCategoryShop(category);
  }

  function setupCategoryNavigation() {
    const tabs = document.getElementById('categoryTabs');
    const shopSection = document.getElementById('tienda');
    if (!tabs || !shopSection) return;

    tabs.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        ensureCategoryShop(category);
        history.replaceState(null, '', `#${category}`);
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href').slice(1);
        if (!CATEGORY_HASHES.includes(hash)) return;
        e.preventDefault();
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        ensureCategoryShop(hash);
        history.replaceState(null, '', `#${hash}`);
        closeMobileMenu();
      });
    });

    const bootCategory = () => {
      const initialHash = window.location.hash.slice(1);
      const initialCategory = CATEGORY_HASHES.includes(initialHash) ? initialHash : 'peleles';
      ensureCategoryShop(initialCategory);
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        bootCategory();
        io.disconnect();
      }, { rootMargin: '200px 0px' });
      io.observe(shopSection);
    } else {
      bootCategory();
    }
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
      scrollTicking = false;
    });
  }, { passive: true });

  function openCart() {
    cartSidebar.classList.add('cart-sidebar--active');
    cartOverlay.classList.add('cart-overlay--active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('cart-sidebar--active');
    cartOverlay.classList.remove('cart-overlay--active');
    if (!productModal.classList.contains('product-modal--active') && !mobileMenu.classList.contains('mobile-menu--active')) {
      document.body.style.overflow = '';
    }
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  cartContinue.addEventListener('click', closeCart);

  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('mobile-menu--active');
    document.body.style.overflow = 'hidden';
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--active');
    if (!productModal.classList.contains('product-modal--active') && !cartSidebar.classList.contains('cart-sidebar--active')) {
      document.body.style.overflow = '';
    }
  }

  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      const hash = link.getAttribute('href')?.slice(1);
      if (!CATEGORY_HASHES.includes(hash)) closeMobileMenu();
    });
  });

  function renderCart() {
    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="text-align:center;padding:40px 0;color:#8B7355;">Tu carrito está vacío</p>';
      cartBadge.textContent = '0';
      cartCount.textContent = '(0)';
      cartSubtotal.textContent = '0,00 €';
      return;
    }

    cartItems.innerHTML = cart.map((item, i) => `
      <div class="cart-item" data-index="${i}">
        <img src="${item.img}" alt="${item.name}" width="72" height="72" loading="lazy" decoding="async">
        <div class="cart-item__info">
          <h4>${item.name}</h4>
          <p>Talla ${item.size} · Cant. ${item.qty}</p>
          <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
        </div>
        <button class="cart-item__remove" data-index="${i}" aria-label="Eliminar">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = getCartCount();
    cartBadge.textContent = count;
    cartCount.textContent = `(${count})`;
    cartSubtotal.textContent = formatPrice(total);

    cartItems.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index, 10), 1);
        renderCart();
        showToast('Producto eliminado del carrito', { type: 'error', icon: '✕' });
      });
    });
  }

  function addToCart({ id, name, price, img, size, qty = 1 }) {
    const existing = cart.find(item => item.id === id && item.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, name, price, img, size, qty });
    }
    renderCart();
    pulseCartBadge();
  }

  function pulseCartBadge() {
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => { cartBadge.style.transform = ''; }, 300);
  }

  function bindProductInteractions(root = document) {
    root.querySelectorAll('.product-card__quick-add').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = getProductById(btn.dataset.id);
        const defaultSize = product ? getProductSizes(product)[0] : 'Por confirmar';
        addToCart({
          id: Number(btn.dataset.id),
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price),
          img: btn.dataset.img,
          size: defaultSize,
          qty: 1
        });
        showToast(`${btn.dataset.name} añadido al carrito`, {
          type: 'success',
          icon: '✓',
          actionLabel: 'Ver carrito',
          onAction: openCart
        });
      });
    });

    root.querySelectorAll('.product-card__wa').forEach(link => {
      if (link.dataset.boundWa) return;
      link.dataset.boundWa = 'true';
      link.addEventListener('click', (e) => e.stopPropagation());
    });

    root.querySelectorAll('.product-card').forEach(card => {
      if (card.dataset.boundCard) return;
      card.dataset.boundCard = 'true';
      card.addEventListener('click', (e) => {
        if (e.target.closest('.product-card__quick-add, .product-card__wa')) return;
        openProductModal(parseInt(card.dataset.id, 10));
      });
    });
  }

  function renderRelatedProducts(product) {
    const related = getRelatedProducts(product);
    if (!related.length) {
      productRelatedGrid.innerHTML = '<p class="shop-empty">Explora más modelos en el catálogo.</p>';
      return;
    }

    productRelatedGrid.innerHTML = related.map(item => `
      <button type="button" class="related-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" width="160" height="160" loading="lazy" decoding="async">
        <span class="related-card__name">${item.name}</span>
        <span class="related-card__price">${formatPrice(item.price)}</span>
      </button>
    `).join('');

    productRelatedGrid.querySelectorAll('.related-card').forEach(btn => {
      btn.addEventListener('click', () => {
        openProductModal(parseInt(btn.dataset.id, 10));
      });
    });
  }

  function openProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;

    activeProduct = product;
    const sizes = getProductSizes(product);
    const primaryCategory = product.categories?.find(c => c !== 'novedades') || product.categories?.[0];
    const categoryLabel = primaryCategory ? CATEGORIES[primaryCategory]?.label : '';

    productModalImage.src = getFullImage(product);
    productModalImage.alt = product.name;
    productModalTitle.textContent = product.name;
    productModalMeta.textContent = [categoryLabel, product.tag, product.sold].filter(Boolean).join(' · ');
    productModalPrice.textContent = formatPrice(product.price);
    productModalDesc.textContent = product.sizes;

    productModalBadges.innerHTML = [
      product.badge ? `<span class="product-modal__badge${product.badge.includes('Top') ? ' product-modal__badge--hot' : ''}">${product.badge}</span>` : '',
      product.instagram ? '<span class="product-modal__badge">Foto real de Instagram</span>' : ''
    ].filter(Boolean).join('');

    productModalSize.innerHTML = sizes.map(size => `<option value="${size}">${size}</option>`).join('');
    productQty.value = '1';

    productContactBtn.href = getWhatsAppUrl(getProductWhatsAppMessage(product.name));
    productContactBtn.setAttribute('aria-label', `Consultar ${product.name} por WhatsApp`);

    renderRelatedProducts(product);

    productModalOverlay.classList.add('product-modal-overlay--active');
    productModal.classList.add('product-modal--active');
    productModalOverlay.setAttribute('aria-hidden', 'false');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    productModalClose.focus();
  }

  function closeProductModal() {
    productModalOverlay.classList.remove('product-modal-overlay--active');
    productModal.classList.remove('product-modal--active');
    productModalOverlay.setAttribute('aria-hidden', 'true');
    productModal.setAttribute('aria-hidden', 'true');
    activeProduct = null;
    if (!cartSidebar.classList.contains('cart-sidebar--active') && !mobileMenu.classList.contains('mobile-menu--active')) {
      document.body.style.overflow = '';
    }
  }

  function clampQty(value) {
    const qty = Math.max(1, Math.min(10, Number(value) || 1));
    productQty.value = String(qty);
    return qty;
  }

  productModalClose.addEventListener('click', closeProductModal);
  productModalOverlay.addEventListener('click', closeProductModal);
  productQtyMinus.addEventListener('click', () => clampQty(Number(productQty.value) - 1));
  productQtyPlus.addEventListener('click', () => clampQty(Number(productQty.value) + 1));
  productQty.addEventListener('change', () => clampQty(productQty.value));

  productAddToCart.addEventListener('click', () => {
    if (!activeProduct) return;

    const size = productModalSize.value;
    const qty = clampQty(productQty.value);

    addToCart({
      id: activeProduct.id,
      name: activeProduct.name,
      price: activeProduct.price,
      img: activeProduct.image,
      size,
      qty
    });

    const label = qty > 1
      ? `${qty} × ${activeProduct.name} añadidos al carrito`
      : `${activeProduct.name} añadido al carrito`;

    showToast(label, {
      type: 'success',
      icon: '✓',
      actionLabel: 'Ver carrito',
      onAction: openCart
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.classList.contains('product-modal--active')) {
      closeProductModal();
    }
  });

  function showToast(message, options = {}) {
    const { type = 'success', icon = '✓', actionLabel, onAction } = options;
    let toast = document.querySelector('.toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <span class="toast__icon"></span>
        <span class="toast__text"></span>
      `;
      document.body.appendChild(toast);
    }

    toast.className = `toast toast--${type}`;
    toast.querySelector('.toast__icon').textContent = icon;
    toast.querySelector('.toast__text').textContent = message;

    const oldAction = toast.querySelector('.toast__action');
    if (oldAction) oldAction.remove();

    if (actionLabel && onAction) {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'toast__action';
      actionBtn.textContent = actionLabel;
      actionBtn.addEventListener('click', () => {
        onAction();
        toast.classList.remove('toast--show');
      });
      toast.appendChild(actionBtn);
    }

    if (toastTimer) clearTimeout(toastTimer);
    toast.classList.add('toast--show');
    toastTimer = setTimeout(() => toast.classList.remove('toast--show'), 3200);
  }

  document.getElementById('searchBtn').addEventListener('click', () => {
    showToast('Búsqueda disponible en la versión final', { type: 'success', icon: 'i' });
  });

  setupContactLinks();
  renderProducts();
  setupCategoryNavigation();
  renderCart();
});
