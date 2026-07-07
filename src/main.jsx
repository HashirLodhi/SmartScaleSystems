import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/style.css';
import './styles/carousel.css';
import navHtml from './components/nav.html?raw';
import footerHtml from './components/footer.html?raw';
import homeHtml from './pages/index.html?raw';
import servicesHtml from './pages/services.html?raw';
import teamHtml from './pages/team.html?raw';
import careersHtml from './pages/careers.html?raw';
import testimonialsHtml from './pages/testimonials.html?raw';
import contactHtml from './pages/contact.html?raw';
import aiAgencyPakistanHtml from './pages/ai-agency-pakistan.html?raw';
import aiServicesPakistanHtml from './pages/ai-services-pakistan.html?raw';
import modelTrainingHtml from './pages/service-ai-model-training.html?raw';
import automationHtml from './pages/service-ai-automation.html?raw';
import computerVisionHtml from './pages/service-computer-vision.html?raw';
import nlpHtml from './pages/service-nlp.html?raw';
import llmHtml from './pages/service-llm.html?raw';
import dataAnnotationHtml from './pages/service-data-annotation.html?raw';
import trainingDataHtml from './pages/service-ai-training-data.html?raw';
import customServiceHtml from './pages/service-custom.html?raw';
import privacyHtml from './pages/privacy-policy.html?raw';
import termsHtml from './pages/terms-of-service.html?raw';

gsap.registerPlugin(ScrollTrigger);

const pages = {
  '/': homeHtml,
  '/index': homeHtml,
  '/index.html': homeHtml,
  '/services': servicesHtml,
  '/services.html': servicesHtml,
  '/team': teamHtml,
  '/team.html': teamHtml,
  '/careers': careersHtml,
  '/careers.html': careersHtml,
  '/testimonials': testimonialsHtml,
  '/testimonials.html': testimonialsHtml,
  '/contact': contactHtml,
  '/contact.html': contactHtml,
  '/ai-agency-pakistan': aiAgencyPakistanHtml,
  '/ai-agency-pakistan.html': aiAgencyPakistanHtml,
  '/ai-services-pakistan': aiServicesPakistanHtml,
  '/ai-services-pakistan.html': aiServicesPakistanHtml,
  '/service-ai-model-training': modelTrainingHtml,
  '/service-ai-model-training.html': modelTrainingHtml,
  '/service-ai-automation': automationHtml,
  '/service-ai-automation.html': automationHtml,
  '/service-computer-vision': computerVisionHtml,
  '/service-computer-vision.html': computerVisionHtml,
  '/service-nlp': nlpHtml,
  '/service-nlp.html': nlpHtml,
  '/service-llm': llmHtml,
  '/service-llm.html': llmHtml,
  '/service-data-annotation': dataAnnotationHtml,
  '/service-data-annotation.html': dataAnnotationHtml,
  '/service-ai-training-data': trainingDataHtml,
  '/service-ai-training-data.html': trainingDataHtml,
  '/service-custom': customServiceHtml,
  '/service-custom.html': customServiceHtml,
  '/privacy-policy': privacyHtml,
  '/privacy-policy.html': privacyHtml,
  '/terms-of-service': termsHtml,
  '/terms-of-service.html': termsHtml,
};

const SITE_URL = 'https://smartscalesystems.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo-main.png`;
const DEFAULT_DESCRIPTION = 'Smart Scale Systems helps businesses scale smarter with AI model training, automation, computer vision, NLP, LLM solutions, data annotation, and AI training data creation.';
const DEFAULT_KEYWORDS = 'AI services, AI model training, AI automation, computer vision, NLP, LLMs, data annotation, AI training data, machine learning datasets, RLHF';
const PAKISTAN_KEYWORDS = 'AI agency in Pakistan, AI services in Pakistan, artificial intelligence company Pakistan, AI automation Pakistan, AI model training Pakistan, computer vision services Pakistan, NLP services Pakistan, LLM solutions Pakistan, data annotation Pakistan, AI training data Pakistan, machine learning services Pakistan';

