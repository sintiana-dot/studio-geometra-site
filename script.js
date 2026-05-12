/* ══════════════════════════════════════════
   STUDIO GEOTOGNOLO — script.js
   Shared scripts for all pages
   ══════════════════════════════════════════ */

// ── Header scroll effect ──
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ── Mobile nav toggle ──
const toggle = document.getElementById('navToggle');
const mobile = document.getElementById('navMobile');
if (toggle && mobile) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll reveal with stagger ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   PORTFOLIO — Adaptive carousel
   - data-count="0" → placeholder grafico
   - data-count="1" → immagine singola
   - data-count="N" → carosello con N foto
   - data-fit="cover"   → riempie tutta la card (per foto omogenee)
   - data-fit="contain" → mostra foto intera (per foto miste/orizzontali)
   ══════════════════════════════════════════ */

(function initPortfolio() {
  const items = document.querySelectorAll('.portfolio-item[data-folder]');
  if (!items.length) return;

  items.forEach((item, index) => {
    const folder = item.dataset.folder;
    const count = parseInt(item.dataset.count, 10) || 0;
    const fit = item.dataset.fit || 'cover'; // 'cover' o 'contain'
    const media = item.querySelector('.portfolio-media');
    if (!media) return;

    // Aggiungo classe sulla card per stile contain
    if (fit === 'contain') {
      item.classList.add('fit-contain');
    }

    // ── Caso 0: nessuna foto → placeholder grafico ──
    if (count === 0) {
      media.innerHTML = `
        <div class="portfolio-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
          <span>Immagine</span>
        </div>`;
      return;
    }

    // ── Caso 1: una sola foto → immagine statica ──
    if (count === 1) {
      const title = item.querySelector('h3')?.textContent || 'Progetto';
      media.innerHTML = `<img src="img/portfolio/${folder}/01.jpg" alt="${title}" class="portfolio-img" loading="lazy">`;
      return;
    }

    // ── Caso 2+: carosello ──
    const title = item.querySelector('h3')?.textContent || 'Progetto';
    let slides = '';
    let dots = '';
    for (let i = 1; i <= count; i++) {
      const n = String(i).padStart(2, '0');
      slides += `<div class="carousel-slide"><img src="img/portfolio/${folder}/${n}.jpg" alt="${title} – foto ${i}" loading="lazy"></div>`;
      dots += `<button class="carousel-dot${i === 1 ? ' active' : ''}" data-idx="${i - 1}" aria-label="Vai alla foto ${i}"></button>`;
    }

    media.innerHTML = `
      <div class="carousel" data-current="0" data-total="${count}">
        <div class="carousel-track" style="width: ${count * 100}%; transform: translateX(0%);">
          ${slides}
        </div>
        <button class="carousel-arrow carousel-prev" aria-label="Foto precedente">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="carousel-arrow carousel-next" aria-label="Foto successiva">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div class="carousel-counter">1 / ${count}</div>
        <div class="carousel-dots">${dots}</div>
      </div>`;

    // ── Logica navigazione ──
    const carousel = media.querySelector('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const allDots = carousel.querySelectorAll('.carousel-dot');
    const counter = carousel.querySelector('.carousel-counter');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const total = count;

    const goTo = (n) => {
      const idx = (n + total) % total;
      carousel.dataset.current = idx;
      track.style.transform = `translateX(-${idx * (100 / total)}%)`;
      allDots.forEach((d, i) => d.classList.toggle('active', i === idx));
      counter.textContent = `${idx + 1} / ${total}`;
    };

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(parseInt(carousel.dataset.current, 10) - 1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(parseInt(carousel.dataset.current, 10) + 1);
    });
    allDots.forEach((d) => {
      d.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(parseInt(d.dataset.idx, 10));
      });
    });

    // ── Swipe touch su mobile ──
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goTo(parseInt(carousel.dataset.current, 10) + (diff > 0 ? 1 : -1));
      }
    }, { passive: true });
  });

  // ── Stagger reveal animation ──
  items.forEach((el, i) => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(el);
  });
})();
