/* ============================================================
   SMART SCALE SYSTEMS — SHARED NAVIGATION & SCROLL JS
   ============================================================ */

function initNav() {
  'use strict';

  /* ── ELEMENTS ──────────────────────────────────────────── */
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  const dropBtn   = document.getElementById('servicesDropBtn');
  const dropdown  = document.getElementById('servicesDropdown');

  if (!nav) return;

  /* ── NAV SCROLL EFFECT ─────────────────────────────────── */
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── HAMBURGER MENU ────────────────────────────────────── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── SERVICES DROPDOWN ─────────────────────────────────── */
  if (dropBtn && dropdown) {
    // Desktop: hover with delay
    const dropWrap = dropBtn.closest('.nav-dropdown-wrap');
    let closeTimeout = null;

    dropWrap.addEventListener('mouseenter', function () {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
      }
      dropdown.classList.add('open');
      dropBtn.setAttribute('aria-expanded', 'true');
    });

    dropWrap.addEventListener('mouseleave', function () {
      closeTimeout = setTimeout(function () {
        dropdown.classList.remove('open');
        dropBtn.setAttribute('aria-expanded', 'false');
      }, 300);
    });

    // Click and keyboard activation toggle the dropdown on every viewport.
    dropBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close dropdown on outside click
    document.addEventListener('click', function (e) {
      if (!dropWrap.contains(e.target)) {
        dropdown.classList.remove('open');
        dropBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* Auto-initialize if nav already exists in DOM */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}

// Export for dynamic loading
window.initNav = initNav;