const SEO_OVERRIDES = {
  '/': {
    title: 'AI Agency in Pakistan | Smart Scale Systems',
    description: 'Smart Scale Systems is an AI agency in Pakistan for automation, model training, computer vision, NLP, LLMs and data annotation.',
    keywords: PAKISTAN_KEYWORDS,
  },
  '/services': {
    title: 'AI Services in Pakistan | Smart Scale Systems',
    description: 'Explore AI services in Pakistan, including AI model training, automation, computer vision, NLP, LLM solutions, data annotation, and AI training data by Smart Scale Systems.',
    keywords: PAKISTAN_KEYWORDS,
  },
  '/ai-agency-pakistan': {
    title: 'AI Agency in Pakistan | Smart Scale Systems',
    description: 'Looking for an AI agency in Pakistan? Smart Scale Systems builds AI automation, machine learning models, LLM systems, computer vision pipelines, NLP solutions, and training datasets.',
    keywords: PAKISTAN_KEYWORDS,
  },
  '/ai-services-pakistan': {
    title: 'AI Services in Pakistan | Model Training, Automation, LLMs',
    description: 'Smart Scale Systems provides AI services in Pakistan for startups and businesses, including model training, AI automation, computer vision, NLP, LLM solutions, annotation, and training data.',
    keywords: PAKISTAN_KEYWORDS,
  },
  '/service-ai-model-training': {
    title: 'AI Model Training Services in Pakistan | Smart Scale Systems',
    description: 'Custom AI model training services in Pakistan, including fine-tuning, dataset preparation, model evaluation, optimization, and deployment support.',
    keywords: 'AI model training Pakistan, machine learning model training Pakistan, AI fine-tuning Pakistan, custom AI models Pakistan',
  },
  '/service-ai-automation': {
    title: 'AI Automation Services in Pakistan | Smart Scale Systems',
    description: 'AI automation services in Pakistan for workflows, AI agents, CRM automation, lead generation, operations, and business process automation.',
    keywords: 'AI automation Pakistan, AI agents Pakistan, business process automation Pakistan, CRM automation Pakistan, workflow automation Pakistan',
  },
  '/service-computer-vision': {
    title: 'Computer Vision Services in Pakistan | Smart Scale Systems',
    description: 'Computer vision services in Pakistan for object detection, image classification, segmentation, OCR, video analytics, and visual AI systems.',
    keywords: 'computer vision services Pakistan, object detection Pakistan, OCR services Pakistan, image annotation Pakistan, video analytics Pakistan',
  },
  '/service-nlp': {
    title: 'NLP Services in Pakistan | Smart Scale Systems',
    description: 'NLP services in Pakistan for text classification, sentiment analysis, named entity recognition, intent detection, search relevance, and language AI.',
    keywords: 'NLP services Pakistan, natural language processing Pakistan, text classification Pakistan, sentiment analysis Pakistan, NER Pakistan',
  },
  '/service-llm': {
    title: 'LLM Solutions in Pakistan | Smart Scale Systems',
    description: 'LLM solutions in Pakistan, including prompt engineering, LLM fine-tuning, RLHF, response evaluation, AI assistants, and custom large language model pipelines.',
    keywords: 'LLM solutions Pakistan, LLM fine-tuning Pakistan, prompt engineering Pakistan, RLHF Pakistan, AI assistants Pakistan',
  },
  '/service-data-annotation': {
    title: 'Data Annotation Services in Pakistan | Smart Scale Systems',
    description: 'Data annotation services in Pakistan for images, video, text, audio, OCR, bounding boxes, polygons, segmentation masks, and QA review.',
    keywords: 'data annotation Pakistan, image annotation Pakistan, video annotation Pakistan, text annotation Pakistan, OCR annotation Pakistan',
  },
  '/service-ai-training-data': {
    title: 'AI Training Data Services in Pakistan | Smart Scale Systems',
    description: 'AI training data services in Pakistan for machine learning, computer vision, NLP, LLMs, automation systems, evaluation datasets, and dataset curation.',
    keywords: 'AI training data Pakistan, dataset creation Pakistan, machine learning datasets Pakistan, data collection Pakistan, dataset curation Pakistan',
  },
  '/service-custom': {
    title: 'Custom AI Solutions in Pakistan | Smart Scale Systems',
    description: 'Custom AI solutions in Pakistan for businesses that need tailored automation, machine learning, LLM, computer vision, NLP, and data systems.',
    keywords: 'custom AI solutions Pakistan, AI consulting Pakistan, AI development Pakistan, artificial intelligence agency Pakistan',
  },
};

