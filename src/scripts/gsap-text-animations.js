/* ============================================================
   SMART SCALE SYSTEMS — GSAP TEXT ANIMATIONS
   Uses: GSAP + ScrollTrigger + SplitText + TextPlugin
   ============================================================ */

(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.TextPlugin) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText, TextPlugin);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* ── Hero Section ── */
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroActions = document.querySelector('.hero-actions');
  const trustStrip = document.querySelector('.trust-strip');
  const heroPanel = document.querySelector('.hero-panel');
  const scrollHint = document.querySelector('.scroll-hint');

  if (heroTitle) {
    const splitTitle = new SplitText(heroTitle, { type: 'lines,words,chars', linesClass: 'line', wordsClass: 'word', charsClass: 'char' });
    gsap.set(splitTitle.chars, { opacity: 0, y: 50, rotationX: -90, transformOrigin: '50% 100%' });

    gsap.to(splitTitle.chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.02,
      ease: 'expo.out',
      delay: 0.3
    });
  }

  if (heroSubtitle) {
    const splitSub = new SplitText(heroSubtitle, { type: 'lines,words', linesClass: 'line', wordsClass: 'word' });
    gsap.set(splitSub.words, { opacity: 0, y: 30 });

    gsap.to(splitSub.words, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.04,
      ease: 'power3.out',
      delay: 0.6
    });
  }

  const heroElements = [
    { el: heroActions, delay: 0.9, y: 30 },
    { el: trustStrip, delay: 1.1, y: 30 },
    { el: heroPanel, delay: 0.5, y: 40, opacity: 0 },
    { el: scrollHint, delay: 1.5, opacity: 0, y: 20 }
  ];

  heroElements.forEach(({ el, delay, y = 30, opacity = 0 }) => {
    if (el) {
      gsap.set(el, { opacity, y });
      gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay });
    }
  });

  /* ── Section Reveal Animations ── */
  function initSectionReveals() {
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
      const tag = section.querySelector('.section-tag');
      const title = section.querySelector('.section-title');
      const body = section.querySelector('.section-body');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
          once: true
        }
      });

      if (tag) {
        const splitTag = new SplitText(tag, { type: 'chars', charsClass: 'tag-char' });
        gsap.set(splitTag.chars, { opacity: 0, y: 20, rotationX: -90 });
        tl.to(splitTag.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.03, ease: 'back.out(1.7)' }, 0);
      }

      if (title) {
        const splitTitle = new SplitText(title, { type: 'lines,words', linesClass: 'title-line', wordsClass: 'title-word' });
        gsap.set(splitTitle.words, { opacity: 0, y: 40 });
        tl.to(splitTitle.words, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, '-=0.3');
      }

      if (body) {
        const splitBody = new SplitText(body, { type: 'lines,words', linesClass: 'body-line', wordsClass: 'body-word' });
        gsap.set(splitBody.words, { opacity: 0, y: 25 });
        tl.to(splitBody.words, { opacity: 1, y: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out' }, '-=0.5');
      }
    });
  }

  /* ── Stats Counter with GSAP ── */
  function initStatsCounter() {
    const statNums = document.querySelectorAll('.stat-num, .trust-big-num');

    statNums.forEach(stat => {
      const textNode = Array.from(stat.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      if (!textNode) return;

      const text = textNode.textContent.trim();
      const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;

      const targetVal = parseFloat(match[1]);
      const suffix = match[2];
      const isFloat = targetVal % 1 !== 0;

      const obj = { val: 0 };
      const splitSuffix = suffix ? new SplitText(stat, { type: 'chars' }) : null;

      ScrollTrigger.create({
        trigger: stat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: targetVal,
            duration: 2,
            ease: 'expo.out',
            onUpdate: () => {
              textNode.textContent = (isFloat ? obj.val.toFixed(1) : Math.floor(obj.val)) + suffix;
            }
          });
        }
      });
    });
  }

  /* ── Carousel Card Text Animations ── */
  function initCarouselText() {
    const cards = document.querySelectorAll('.service-card, .why-card, .offering-card, .use-case-card, .related-card, .industry-card, .testimonial-card, .contact-trust-item');

    cards.forEach(card => {
      const title = card.querySelector('h3, h4');
      const desc = card.querySelector('p:not(.card-link):not(.testimonial-service-tag):not(.stat-label):not(.trust-big-label)');

      ScrollTrigger.create({
        trigger: card,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          if (title) {
            const split = new SplitText(title, { type: 'words,chars', wordsClass: 'card-title-word', charsClass: 'card-title-char' });
            gsap.set(split.chars, { opacity: 0, y: 20, rotationX: -90 });
            tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.5, stagger: 0.02, ease: 'back.out(1.5)' }, 0);
          }

          if (desc) {
            const split = new SplitText(desc, { type: 'words', wordsClass: 'card-desc-word' });
            gsap.set(split.words, { opacity: 0, y: 15 });
            tl.to(split.words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: 'power3.out' }, '-=0.3');
          }
        }
      });
    });
  }

  /* ── Service Full Cards (services.html) ── */
  function initServiceFullCards() {
    const cards = document.querySelectorAll('.service-full-card');

    cards.forEach(card => {
      const title = card.querySelector('.sfc-title-wrap h2');
      const desc = card.querySelector(':scope > p');
      const tags = card.querySelector('.sfc-tags');
      const cta = card.querySelector('.sfc-cta');

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          if (title) {
            const split = new SplitText(title, { type: 'words,chars' });
            gsap.set(split.chars, { opacity: 0, y: 30, rotationX: -90 });
            tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.02, ease: 'expo.out' }, 0);
          }

          if (desc) {
            const split = new SplitText(desc, { type: 'words' });
            gsap.set(split.words, { opacity: 0, y: 20 });
            tl.to(split.words, { opacity: 1, y: 0, duration: 0.6, stagger: 0.02, ease: 'power3.out' }, '-=0.4');
          }

          if (tags) {
            gsap.set(tags, { opacity: 0, y: 20 });
            tl.to(tags, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
          }

          if (cta) {
            gsap.set(cta, { opacity: 0, y: 20 });
            tl.to(cta, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2');
          }
        }
      });
    });
  }

  /* ── Page Hero (non-home pages) ── */
  function initPageHero() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero) return;

    const breadcrumb = pageHero.querySelector('.breadcrumb');
    const tag = pageHero.querySelector('.section-tag');
    const title = pageHero.querySelector('.page-hero-title');
    const subtitle = pageHero.querySelector('.page-hero-subtitle');
    const actions = pageHero.querySelector('.hero-actions');

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (breadcrumb) {
      gsap.set(breadcrumb, { opacity: 0, y: -20 });
      tl.to(breadcrumb, { opacity: 1, y: 0, duration: 0.6 }, 0);
    }

    if (tag) {
      const split = new SplitText(tag, { type: 'chars' });
      gsap.set(split.chars, { opacity: 0, y: 20, rotationX: -90 });
      tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(1.7)' }, 0.1);
    }

    if (title) {
      const split = new SplitText(title, { type: 'lines,words,chars', linesClass: 'hero-title-line', wordsClass: 'hero-title-word', charsClass: 'hero-title-char' });
      gsap.set(split.chars, { opacity: 0, y: 50, rotationX: -90, transformOrigin: '50% 100%' });
      tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.02, ease: 'expo.out' }, 0.2);
    }

    if (subtitle) {
      const split = new SplitText(subtitle, { type: 'words' });
      gsap.set(split.words, { opacity: 0, y: 30 });
      tl.to(split.words, { opacity: 1, y: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out' }, 0.5);
    }

    if (actions) {
      gsap.set(actions, { opacity: 0, y: 30 });
      tl.to(actions, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8);
    }
  }

  /* ── Team Member Cards ── */
  function initTeamCards() {
    const rows = document.querySelectorAll('.team-member-row');

    rows.forEach((row, i) => {
      const photo = row.querySelector('.team-member-photo');
      const info = row.querySelector('.team-member-info');
      const name = row.querySelector('.team-member-name');
      const role = row.querySelector('.team-member-role');
      const bio = row.querySelector('.team-member-bio');
      const skills = row.querySelector('.team-member-skills');

      ScrollTrigger.create({
        trigger: row,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          if (photo) {
            gsap.set(photo, { opacity: 0, x: row.classList.contains('reverse') ? 60 : -60 });
            tl.to(photo, { opacity: 1, x: 0, duration: 1, ease: 'expo.out' }, 0);
          }

          if (info) {
            gsap.set(info, { opacity: 0, y: 40 });
            tl.to(info, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.1);
          }

          if (name) {
            const split = new SplitText(name, { type: 'words,chars' });
            gsap.set(split.chars, { opacity: 0, y: 30, rotationX: -90 });
            tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.6, stagger: 0.02, ease: 'back.out(1.5)' }, 0.3);
          }

          if (role) {
            gsap.set(role, { opacity: 0, y: 20 });
            tl.to(role, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.5);
          }

          if (bio) {
            const split = new SplitText(bio, { type: 'words' });
            gsap.set(split.words, { opacity: 0, y: 15 });
            tl.to(split.words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: 'power3.out' }, 0.6);
          }

          if (skills) {
            const spans = skills.querySelectorAll('span');
            gsap.set(spans, { opacity: 0, y: 20, scale: 0.8 });
            tl.to(spans, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }, 0.9);
          }
        }
      });
    });
  }

  /* ── Testimonial Full Cards ── */
  function initTestimonialFullCards() {
    const cards = document.querySelectorAll('.testimonial-full-card');

    cards.forEach(card => {
      const stars = card.querySelector('.testimonial-stars');
      const text = card.querySelector('.testimonial-text');
      const author = card.querySelector('.testimonial-author');

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          if (stars) {
            const split = new SplitText(stars, { type: 'chars' });
            gsap.set(split.chars, { opacity: 0, scale: 0, rotation: 180 });
            tl.to(split.chars, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' }, 0);
          }

          if (text) {
            const split = new SplitText(text, { type: 'words' });
            gsap.set(split.words, { opacity: 0, y: 20 });
            tl.to(split.words, { opacity: 1, y: 0, duration: 0.6, stagger: 0.02, ease: 'power3.out' }, 0.2);
          }

          if (author) {
            gsap.set(author, { opacity: 0, y: 30 });
            tl.to(author, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.5);
          }
        }
      });
    });
  }

  /* ── CTA Section ── */
  function initCTA() {
    const cta = document.querySelector('.cta-section');
    if (!cta) return;

    const tag = cta.querySelector('.section-tag');
    const title = cta.querySelector('.section-title');
    const body = cta.querySelector('.section-body');
    const actions = cta.querySelector('.cta-actions');

    ScrollTrigger.create({
      trigger: cta,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        if (tag) {
          const split = new SplitText(tag, { type: 'chars' });
          gsap.set(split.chars, { opacity: 0, y: 20, rotationX: -90 });
          tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.5, stagger: 0.03, ease: 'back.out(1.7)' }, 0);
        }

        if (title) {
          const split = new SplitText(title, { type: 'lines,words,chars' });
          gsap.set(split.chars, { opacity: 0, y: 40, rotationX: -90 });
          tl.to(split.chars, { opacity: 1, y: 0, rotationX: 0, duration: 0.9, stagger: 0.02, ease: 'expo.out' }, 0.1);
        }

        if (body) {
          const split = new SplitText(body, { type: 'words' });
          gsap.set(split.words, { opacity: 0, y: 25 });
          tl.to(split.words, { opacity: 1, y: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out' }, 0.3);
        }

        if (actions) {
          gsap.set(actions, { opacity: 0, y: 30 });
          tl.to(actions, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.6);
        }
      }
    });
  }

  /* ── Footer ── */
  function initFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const brand = footer.querySelector('.footer-brand');
    const links = footer.querySelectorAll('.footer-links-group');
    const bottom = footer.querySelector('.footer-bottom');

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        if (brand) {
          gsap.set(brand, { opacity: 0, y: 30 });
          tl.to(brand, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0);
        }

        links.forEach((group, i) => {
          gsap.set(group, { opacity: 0, y: 30 });
          tl.to(group, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.15 + i * 0.1);
        });

        if (bottom) {
          gsap.set(bottom, { opacity: 0, y: 20 });
          tl.to(bottom, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.6);
        }
      }
    });
  }

  /* ── Robot Mascot Chat Typing Effect ── */
  function initMascotChat() {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('chat-msg') && node.classList.contains('bot')) {
            const text = node.textContent;
            node.textContent = '';
            gsap.to(node, {
              duration: text.length * 0.02,
              text: { value: text, delimiter: '' },
              ease: 'none',
              onComplete: () => chatBody.scrollTop = chatBody.scrollHeight
            });
          }
        });
      });
    });

    observer.observe(chatBody, { childList: true, subtree: true });
  }

  /* ── Init All ── */
  function init() {
    initSectionReveals();
    initStatsCounter();
    initCarouselText();
    initServiceFullCards();
    initPageHero();
    initTeamCards();
    initTestimonialFullCards();
    initCTA();
    initFooter();
    initMascotChat();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.gsapTextAnimations = { init };
})();
