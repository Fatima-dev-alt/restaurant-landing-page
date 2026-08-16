/* ============================================
   EMBER & VINE — SCRIPT.JS
   Each feature is a separate function, called once
   from init() at the bottom of the file.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. PRELOADER ---------- */
  function initPreloader(){
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    });
  }

  /* ---------- 1. THEME TOGGLE (dark/light) ---------- */
  function initThemeToggle(){
    const toggle = document.getElementById('themeToggle');
    const saved = localStorageSafeGet('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      localStorageSafeSet('theme', next);
    });
  }
  // Small wrapper so the demo never crashes in sandboxes that block storage
  function localStorageSafeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function localStorageSafeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){ /* ignore */ } }

  /* ---------- 2. RESPONSIVE MOBILE MENU ---------- */
  function initMobileMenu(){
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- 3. STICKY NAVBAR + ACTIVE LINK ON SCROLL ---------- */
  function initScrollSpy(){
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = 'home';
      sections.forEach(sec => {
        const top = sec.offsetTop - 140;
        if (window.scrollY >= top) current = sec.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
      });
    });
  }

  /* ---------- 4. BUTTON SCROLL SHORTCUTS ---------- */
  function initScrollButtons(){
    const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('exploreMenuBtn').addEventListener('click', () => goTo('menu'));
    document.getElementById('discoverMoreBtn').addEventListener('click', () => goTo('menu'));
    document.getElementById('orderNowBtn').addEventListener('click', () => goTo('menu'));
    ['navBookBtn','heroBookBtn','reserveCtaBtn'].forEach(id => {
      document.getElementById(id).addEventListener('click', openReservationModal);
    });
  }

  /* ---------- 5. FEATURED MENU DATA + DYNAMIC RENDER + FILTER ---------- */
  const menuItems = [
    { name: 'Smoked Brisket Toast', desc: 'Sourdough, whipped fat, pickled onion', price: '$14', rating: '★★★★★', image: 'assets/images/pixzolo-photography-BiWb1Y8wpZk-unsplash.jpg',category:'breakfast' },
    { name: 'Charred Peach & Burrata', desc: 'Basil oil, honeycomb, sea salt', price: '$12', rating: '★★★★☆', image:'assets/images/janesca-Nu3IcDmYBV8-unsplash.jpg',category:'launch' },
    { name: 'Wood-Fired Margherita', desc: 'San Marzano, fior di latte, basil', price: '$18', rating: '★★★★★', image:'assets/images/chad-montano-MqT0asuoIcU-unsplash.jpg',category: 'dinner' },
    { name: 'Ember Grilled Ribeye', desc: '28-day aged, chimichurri, embers', price: '$34', rating: '★★★★★', image: 'assets/images/behrouz-sasani-RZoNMrC13KU-unsplash.jpg', category: 'dinner' },
    { name: 'Crispy Chicken Bao', desc: 'Sesame slaw, chili glaze', price: '$11', rating: '★★★★☆', icon: '🥟', category: 'fastfood' },
    { name: 'Stone Fruit Galette', desc: 'Flaky crust, vanilla mascarpone', price: '$9', rating: '★★★★★', icon: '🥧', category: 'desserts' },
    { name: 'Morning Shakshuka', desc: 'Slow-cooked peppers, feta, herb oil', price: '$13', rating: '★★★★☆', icon: '🍳', category: 'breakfast' },
    { name: 'Loaded Fire Fries', desc: 'Smoked cheddar, jalapeño, aioli', price: '$8', rating: '★★★★☆', icon: '🍟', category: 'fastfood' },
    { name: 'Dark Chocolate Torte', desc: 'Espresso crumb, sea salt caramel', price: '$10', rating: '★★★★★', icon: '🍫', category: 'desserts' },
  ];

  function renderMenu(filter = 'all'){
    const grid = document.getElementById('menuGrid');
    const items = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
    grid.innerHTML = items.map(item => `
      <div class="food-card reveal in-view">
        <div class="food-img"><img src="${item.image}" alt="${item.name}"></div>
        <div class="food-body">
          <div class="food-top">
            <h3>${item.name}</h3>
            <span class="food-price">${item.price}</span>
          </div>
          <p>${item.desc}</p>
          <span class="food-rating">${item.rating}</span>
        </div>
      </div>
    `).join('');
  }

  function initMenuFilter(){
    renderMenu('all');
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.filter);
      });
    });
  }

  /* ---------- 6. COUNTDOWN TIMER ---------- */
  function initCountdown(){
    // Counts down to the coming Saturday 00:00 (the weekend offer)
    function getTargetDate(){
      const now = new Date();
      const target = new Date(now);
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const daysUntilSaturday = (6 - day + 7) % 7 || 7;
      target.setDate(now.getDate() + daysUntilSaturday);
      target.setHours(0, 0, 0, 0);
      return target;
    }

    let targetDate = getTargetDate();

    function tick(){
      const now = new Date().getTime();
      let diff = targetDate.getTime() - now;

      if (diff <= 0){
        targetDate = getTargetDate();
        diff = targetDate.getTime() - now;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 7. GALLERY + LIGHTBOX ---------- */
  const galleryImages = ['🍕','🥩','🍝','🍷','🥗','🍰','🔥','🍳'];

  function initGallery(){
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = galleryImages.map((icon, i) =>
      `<div class="gallery-item reveal in-view" data-index="${i}">${icon}</div>`
    ).join('');

    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightboxContent');
    let currentIndex = 0;

    function open(index){
      currentIndex = index;
      content.textContent = galleryImages[currentIndex];
      lightbox.classList.add('open');
    }
    function close(){ lightbox.classList.remove('open'); }
    function next(){ currentIndex = (currentIndex + 1) % galleryImages.length; content.textContent = galleryImages[currentIndex]; }
    function prev(){ currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; content.textContent = galleryImages[currentIndex]; }

    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => open(Number(item.dataset.index)));
    });
    document.getElementById('lightboxClose').addEventListener('click', close);
    document.getElementById('lightboxNext').addEventListener('click', next);
    document.getElementById('lightboxPrev').addEventListener('click', prev);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ---------- 8. TESTIMONIAL SLIDER (auto + manual) ---------- */
  const testimonials = [
    { name: 'Maya R.', quote: 'The ribeye alone is worth the drive. Best fire-cooked food in the city, hands down.', rating: '★★★★★' },
    { name: 'Daniel K.', quote: 'Service is warm, the room smells incredible, and the weekend offer is unbeatable.', rating: '★★★★★' },
    { name: 'Priya S.', quote: 'Booked through the site in under a minute and the table was ready exactly on time.', rating: '★★★★☆' },
    { name: 'Omar F.', quote: 'Every dish tastes like someone actually cared about it. Rare these days.', rating: '★★★★★' },
  ];

  function initTestimonials(){
    const track = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('tDots');
    track.innerHTML = testimonials.map(t => `
      <div class="t-card">
        <div class="t-avatar">🧑‍🍳</div>
        <div class="t-rating">${t.rating}</div>
        <p class="t-quote">"${t.quote}"</p>
        <p class="t-name">${t.name}</p>
      </div>
    `).join('');
    dotsWrap.innerHTML = testimonials.map((_, i) => `<span class="t-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('');

    let index = 0;
    const dots = dotsWrap.querySelectorAll('.t-dot');

    function goTo(i){
      index = (i + testimonials.length) % testimonials.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    document.getElementById('tNext').addEventListener('click', () => goTo(index + 1));
    document.getElementById('tPrev').addEventListener('click', () => goTo(index - 1));
    dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.index))));

    let autoplay = setInterval(() => goTo(index + 1), 5000);
    const slider = document.querySelector('.testimonial-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(index + 1), 5000); });
  }

  /* ---------- 9. RESERVATION MODAL + VALIDATION ---------- */
  function openReservationModal(){
    document.getElementById('reservationModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeReservationModal(){
    document.getElementById('reservationModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  function initReservationModal(){
    document.getElementById('modalClose').addEventListener('click', closeReservationModal);
    document.getElementById('reservationModal').addEventListener('click', (e) => {
      if (e.target.id === 'reservationModal') closeReservationModal();
    });

    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const rules = [
        { id: 'resName', test: v => v.trim().length >= 2, msg: 'Please enter your full name.' },
        { id: 'resEmail', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
        { id: 'resPhone', test: v => /^[\d\s()+-]{7,}$/.test(v), msg: 'Enter a valid phone number.' },
        { id: 'resGuests', test: v => Number(v) >= 1 && Number(v) <= 20, msg: 'Guests must be between 1 and 20.' },
        { id: 'resDate', test: v => v.length > 0, msg: 'Please choose a date.' },
        { id: 'resTime', test: v => v.length > 0, msg: 'Please choose a time.' },
      ];

      let valid = true;
      rules.forEach(rule => {
        const field = document.getElementById(rule.id);
        const group = field.closest('.form-group');
        const ok = rule.test(field.value);
        group.classList.toggle('invalid', !ok);
        group.querySelector('.error-msg').textContent = rule.msg;
        if (!ok) valid = false;
      });

      if (!valid) return;

      document.getElementById('resSuccess').classList.add('show');
      form.reset();
      setTimeout(() => {
        document.getElementById('resSuccess').classList.remove('show');
        closeReservationModal();
      }, 1800);
    });
  }

  /* ---------- 10. CONTACT FORM VALIDATION ---------- */
  function initContactForm(){
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const rules = [
        { id: 'cName', test: v => v.trim().length >= 2, msg: 'Please enter your name.' },
        { id: 'cEmail', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
        { id: 'cMessage', test: v => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' },
      ];

      let valid = true;
      rules.forEach(rule => {
        const field = document.getElementById(rule.id);
        const group = field.closest('.form-group');
        const ok = rule.test(field.value);
        group.classList.toggle('invalid', !ok);
        group.querySelector('.error-msg').textContent = rule.msg;
        if (!ok) valid = false;
      });

      if (!valid) return;

      document.getElementById('contactSuccess').classList.add('show');
      form.reset();
      setTimeout(() => document.getElementById('contactSuccess').classList.remove('show'), 2500);
    });
  }

  /* ---------- 11. SCROLL-TO-TOP BUTTON ---------- */
  function initScrollTop(){
    const btn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- 12. SCROLL REVEAL ANIMATIONS ---------- */
  function initScrollReveal(){
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(item => observer.observe(item));
  }

  /* ---------- 13. ANIMATED COUNTERS (bonus) ---------- */
  function initCounters(){
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target){ current = target; clearInterval(timer); }
          el.textContent = current;
        }, 25);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));
  }

  /* ---------- 14. FOOTER YEAR ---------- */
  function initFooterYear(){
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  /* ---------- INIT ALL ---------- */
  initPreloader();
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();
  initScrollButtons();
  initMenuFilter();
  initCountdown();
  initGallery();
  initTestimonials();
  initReservationModal();
  initContactForm();
  initScrollTop();
  initScrollReveal();
  initCounters();
  initFooterYear();
});