function normalizeSeoPath(pathname) {
  if (pathname === '/' || pathname === '/index' || pathname === '/index.html') return '/';
  return pathname.replace(/\.html$/, '');
}

function canonicalUrl(pathname) {
  const normalizedPath = normalizeSeoPath(pathname);
  return `${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
}

function pageKind(pathname) {
  const normalizedPath = normalizeSeoPath(pathname);
  if (normalizedPath.startsWith('/service-')) return 'service';
  if (normalizedPath === '/ai-agency-pakistan' || normalizedPath === '/ai-services-pakistan') return 'service';
  if (normalizedPath === '/contact') return 'contact';
  return 'page';
}

function managedHeadElement(tagName, attributes = {}, textContent = '') {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      element.setAttribute(key, value);
    }
  });
  element.setAttribute('data-managed-seo', 'true');
  if (textContent) element.textContent = textContent;
  return element;
}

function metaContent(doc, selector, fallback = '') {
  return doc.querySelector(selector)?.getAttribute('content') || fallback;
}

function buildStructuredData({ title, description, url, kind }) {
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Smart Scale Systems',
    url: SITE_URL,
    email: 'contact@smartscalesystems.tech',
    logo: DEFAULT_IMAGE,
    description: 'AI services agency delivering model training, automation, computer vision, NLP, LLM solutions, and data annotation at scale.',
    areaServed: {
      '@type': 'Country',
      name: 'Pakistan',
    },
    knowsAbout: [
      'AI automation',
      'AI model training',
      'Computer vision',
      'Natural language processing',
      'Large language models',
      'Data annotation',
      'AI training data',
    ],
  };

  const graph = [
    organization,
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#ai-agency`,
      name: 'Smart Scale Systems',
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      description: 'AI agency in Pakistan providing AI model training, automation, computer vision, NLP, LLM solutions, data annotation, and AI training data services.',
      email: 'contact@smartscalesystems.tech',
      areaServed: {
        '@type': 'Country',
        name: 'Pakistan',
      },
      serviceType: [
        'AI agency',
        'AI services',
        'AI automation',
        'AI model training',
        'Computer vision',
        'NLP',
        'LLM solutions',
        'Data annotation',
        'AI training data',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Smart Scale Systems',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
    },
  ];

  if (kind === 'service') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: title.replace(' | Smart Scale Systems', ''),
      description,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        'Worldwide',
      ],
      serviceType: title.replace(' | Smart Scale Systems', ''),
    });
  }

  if (url.endsWith('/ai-agency-pakistan') || url.endsWith('/ai-services-pakistan')) {
    graph.push({
      '@type': 'OfferCatalog',
      '@id': `${url}#offer-catalog`,
      name: 'AI Services in Pakistan',
      itemListElement: [
        'AI Model Training',
        'AI Automation',
        'Computer Vision',
        'NLP Services',
        'LLM Solutions',
        'Data Annotation',
        'AI Training Data',
        'Custom AI Solutions',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name,
          provider: { '@id': `${SITE_URL}/#organization` },
          areaServed: { '@type': 'Country', name: 'Pakistan' },
        },
      })),
    });
  }

  if (url.endsWith('/ai-agency-pakistan')) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What makes Smart Scale Systems an AI agency in Pakistan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Smart Scale Systems provides AI services for businesses in Pakistan and global clients, including automation, model training, computer vision, NLP, LLM solutions, data annotation, and AI training data.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you provide AI automation services in Pakistan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Smart Scale Systems builds AI agents, workflow automation, CRM automation, lead generation systems, and business process automation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you create datasets for AI model training?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Smart Scale Systems creates, cleans, annotates, reviews, and structures datasets for machine learning, computer vision, NLP, LLM evaluation, and custom AI systems.',
          },
        },
      ],
    });
  }

  if (kind === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${url}#contact`,
      url,
      name: title,
      about: { '@id': `${SITE_URL}/#organization` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function updateDocumentSeo(rawHtml, pathname) {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  const normalizedPath = normalizeSeoPath(pathname);
  const override = SEO_OVERRIDES[normalizedPath] || {};
  const title = override.title || doc.querySelector('title')?.textContent?.trim() || 'Smart Scale Systems';
  const description = override.description || metaContent(doc, 'meta[name="description"]', DEFAULT_DESCRIPTION);
  const keywords = override.keywords || metaContent(doc, 'meta[name="keywords"]', DEFAULT_KEYWORDS);
  const url = canonicalUrl(pathname);
  const kind = pageKind(pathname);

  document.title = title;
  document.head.querySelectorAll(`
    [data-managed-seo],
    meta[name="description"],
    meta[name="keywords"],
    meta[name="robots"],
    meta[name="author"],
    meta[name="theme-color"],
    meta[property^="og:"],
    meta[name^="twitter:"],
    link[rel="canonical"],
    script[type="application/ld+json"]
  `).forEach((element) => element.remove());

  [
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'keywords', content: keywords }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'author', content: 'Smart Scale Systems' }],
    ['meta', { name: 'theme-color', content: '#0b0b0f' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:site_name', content: 'Smart Scale Systems' }],
    ['meta', { property: 'og:image', content: DEFAULT_IMAGE }],
    ['meta', { property: 'og:image:alt', content: 'Smart Scale Systems logo' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: DEFAULT_IMAGE }],
    ['link', { rel: 'canonical', href: url }],
  ].forEach(([tagName, attributes]) => {
    document.head.appendChild(managedHeadElement(tagName, attributes));
  });

  document.head.appendChild(managedHeadElement(
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(buildStructuredData({ title, description, url, kind }))
  ));
}

function bodyContent(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, #nav-placeholder, #footer-placeholder, .noise-overlay').forEach((node) => node.remove());
  doc.querySelectorAll('spline-viewer').forEach((viewer, index) => {
    const mount = doc.createElement('div');
    mount.className = 'react-spline-viewer';
    mount.dataset.splineUrl = viewer.getAttribute('url') || '';
    if (viewer.id) mount.id = viewer.id;
    mount.dataset.splineMount = viewer.id || `spline-mount-${index}`;
    viewer.replaceWith(mount);
  });
  doc.querySelectorAll('.react-spline-viewer').forEach((mount, index) => {
    if (!mount.dataset.splineMount) {
      mount.dataset.splineMount = mount.id || `spline-mount-${index}`;
    }
  });
  return doc.body.innerHTML;
}

function setActiveNav(pathname) {
  const current = pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace('.html', '');
  document.querySelectorAll('.nav-link[data-page]').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === current);
  });

  const servicesPages = [
    'services',
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
  ];
  const servicesButton = document.getElementById('servicesDropBtn');
  if (servicesButton) {
    servicesButton.classList.toggle('active', servicesPages.includes(current));
  }
}

