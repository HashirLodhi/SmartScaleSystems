/* Component Loader - Loads shared nav and footer */
(function () {
  'use strict';

  async function loadComponent(elementId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
      const html = await response.text();
      document.getElementById(elementId).innerHTML = html;
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
    }
  }

  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      }
    });

    // Handle services dropdown active state
    const servicesPages = [
      'service-ai-model-training',
      'service-ai-automation',
      'service-computer-vision',
      'service-nlp',
      'service-llm',
      'service-data-annotation',
      'service-ai-training-data',
      'service-custom',
      'ai-agency-pakistan',
      'ai-services-pakistan',
      'services'
    ];
    const dropBtn = document.getElementById('servicesDropBtn');
    if (dropBtn && servicesPages.includes(currentPage)) {
      dropBtn.classList.add('active');
    }
  }

  function initNavAnimations() {
    const nav = document.getElementById('nav');
    if (!nav || nav.dataset.gsapReady === 'true' || !window.gsap) return;

    nav.dataset.gsapReady = 'true';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const logo = nav.querySelector('.nav-logo');
    const tabs = nav.querySelectorAll('.nav-links > .nav-link, .nav-links > .nav-dropdown-wrap, .nav-links > .nav-cta');
    const interactiveTabs = nav.querySelectorAll('.nav-links > a, .nav-dropdown-trigger');
    const dropdownButton = nav.querySelector('#servicesDropBtn');
    const dropdownItems = nav.querySelectorAll('.dropdown-item');
    const hamburger = nav.querySelector('#navHamburger');
    const mobileItems = nav.querySelectorAll('.nav-links > a, .nav-links > .nav-dropdown-wrap');

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro
      .fromTo(nav.querySelector('.nav-inner'),
        { autoAlpha: 0, y: -24, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 })
      .fromTo(logo,
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, duration: 0.7 }, 0.12)
      .fromTo(tabs,
        { autoAlpha: 0, y: -14 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.065 }, 0.2);

    interactiveTabs.forEach((tab) => {
      tab.addEventListener('mouseenter', () => {
        gsap.to(tab, { y: -3, scale: 1.035, duration: 0.28, ease: 'power3.out', overwrite: 'auto' });
      });
      tab.addEventListener('mouseleave', () => {
        gsap.to(tab, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
      });
      tab.addEventListener('focus', () => {
        gsap.to(tab, { y: -2, scale: 1.025, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
      });
      tab.addEventListener('blur', () => {
        gsap.to(tab, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    const revealDropdown = () => {
      if (dropdownButton?.getAttribute('aria-expanded') !== 'true') return;
      gsap.fromTo(dropdownItems,
        { autoAlpha: 0, y: 12, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.035, ease: 'power3.out', overwrite: true });
    };

    if (dropdownButton) {
      new MutationObserver(revealDropdown).observe(dropdownButton, {
        attributes: true,
        attributeFilter: ['aria-expanded']
      });
    }

    hamburger?.addEventListener('click', () => {
      if (hamburger.getAttribute('aria-expanded') !== 'true') return;
      gsap.fromTo(mobileItems,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', overwrite: true });
    });
  }

  async function initComponents() {
    await Promise.all([
      loadComponent('nav-placeholder', '/src/components/nav.html?v=20260707-transparent-logo'),
      loadComponent('footer-placeholder', '/src/components/footer.html?v=20260707-transparent-logo')
    ]);

    setActiveNavLink();

    // Re-initialize nav.js functionality after nav is loaded
    if (typeof initNav === 'function') {
      initNav();
    }

    initNavAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
