/**
 * CICATRIZA+ — SCRIPT.JS
 * Handles: Navigation, animations, app screens,
 * form validation, search/filter, and interactions
 */

/* ════════════════════════════════════════════════
   LANDING PAGE — NAVBAR
════════════════════════════════════════════════ */

const navbar  = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Sticky navbar scroll shadow
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
});

// Mobile hamburger menu toggle
function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }
});

// Smooth scroll to section
function smoothScroll(event, id) {
  if (event) event.preventDefault();
  // Close mobile menu if open
  if (navLinks) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
  const el = document.getElementById(id);
  if (el) {
    const offset = 80; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function scrollToTop(event) {
  if (event) event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ════════════════════════════════════════════════
   LANDING <-> APP PAGE SWITCHING
════════════════════════════════════════════════ */

const landingPage = document.getElementById('landing-page');
const appPage     = document.getElementById('app-page');

/**
 * Show the full app and navigate to a specific screen.
 * @param {string} screenId - The ID of the app screen to show
 */
function showApp(screenId) {
  landingPage.style.display = 'none';
  appPage.style.display = 'block';
  document.body.style.overflow = 'auto';
  goToScreen(screenId);
  window.scrollTo(0, 0);
}

/**
 * Return to the landing page
 */
function backToLanding() {
  appPage.style.display = 'none';
  landingPage.style.display = 'block';
  window.scrollTo(0, 0);
}


/* ════════════════════════════════════════════════
   APP SCREEN NAVIGATION
════════════════════════════════════════════════ */

const screenNavBtns = document.querySelectorAll('.app-nav-btn');

/**
 * Navigate to a specific app screen
 * @param {string} screenId
 */
function goToScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.app-screen').forEach(s => {
    s.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Update nav button states
  screenNavBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });
}

// Nav button click handlers
screenNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    goToScreen(btn.dataset.screen);
  });
});

// Set today's date on dashboard
(function setDashboardDate() {
  const dateEl = document.getElementById('dashboard-date');
  if (!dateEl) return;
  const now = new Date();
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const pending = 3;
  dateEl.textContent = `${weekdays[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()} — você tem ${pending} avaliações pendentes`;
})();