function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  const dropBtn = document.getElementById('servicesDropBtn');
  const dropdown = document.getElementById('servicesDropdown');
  if (!nav) return () => {};

  const cleanups = [];
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNav, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', updateNav));
  updateNav();

  if (hamburger && navLinks) {
    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    hamburger.addEventListener('click', toggleMenu);
    cleanups.push(() => hamburger.removeEventListener('click', toggleMenu));
  }

  if (dropBtn && dropdown) {
    const wrap = dropBtn.closest('.nav-dropdown-wrap');
    let closeTimeout = null;
    const open = () => {
      clearTimeout(closeTimeout);
      dropdown.classList.add('open');
      dropBtn.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      closeTimeout = setTimeout(() => {
        dropdown.classList.remove('open');
        dropBtn.setAttribute('aria-expanded', 'false');
      }, 180);
    };
    const toggleDropdown = (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropBtn.setAttribute('aria-expanded', String(isOpen));
    };
    wrap.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', close);
    dropBtn.addEventListener('click', toggleDropdown);
    cleanups.push(() => {
      wrap.removeEventListener('mouseenter', open);
      wrap.removeEventListener('mouseleave', close);
      dropBtn.removeEventListener('click', toggleDropdown);
    });
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    document.body.style.overflow = '';
  };
}

