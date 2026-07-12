/* =========================================================
   AURELIA — Restaurant Template Script
   Vanilla JavaScript, no dependencies.
   Sections:
   1. Preloader
   2. Sticky Header + Active Nav Highlight
   3. Mobile Navigation Toggle
   4. Smooth Scroll (for browsers needing JS fallback)
   5. Light / Dark Mode Toggle
   6. Menu Category Tabs
   7. Scroll Reveal Animations
   8. Scroll To Top Button
   9. Reservation Form Validation
   10. Newsletter Form
   11. Footer Year
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ 1. PRELOADER ============ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 400);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader && preloader.classList.add('hidden'), 3000);

  /* ============ 2. STICKY HEADER + ACTIVE NAV HIGHLIGHT ============ */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function handleScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function handleActiveNav() {
    const scrollPos = window.scrollY + 140;
    let currentId = sections[0] ? sections[0].id : '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleScrollHeader();
    handleActiveNav();
    toggleScrollTopBtn();
  });

  handleScrollHeader();
  handleActiveNav();

  /* ============ 3. MOBILE NAVIGATION TOGGLE ============ */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ============ 4. SMOOTH SCROLL (fallback for anchor links) ============ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 84;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  /* ============ 5. LIGHT / DARK MODE TOGGLE ============ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const THEME_KEY = 'aurelia-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      document.body.classList.remove('light-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }

  // Note: no localStorage available in all sandboxed contexts, so we
  // guard with try/catch and fall back gracefully to session-only state.
  let savedTheme = null;
  try {
    savedTheme = window.localStorage.getItem(THEME_KEY);
  } catch (err) {
    savedTheme = null;
  }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark' : 'light';
    applyTheme(newTheme);
    try {
      window.localStorage.setItem(THEME_KEY, newTheme);
    } catch (err) {
      /* storage unavailable — theme still applies for this session */
    }
  });

  /* ============ 6. MENU CATEGORY TABS ============ */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      menuTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      menuPanels.forEach((panel) => {
        if (panel.id === target) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });

  /* ============ 7. SCROLL REVEAL ANIMATIONS ============ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ============ 8. SCROLL TO TOP BUTTON ============ */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function toggleScrollTopBtn() {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============ 9. RESERVATION FORM VALIDATION ============ */
  const reservationForm = document.getElementById('reservationForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    resName: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    resEmail: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address.',
    resPhone: (value) => /^[\d()+\-.\s]{7,}$/.test(value) || 'Please enter a valid phone number.',
    resGuests: (value) => value.trim().length > 0 || 'Please select the number of guests.',
    resDate: (value) => value.trim().length > 0 || 'Please choose a date.',
    resTime: (value) => value.trim().length > 0 || 'Please choose a time.',
  };

  function validateField(field) {
    const rule = validators[field.id];
    if (!rule) return true;

    const result = rule(field.value);
    const errorEl = document.getElementById(`err-${field.id}`);
    const group = field.closest('.form-group');

    if (result === true) {
      if (errorEl) errorEl.textContent = '';
      if (group) group.classList.remove('invalid');
      return true;
    }

    if (errorEl) errorEl.textContent = result;
    if (group) group.classList.add('invalid');
    return false;
  }

  if (reservationForm) {
    // Prevent booking a date in the past
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    Object.keys(validators).forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('blur', () => validateField(field));
      }
    });

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      Object.keys(validators).forEach((id) => {
        const field = document.getElementById(id);
        if (field && !validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        formSuccess.textContent = '';
        const firstInvalid = reservationForm.querySelector('.invalid input, .invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = document.getElementById('resName').value.trim();
      formSuccess.textContent = `Thank you, ${name}! Your reservation request has been received — we'll confirm by email shortly.`;
      reservationForm.reset();

      setTimeout(() => {
        formSuccess.textContent = '';
      }, 8000);
    });
  }

  /* ============ 10. NEWSLETTER FORM ============ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailField = document.getElementById('newsletterEmail');
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);

      if (!isValidEmail) {
        newsletterSuccess.style.color = '#e07a74';
        newsletterSuccess.textContent = 'Please enter a valid email address.';
        return;
      }

      newsletterSuccess.style.color = '';
      newsletterSuccess.textContent = "You're subscribed! Welcome to the Aurelia table.";
      newsletterForm.reset();

      setTimeout(() => {
        newsletterSuccess.textContent = '';
      }, 6000);
    });
  }

  /* ============ 11. FOOTER YEAR ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