/* Patient tab switching (form screen) */
function switchAppTab(clickedTab, index) {
  const tabContainer = clickedTab.closest('.app-tabs');
  if (!tabContainer) return;
  tabContainer.querySelectorAll('.app-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}


/* ════════════════════════════════════════════════
   PATIENT SEARCH & FILTER
════════════════════════════════════════════════ */

function filterPatients() {
  const searchInput  = document.getElementById('patient-search');
  const statusFilter = document.getElementById('status-filter');
  if (!searchInput || !statusFilter) return;

  const query  = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value.toLowerCase();

  const rows = document.querySelectorAll('#patients-tbody tr');
  rows.forEach(row => {
    const name   = row.cells[0]?.textContent.toLowerCase() || '';
    const cpf    = row.cells[1]?.textContent.toLowerCase() || '';
    const rowSt  = row.cells[4]?.textContent.toLowerCase() || '';

    const matchesSearch = !query || name.includes(query) || cpf.includes(query);
    const matchesStatus = !status || rowSt.includes(status.toLowerCase());

    row.style.display = matchesSearch && matchesStatus ? '' : 'none';
  });
}


/* ════════════════════════════════════════════════
   FORM INTERACTIONS
════════════════════════════════════════════════ */

/** Save assessment form (simulated) */
function saveEvaluation() {
  const successEl = document.getElementById('eval-success');
  if (!successEl) return;

  successEl.classList.add('visible');
  setTimeout(() => successEl.classList.remove('visible'), 4000);
}

/** Save evolution report (simulated) */
function saveReport() {
  const successEl = document.getElementById('report-success');
  if (!successEl) return;

  // Get form values to add to timeline (bonus interaction)
  const dateInput = document.querySelector('#s-evolution .form-group input[type="date"]');
  const evolSelect = document.querySelector('#s-evolution .form-group select');
  const obsTextarea = document.querySelectorAll('#s-evolution textarea')[1];
  const areaInput = document.querySelector('#s-evolution input[type="number"]');

  const date   = dateInput?.value ? formatDate(dateInput.value) : formatDate(new Date().toISOString().slice(0,10));
  const evol   = evolSelect?.value || 'Sem alteração';
  const area   = areaInput?.value ? `Área: ${areaInput.value}cm² · ` : '';
  const obs    = obsTextarea?.value?.trim() || 'Relatório registrado.';
  const dotColor = getDotColor(evol);

  addTimelineEntry(date, evol, area + obs, dotColor);

  successEl.classList.add('visible');
  setTimeout(() => successEl.classList.remove('visible'), 4000);
}

function getDotColor(evolText) {
  if (/significativa/.test(evolText) && /melhora/i.test(evolText)) return 'green-tl';
  if (/leve/.test(evolText) && /melhora/i.test(evolText))         return 'green-tl';
  if (/piora/i.test(evolText))                                     return 'red-tl';
  if (/alteração/i.test(evolText))                                 return 'amber-tl';
  return 'teal-tl';
}

function addTimelineEntry(date, status, text, dotClass) {
  const timeline = document.getElementById('evolution-timeline');
  if (!timeline) return;

  const statusClass = getStatusClass(status);
  const entry = document.createElement('div');
  entry.className = 'tl-item';
  entry.innerHTML = `
    <div class="tl-left">
      <div class="tl-dot ${dotClass}"></div>
      <div class="tl-line"></div>
    </div>
    <div class="tl-body">
      <div class="tl-meta">${date} — <span class="tl-status ${statusClass}">${status}</span></div>
      <div class="tl-text">${text}</div>
    </div>
  `;
  // Add before first entry (newest first)
  timeline.insertBefore(entry, timeline.firstChild);
  entry.style.animation = 'slide-in .4s ease';
}

function getStatusClass(status) {
  if (/piora/i.test(status))           return 'critical-label';
  if (/melhora/i.test(status))         return 'green-label';
  if (/alteração/i.test(status))       return 'amber-label';
  return 'teal-label';
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}


/* ════════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════════ */

function submitContact() {
  const name    = document.getElementById('contact-name')?.value.trim();
  const email   = document.getElementById('contact-email')?.value.trim();
  const subject = document.getElementById('contact-subject')?.value;
  const message = document.getElementById('contact-message')?.value.trim();
  const success = document.getElementById('contact-success');

  // Basic validation
  if (!name || !email || !subject || !message) {
    shakeForm();
    showFormError('Por favor, preencha todos os campos.');
    return;
  }
  if (!isValidEmail(email)) {
    showFormError('Por favor, insira um e-mail válido.');
    return;
  }

  // Simulate sending
  const btn = document.querySelector('.btn-form-submit');
  if (btn) {
    btn.textContent = 'Enviando...';
    btn.style.opacity = '.7';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (success) {
      success.classList.add('visible');
    }
    // Clear form
    ['contact-name','contact-email','contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const sel = document.getElementById('contact-subject');
    if (sel) sel.selectedIndex = 0;

    if (btn) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Enviar mensagem
      `;
      btn.style.opacity = '1';
      btn.disabled = false;
    }
    setTimeout(() => success?.classList.remove('visible'), 6000);
  }, 1200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(msg) {
  // Simple shake on invalid
  const form = document.querySelector('.contact-form');
  if (form) {
    form.style.animation = 'none';
    void form.offsetWidth;
    form.style.animation = 'shake .4s ease';
  }
  console.warn('Form error:', msg);
}

function shakeForm() {
  // CSS shake is handled by showFormError
}


/* ════════════════════════════════════════════════
   PHOTO UPLOAD (UI simulation)
════════════════════════════════════════════════ */

function triggerUpload() {
  document.getElementById('photo-input')?.click();
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const grid = document.getElementById('photo-grid');
    if (!grid) return;

    // Get today's date
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

    // Create new photo thumb
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    thumb.style.background = `url(${e.target.result}) center/cover no-repeat`;
    thumb.innerHTML = `<div class="photo-date">${dateStr} (nova)</div>`;

    // Insert before the upload button
    const uploadBtn = grid.querySelector('.upload-thumb');
    if (uploadBtn) {
      grid.insertBefore(thumb, uploadBtn);
    } else {
      grid.appendChild(thumb);
    }

    // Show brief success toast
    showToast('Foto adicionada com sucesso!');
  };
  reader.readAsDataURL(file);

  // Reset input so same file can be re-selected
  event.target.value = '';
}


/* ════════════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════════════ */

function showToast(message, type = 'success') {
  // Remove existing toast
  document.querySelectorAll('.cicatriza-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'cicatriza-toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    ${message}
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    background: '#15803d',
    color: 'white',
    padding: '.75rem 1.1rem',
    borderRadius: '10px',
    fontSize: '.875rem',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: '9999',
    boxShadow: '0 8px 30px rgba(0,0,0,.2)',
    animation: 'fadeUp .3s ease forwards',
  });
  toast.querySelector('svg').style.cssText = 'width:18px;height:18px;flex-shrink:0';

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn .3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}


/* ════════════════════════════════════════════════
   SCROLL ANIMATIONS (Intersection Observer)
════════════════════════════════════════════════ */

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children if multiple
          const delay = entry.target.dataset.delay || (i * 80);
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach((el, i) => {
    el.dataset.delay = el.dataset.delay || (i % 4) * 80;
    observer.observe(el);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeroCounters();
  initPricingToggle();
});


/* ════════════════════════════════════════════════
   ANIMATED COUNTERS (hero stats)
════════════════════════════════════════════════ */

function initHeroCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const rawText = el.textContent;
  // Parse the number (handle "+" and "mil+")
  let target, suffix = '';
  if (/mil\+/.test(rawText)) {
    const num = parseInt(rawText);
    target = num * 1000;
    suffix = '+';
    el.dataset.format = 'mil';
  } else if (/\+/.test(rawText)) {
    target = parseInt(rawText.replace(/\D/g, ''));
    suffix = '+';
  } else if (/%/.test(rawText)) {
    target = parseInt(rawText);
    suffix = '%';
  } else {
    return; // Don't animate non-numeric
  }

  const duration = 1400;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(startVal + eased * (target - startVal));

    if (el.dataset.format === 'mil') {
      el.textContent = (current / 1000).toFixed(0) + ' mil' + suffix;
    } else {
      el.textContent = current.toLocaleString('pt-BR') + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = rawText; // Ensure final value is exact
  }

  requestAnimationFrame(update);
}


/* ════════════════════════════════════════════════
   PRICING TOGGLE (annual/monthly) — optional UX
════════════════════════════════════════════════ */

function initPricingToggle() {
  // If a toggle element is present, wire it up
  const toggle = document.getElementById('billing-toggle');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    const amounts  = document.querySelectorAll('.pricing-amount');
    const baseAnnual = [0, 71, null];
    const baseMonthly = [0, 89, null];

    amounts.forEach((el, i) => {
      const val = isAnnual ? baseAnnual[i] : baseMonthly[i];
      if (val !== null) {
        el.textContent = val;
      }
    });
  });
}


/* ════════════════════════════════════════════════
   ACTIVE NAV LINK on Scroll
════════════════════════════════════════════════ */

(function initActiveNav() {
  const sections = ['features', 'how-it-works', 'testimonials', 'pricing', 'contact'];
  const links    = document.querySelectorAll('.nav-link');

  if (!links.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = id;
        }
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.style.color = href === current ? 'var(--teal)' : '';
      link.style.background = href === current ? 'var(--teal-50)' : '';
    });
  }, { passive: true });
})();


/* ════════════════════════════════════════════════
   KEYBOARD ACCESSIBILITY
════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  // Close mobile menu on Escape
  if (e.key === 'Escape') {
    if (navLinks?.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
    }
  }
});


/* ════════════════════════════════════════════════
   CARD HOVER TILT EFFECT (subtle 3D)
════════════════════════════════════════════════ */

document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease, box-shadow .2s ease, border-color .2s ease';
  });
});


/* ════════════════════════════════════════════════
   GLOBAL INIT
════════════════════════════════════════════════ */

// Log app info
console.info('%cCicatriza+', 'font-family:sans-serif;font-size:20px;font-weight:bold;color:#0D9488');
console.info('%cSistema de gestão de feridas • v1.0.0', 'font-family:sans-serif;font-size:12px;color:#64748b');