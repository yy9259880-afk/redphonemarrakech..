// RedPhone Marrakech — interactions de la page
const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  });
});

const searchInput = document.querySelector('#searchInput');
const filterButtons = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.product-card')];
const noResults = document.querySelector('#noResults');
let activeFilter = 'all';

function filterProducts() {
  const query = (searchInput?.value || '').trim().toLocaleLowerCase('fr');
  let visibleCount = 0;
  cards.forEach(card => {
    const matchesText = card.dataset.name.toLocaleLowerCase('fr').includes(query);
    const matchesType = activeFilter === 'all' || card.dataset.type === activeFilter;
    const visible = matchesText && matchesType;
    card.hidden = !visible;
    if (visible) visibleCount++;
  });
  if (noResults) noResults.hidden = visibleCount !== 0;
}
searchInput?.addEventListener('input', filterProducts);
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  filterProducts();
}));

// Apparition progressive des sections au défilement.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Inclinaison légère du téléphone sur ordinateur.
const heroVisual = document.querySelector('#heroVisual');
const phoneStage = document.querySelector('.phone-stage');
if (heroVisual && phoneStage && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVisual.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    phoneStage.style.animationPlayState = 'paused';
    phoneStage.style.transform = `translateY(-4px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    phoneStage.style.transform = '';
    phoneStage.style.animationPlayState = 'running';
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