function initRevealAnimations() {
  const observers = [];
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          window.setTimeout(() => {
            entry.target.style.willChange = 'auto';
          }, 520);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach((el, index) => {
      el.style.willChange = 'transform, opacity';
      el.style.transitionDelay = `${(index % 5) * 0.045}s`;
      observer.observe(el);
    });
    observers.push(observer);
  }

  const sectionItems = document.querySelectorAll('[data-section-reveal]');
  if (sectionItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
    sectionItems.forEach((el) => observer.observe(el));
    observers.push(observer);
  }

  const teamIntroItems = document.querySelectorAll('.team-cinematic-line, .team-cinematic-sub');
  if (teamIntroItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
    teamIntroItems.forEach((el) => observer.observe(el));
    observers.push(observer);
  }

  const teamRows = document.querySelectorAll('[data-team-reveal]');
  if (teamRows.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    teamRows.forEach((row) => observer.observe(row));
    observers.push(observer);
  }

  return () => observers.forEach((observer) => observer.disconnect());
}

function initSplineLoader() {
  const loader = document.getElementById('spline-loader');
  if (!loader) return () => {};
  const hideLoader = () => loader.classList.add('hidden');
  const timer = window.setTimeout(hideLoader, 7000);
  return () => {
    window.clearTimeout(timer);
  };
}

function ReactSplineMounts({ contentKey }) {
  const [mounts, setMounts] = useState([]);
  const [SplineComponent, setSplineComponent] = useState(null);

  useEffect(() => {
    setMounts(Array.from(document.querySelectorAll('.react-spline-viewer')));
  }, [contentKey]);

  useEffect(() => {
    if (!mounts.some((mount) => mount.dataset.splineUrl)) return;

    let isMounted = true;
    import('@splinetool/react-spline').then((module) => {
      if (isMounted) setSplineComponent(() => module.default);
    });

    return () => {
      isMounted = false;
    };
  }, [mounts]);

  if (!SplineComponent) return null;

  return mounts.map((mount) => {
    const scene = mount.dataset.splineUrl;
    if (!scene) return null;

    return createPortal(
      <SplineComponent
        scene={scene}
        onLoad={() => {
          if (mount.id === 'spline-viewer') {
            document.getElementById('spline-loader')?.classList.add('hidden');
          }
        }}
      />,
      mount,
      `${mount.dataset.splineMount}-${scene}`
    );
  });
}

