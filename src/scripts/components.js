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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
