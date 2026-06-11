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

  const THUMB = 'assets/images/products/thumbs/';
  let cart = [
    { name: 'Pelele con Lazo', price: 15, img: THUMB + '01-pelele-lazo.jpg', size: '12 meses' },
    { name: 'Jesusito 3 piezas · Niños', price: 24.90, img: THUMB + '05-jesusito-ninos.jpg', size: '4 años' }
  ];

  const CATEGORY_HASHES = Object.keys(CATEGORIES);
  let activeCategory = null;
  let categoryShopReady = false;

  function formatPrice(price) {
    return `${price.toFixed(2).replace('.', ',')} €`;
  }

  function getContactUrl() {
    if (BRAND.whatsapp) {
      const text = encodeURIComponent(BRAND.whatsappMessage);
      return `https://wa.me/${BRAND.whatsapp}?text=${text}`;
    }
    return BRAND.instagramDm;
  }

  function setupContactLinks() {
    const contactUrl = getContactUrl();
    const whatsappBtn = document.getElementById('whatsappBtn');
    const footerContact = document.getElementById('footerContactBtn');
    if (whatsappBtn) {
      whatsappBtn.href = contactUrl;
      whatsappBtn.setAttribute('aria-label', BRAND.whatsapp ? 'Contactar por WhatsApp' : 'Contactar por Instagram');
    }
    if (footerContact) footerContact.href = contactUrl;
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

    return `
      <article class="${cardClass}" data-id="${product.id}">
        ${product.badge ? `<div class="product-card__badge ${badgeClass}">${product.badge}</div>` : ''}
        ${product.instagram ? '<span class="product-card__ig" aria-label="Foto de Instagram">IG</span>' : ''}
        <div class="product-card__img">
          <img src="${product.image}" alt="${product.name}" width="400" height="400" decoding="async" ${loading}>
          <button class="product-card__quick-add"
            data-name="${product.name}"
            data-price="${product.price}"
            data-img="${product.image}">+ Añadir</button>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__sizes">${product.sizes}</p>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(product.price)}</span>
            ${footerExtra}
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
    bindQuickAdd(grid);
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

    bindQuickAdd(grid);
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
    document.body.style.overflow = '';
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
    document.body.style.overflow = '';
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
          <p>Talla ${item.size}</p>
          <span class="cart-item__price">${formatPrice(item.price)}</span>
        </div>
        <button class="cart-item__remove" data-index="${i}" aria-label="Eliminar">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartBadge.textContent = cart.length;
    cartCount.textContent = `(${cart.length})`;
    cartSubtotal.textContent = formatPrice(total);

    cartItems.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index, 10), 1);
        renderCart();
        showToast('Producto eliminado del carrito');
      });
    });
  }

  function bindQuickAdd(root = document) {
    root.querySelectorAll('.product-card__quick-add').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { name, price, img } = btn.dataset;
        cart.push({ name, price: parseFloat(price), img, size: 'Por confirmar' });
        renderCart();
        showToast(`✓ ${name} añadido al carrito`);
        cartBadge.style.transform = 'scale(1.3)';
        setTimeout(() => { cartBadge.style.transform = ''; }, 300);
      });
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('toast--show');
    setTimeout(() => toast.classList.remove('toast--show'), 2500);
  }

  document.getElementById('searchBtn').addEventListener('click', () => {
    showToast('🔍 Búsqueda disponible en la versión final');
  });

  setupContactLinks();
  renderProducts();
  setupCategoryNavigation();
  renderCart();
});
