(() => {
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
    image.hidden = true;
    const fallback = document.createElement('span');
    fallback.className = 'image-fallback';
    fallback.textContent = 'Photo momentanément indisponible';
    fallback.setAttribute('role', 'status');
    image.insertAdjacentElement('afterend', fallback);
  }, { once: true }));

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-label', expanded ? 'Ouvrir le menu' : 'Fermer le menu');
    nav?.classList.toggle('open', !expanded);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Ouvrir le menu');
  }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !nav?.classList.contains('open')) return;
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Ouvrir le menu');
    menu?.focus();
  });

  const filters = [...document.querySelectorAll('.filter')];
  const products = [...document.querySelectorAll('.product-card')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    products.forEach(card => { card.hidden = filter !== 'all' && card.dataset.model !== filter; });
  }));

  // Catalogue client: remplacer les valeurs nulles après confirmation par RedPhone.
  const productData = {
    'iphone-16': { title: 'iPhone 16', image: 'assets/images/iphone-16.jpg', alt: 'Vue arrière de l’iPhone 16 bleu outremer', message: 'iPhone 16', storage: null, priceMad: null, color: null, condition: null, availability: null },
    'iphone-15': { title: 'iPhone 15', image: 'assets/images/iphone-15.jpg', alt: 'iPhone 15 photographié de face et de dos', message: 'iPhone 15', storage: null, priceMad: null, color: null, condition: null, availability: null },
    'iphone-14': { title: 'iPhone 14', image: 'assets/images/iphone-14.jpg', alt: 'iPhone 14 présenté en boutique', message: 'iPhone 14', storage: null, priceMad: null, color: null, condition: null, availability: null },
    'iphone-13-pro': { title: 'iPhone 13 Pro', image: 'assets/images/iphone-13-pro.jpg', alt: 'Gros plan sur l’écran d’un iPhone 13 Pro', message: 'iPhone 13 Pro', storage: null, priceMad: null, color: null, condition: null, availability: null }
  };
  document.querySelectorAll('.product-card').forEach(card => {
    const key = card.querySelector('.detail-button')?.dataset.product;
    const product = productData[key];
    if (!product) return;
    const storage = card.querySelector('[data-field="storage"]');
    const price = card.querySelector('[data-field="price"]');
    if (storage) storage.textContent = product.storage || 'Stockage à confirmer';
    if (price) price.textContent = product.priceMad == null ? 'Prix à confirmer' : `${Number(product.priceMad).toLocaleString('fr-MA')} MAD`;
  });
  const dialog = document.querySelector('#productDialog');
  const dialogTitle = document.querySelector('#dialogTitle');
  const dialogImage = document.querySelector('#dialogImage');
  const dialogWhatsApp = document.querySelector('#dialogWhatsApp');
  let lastProductButton = null;
  document.querySelectorAll('.detail-button').forEach(button => button.addEventListener('click', () => {
    const product = productData[button.dataset.product];
    if (!product || !dialog || !dialogTitle || !dialogImage || !dialogWhatsApp) return;
    dialogTitle.textContent = product.title;
    lastProductButton = button;
    dialogImage.src = product.image;
    dialogImage.alt = product.alt;
    const capacityLine = dialog.querySelector('[data-detail="storage"]');
    const priceLine = dialog.querySelector('[data-detail="price"]');
    if (capacityLine) capacityLine.textContent = product.storage || 'À confirmer en boutique';
    if (priceLine) priceLine.textContent = product.priceMad == null ? 'À demander à l’équipe' : `${Number(product.priceMad).toLocaleString('fr-MA')} MAD`;
    for (const field of ['color', 'condition', 'availability']) {
      const detail = dialog.querySelector(`[data-detail="${field}"]`);
      if (detail) detail.textContent = product[field] || 'À confirmer en boutique';
    }
    dialogWhatsApp.href = `https://wa.me/212679275850?text=${encodeURIComponent(`Bonjour RedPhone Marrakech, je souhaite connaître le prix, la disponibilité, les capacités et les coloris proposés pour le ${product.message}.`)}`;
    dialog.showModal();
  }));
  dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => lastProductButton?.focus());

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    reveals.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      observer.observe(element);
    });
  } else reveals.forEach(element => element.classList.add('visible'));

  const device = document.querySelector('[data-tilt]');
  if (device && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const animateTilt = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      device.style.transform = `translate(-50%,-50%) rotateY(${-27 + currentX}deg) rotateX(${7 + currentY}deg) rotateZ(-9deg)`;
      if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) frame = requestAnimationFrame(animateTilt);
      else frame = 0;
    };
    document.querySelector('.hero-stage')?.addEventListener('pointermove', event => {
      const bounds = event.currentTarget.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      targetY = -((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
      if (!frame) frame = requestAnimationFrame(animateTilt);
    }, { passive: true });
    document.querySelector('.hero-stage')?.addEventListener('pointerleave', () => {
      targetX = 0; targetY = 0;
      if (!frame) frame = requestAnimationFrame(animateTilt);
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