function initCarousels() {
  const cleanups = [];
  document.querySelectorAll('.carousel-scene').forEach((scene) => {
    const spinner = scene.querySelector('.carousel-spinner');
    if (!spinner || scene.querySelector('.carousel-dots')) return;

    const items = Array.from(spinner.children);
    if (!items.length) return;
    items.forEach((item) => item.classList.add('carousel-item'));

    const sizeScene = () => {
      items.forEach((item) => {
        item.style.position = 'static';
        item.style.width = '340px';
      });
      const tallestCard = Math.max(...items.map((item) => item.offsetHeight));
      items.forEach((item) => {
        item.style.position = '';
        item.style.width = '';
      });
      const sceneHeight = Math.min(Math.max(tallestCard + 80, 360), 580);
      scene.style.height = `${sceneHeight}px`;
      spinner.style.height = `${sceneHeight - 80}px`;
      spinner.style.marginTop = '20px';
    };

    let activeIndex = 0;
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    const dots = items.map((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      dot.addEventListener('click', () => {
        activeIndex = index;
        updateCarousel();
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });
    scene.appendChild(dotsContainer);

    const updateCarousel = () => {
      items.forEach((item, index) => {
        let diff = index - activeIndex;
        const half = Math.floor(items.length / 2);
        if (diff > half) diff -= items.length;
        if (diff < -half) diff += items.length;

        if (Math.abs(diff) > 2) {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          item.style.transform = `translate3d(${Math.sign(diff) * 300}px, 0, 0) scale(0.5)`;
        } else {
          item.style.opacity = '';
          item.style.transform = `translate3d(${diff * 180}px, 0, 0) scale(${1 - Math.abs(diff) * 0.15})`;
          item.classList.toggle('active', diff === 0);
          item.style.pointerEvents = diff === 0 ? 'auto' : 'none';
        }
        item.style.zIndex = String(100 - Math.abs(diff));
      });
      dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
    };

    let autoPlayInterval = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateCarousel();
    }, 4000);

    const resetAutoPlay = () => {
      window.clearInterval(autoPlayInterval);
      autoPlayInterval = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % items.length;
        updateCarousel();
      }, 4000);
    };

    const prev = () => {
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateCarousel();
      resetAutoPlay();
    };
    const next = () => {
      activeIndex = (activeIndex + 1) % items.length;
      updateCarousel();
      resetAutoPlay();
    };
    const prevBtn = scene.querySelector('.carousel-prev');
    const nextBtn = scene.querySelector('.carousel-next');
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    let startX = 0;
    const onTouchStart = (event) => {
      startX = event.touches[0].clientX;
    };
    const onTouchEnd = (event) => {
      const endX = event.changedTouches[0].clientX;
      if (startX - endX > 50) next();
      if (endX - startX > 50) prev();
    };
    scene.addEventListener('touchstart', onTouchStart, { passive: true });
    scene.addEventListener('touchend', onTouchEnd);

    let resizeFrame = null;
    const onResize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null;
        sizeScene();
        updateCarousel();
      });
    };
    window.addEventListener('resize', onResize);
    window.requestAnimationFrame(() => {
      sizeScene();
      updateCarousel();
    });

    cleanups.push(() => {
      window.clearInterval(autoPlayInterval);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', onResize);
      scene.removeEventListener('touchstart', onTouchStart);
      scene.removeEventListener('touchend', onTouchEnd);
      prevBtn?.removeEventListener('click', prev);
      nextBtn?.removeEventListener('click', next);
      dotsContainer.remove();
      items.forEach((item) => item.classList.remove('carousel-item', 'active'));
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

function initForms() {
  const cleanups = [];

  const wireForm = (formId, endpoint, makePayload, sendingLabel, resetLabel) => {
    const form = document.getElementById(formId);
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !submitBtn) return;

    const onSubmit = async (event) => {
      event.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach((field) => {
        field.classList.remove('field-error');
        if (!field.value.trim()) {
          field.classList.add('field-error');
          valid = false;
        }
      });
      if (!valid) return;

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.innerHTML = `<span class="spinner"></span> ${sendingLabel}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makePayload(form)),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to send request');
        }
        form.style.display = 'none';
        if (error) error.style.display = 'none';
        if (success) {
          success.style.display = 'flex';
          success.classList.add('show');
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = resetLabel;
        if (error) {
          error.style.display = 'flex';
          const message = error.querySelector('p');
          if (message) message.textContent = err.message || 'Something went wrong. Please try again later.';
        }
      }
    };

    form.addEventListener('submit', onSubmit);
    cleanups.push(() => form.removeEventListener('submit', onSubmit));
  };

  wireForm(
    'contactForm',
    '/api/contact',
    (form) => ({
      name: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      nationality: form.nationality.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    }),
    'Sending...',
    '<span class="btn-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Send Message'
  );

  wireForm(
    'customServiceForm',
    '/api/custom-service',
    (form) => ({
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      projectDetails: form.projectDetails.value.trim(),
    }),
    'Sending...',
    '<span class="btn-icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg></span> Send Request'
  );

  return () => cleanups.forEach((cleanup) => cleanup());
}

function splitTextNodes(element, mode) {
  if (!element || element.dataset.gsapSplit === mode) return;

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('.gsap-word, .gsap-char')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const pieces = mode === 'chars'
      ? node.textContent.split('')
      : node.textContent.split(/(\s+)/);

    pieces.forEach((piece) => {
      if (!piece) return;
      if (/^\s+$/.test(piece)) {
        fragment.appendChild(document.createTextNode(piece));
        return;
      }

      if (mode === 'chars') {
        const char = document.createElement('span');
        char.className = 'gsap-char';
        char.textContent = piece;
        fragment.appendChild(char);
        return;
      }

      const word = document.createElement('span');
      word.className = 'gsap-word';
      word.textContent = piece;
      fragment.appendChild(word);
    });

    node.replaceWith(fragment);
  });

  element.dataset.gsapSplit = mode;
}

function initPremiumAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const hoverCleanups = [];

  const ctx = gsap.context(() => {
    gsap.set('main', { autoAlpha: 1 });

    gsap.fromTo('.nav-logo, .nav-links > *, .nav-cta',
      { y: -18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.045, ease: 'expo.out', delay: 0.08 }
    );

    const heroTitle = document.querySelector('.hero-title, .page-hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle, .page-hero-subtitle');
    const heroActions = document.querySelector('.hero-actions, .cta-actions');
    const heroVisual = document.querySelector('.spline-wrapper, .page-hero-orb, .home-spline-showcase .react-spline-viewer');

    if (heroTitle) {
      splitTextNodes(heroTitle, 'words');
      gsap.fromTo(heroTitle.querySelectorAll('.gsap-word'),
        { yPercent: 115, rotateX: -72, autoAlpha: 0, transformOrigin: '50% 100%' },
        { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.15, stagger: 0.035, ease: 'expo.out', delay: 0.08 }
      );
    }

    if (heroSubtitle) {
      splitTextNodes(heroSubtitle, 'words');
      gsap.fromTo(heroSubtitle.querySelectorAll('.gsap-word'),
        { y: 24, autoAlpha: 0, filter: 'blur(8px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.82, stagger: 0.018, ease: 'power3.out', delay: 0.42 }
      );
    }

    gsap.fromTo([heroActions, heroVisual].filter(Boolean),
      { y: 34, scale: 0.96, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out', delay: 0.6 }
    );

    // Keep GSAP on first-viewport elements only. Cards and section content use
    // lightweight CSS/IntersectionObserver reveals to avoid route-change jank.
    return;

    document.querySelectorAll('.section-tag').forEach((tag) => {
      splitTextNodes(tag, 'chars');
      gsap.fromTo(tag.querySelectorAll('.gsap-char'),
        { yPercent: 120, autoAlpha: 0, rotateX: -75 },
        {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          duration: 0.55,
          stagger: 0.018,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: tag, start: 'top 88%', once: true },
        }
      );
    });

    document.querySelectorAll(`
      .section-title,
      .contact-form-title,
      .contact-info-title,
      .service-choice-intro h3,
      .legal-content h2,
      .legal-content h3,
      .team-member-name,
      .career-card h3,
      .service-full-card h2,
      .offering-card h3,
      .use-case-card h3,
      .related-card h3,
      .testimonial-full-card h3,
      .why-card h3,
      .industry-card h3
    `).forEach((title) => {
      splitTextNodes(title, 'words');
      gsap.fromTo(title.querySelectorAll('.gsap-word'),
        { yPercent: 105, autoAlpha: 0, rotateX: -58, filter: 'blur(7px)' },
        {
          yPercent: 0,
          autoAlpha: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          stagger: 0.035,
          ease: 'expo.out',
          scrollTrigger: { trigger: title, start: 'top 84%', once: true },
        }
      );
    });

    document.querySelectorAll(`
      .section-body,
      .service-choice-intro p,
      .contact-form-subtitle,
      .legal-content p,
      .legal-content li,
      .team-member-role,
      .team-member-bio,
      .career-card > p,
      .service-full-card > p,
      .offering-card p,
      .use-case-card p,
      .related-card p,
      .testimonial-text,
      .why-card p,
      .industry-card p,
      .footer-desc
    `).forEach((body) => {
      splitTextNodes(body, 'words');
      gsap.fromTo(body.querySelectorAll('.gsap-word'),
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.62,
          stagger: 0.012,
          ease: 'power3.out',
          scrollTrigger: { trigger: body, start: 'top 88%', once: true },
        }
      );
    });

    const cardGroups = [
      '.offering-grid',
      '.use-cases-grid',
      '.related-grid',
      '.testimonials-full-grid',
      '.contact-info-cards',
      '.contact-trust-grid',
      '.careers-grid',
      '.team-grid',
      '.pillars-grid',
      '.carousel-spinner',
      '.service-choice-grid',
      '.legal-content',
      '.contact-form',
      '.footer-top',
      '.footer-bottom',
      '.team-members-section',
    ];

    cardGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        const cards = group.querySelectorAll(
          '.offering-card, .use-case-card, .related-card, .testimonial-card, .testimonial-full-card, .contact-info-card, .contact-trust-item, .career-card, .team-card, .pillar-card, .industry-card, .why-card, .service-choice-card, .service-card, .legal-content > *, .form-group, .form-submit-row, .footer-brand, .footer-links-group, .footer-bottom > *, .team-member-row'
        );
        if (!cards.length) return;

        gsap.fromTo(cards,
          { y: 56, autoAlpha: 0, scale: 0.92, rotateX: -8, transformOrigin: '50% 100%' },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.88,
            stagger: { each: 0.075, from: 'start' },
            ease: 'expo.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          }
        );
      });
    });

    document.querySelectorAll('.team-member-row').forEach((row) => {
      const photo = row.querySelector('.team-member-photo-wrap');
      const info = row.querySelector('.team-member-info');
      const skills = row.querySelectorAll('.team-member-skills span');
      const reversed = row.classList.contains('reverse');

      gsap.fromTo(photo,
        { x: reversed ? 42 : -42, rotateY: reversed ? -12 : 12, autoAlpha: 0, scale: 0.92 },
        {
          x: 0,
          rotateY: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 82%', once: true },
        }
      );

      gsap.fromTo(info,
        { x: reversed ? -36 : 36, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 82%', once: true },
        }
      );

      if (skills.length) {
        gsap.fromTo(skills,
          { y: 14, autoAlpha: 0, scale: 0.9 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.48,
            stagger: 0.035,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: row, start: 'top 78%', once: true },
          }
        );
      }
    });

    document.querySelectorAll('.contact-form-wrap, .contact-info-wrap, .home-spline-copy, .service-choice-shell').forEach((panel) => {
      gsap.fromTo(panel,
        { y: 42, autoAlpha: 0, filter: 'blur(10px)' },
        {
          y: 0,
          autoAlpha: 1,
          filter: 'blur(0px)',
          duration: 0.95,
          ease: 'expo.out',
          scrollTrigger: { trigger: panel, start: 'top 84%', once: true },
        }
      );
    });

    document.querySelectorAll('.content-section').forEach((section) => {
      gsap.fromTo(section,
        { '--section-wash': 0 },
        {
          '--section-wash': 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 86%', once: true },
        }
      );
    });

    gsap.fromTo('.btn-primary, .btn-ghost, .form-submit-btn',
      { y: 16, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        stagger: 0.045,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: 'main', start: 'top 95%', once: true },
      }
    );

    gsap.fromTo('.footer-socials a, .footer-bottom-links a, .footer-cta-btn',
      { y: 14, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true },
      }
    );

    const hoverTargets = document.querySelectorAll('.offering-card, .use-case-card, .related-card, .service-full-card, .testimonial-full-card, .contact-info-card, .career-card, .why-card, .industry-card, .footer-socials a, .team-member-photo');
    hoverTargets.forEach((card) => {
      const onEnter = () => gsap.to(card, { y: -8, scale: 1.015, duration: 0.32, ease: 'power3.out' });
      const onLeave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.42, ease: 'elastic.out(1, 0.65)' });
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      hoverCleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  });

  ScrollTrigger.refresh();

  return () => {
    hoverCleanups.forEach((cleanup) => cleanup());
    ctx.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}

function Layout({ children, pathname }) {
  useEffect(() => {
    const cleanup = initNav();
    setActiveNav(pathname);
    return cleanup;
  }, [pathname]);

  return (
    <>
      <div className="noise-overlay" />
      <div dangerouslySetInnerHTML={{ __html: navHtml }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
    </>
  );
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const rawPage = pages[pathname] || homeHtml;
  const content = useMemo(() => bodyContent(rawPage), [rawPage]);

  useEffect(() => {
    updateDocumentSeo(rawPage, pathname);
  }, [rawPage, pathname]);

  useEffect(() => {
    if (document.getElementById('robot-mascot-script')) return;
    const script = document.createElement('script');
    script.id = 'robot-mascot-script';
    script.src = '/src/scripts/robot-mascot.js?v=20260707-structured';
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);

    const onClick = (event) => {
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith('/api')) return;
      if (!pages[url.pathname]) return;
      event.preventDefault();
      window.history.pushState({}, '', url.pathname);
      setPathname(url.pathname);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const cleanups = [initRevealAnimations(), initSplineLoader(), initCarousels(), initForms(), initPremiumAnimations()];
    return () => cleanups.forEach((cleanup) => cleanup && cleanup());
  }, [content]);

  return (
    <Layout pathname={pathname}>
      <main dangerouslySetInnerHTML={{ __html: content }} />
      <ReactSplineMounts contentKey={content} />
    </Layout>
  );
}

createRoot(document.getElementById('root')).render(<App />);
