/* ============================================================
   TEAM REVEAL — Scroll-triggered opening animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Cinematic intro lines ────────────────────────────── */
  var introLines = document.querySelectorAll('.team-cinematic-line');
  var introSub = document.querySelector('.team-cinematic-sub');

  if (introLines.length) {
    var introObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          introObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    introLines.forEach(function (el) {
      introObserver.observe(el);
    });

    if (introSub) {
      var subObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            subObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      subObserver.observe(introSub);
    }
  }

  /* ── Team member rows ─────────────────────────────────── */
  var memberRows = document.querySelectorAll('[data-team-reveal]');

  if (memberRows.length) {
    var memberObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          memberObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    memberRows.forEach(function (row) {
      memberObserver.observe(row);
    });
  }

  /* Cursor-following cyber portrait reveal */
  var teamPhotos = document.querySelectorAll('.team-member-photo');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setRevealPosition(photo, clientX, clientY) {
    var rect = photo.getBoundingClientRect();
    var x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    var y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    var size = Math.max(92, Math.min(rect.width, rect.height) * 0.28);

    photo.style.setProperty('--reveal-x', x + 'px');
    photo.style.setProperty('--reveal-y', y + 'px');
    photo.style.setProperty('--reveal-size', size + 'px');
  }

  teamPhotos.forEach(function (photo) {
    photo.addEventListener('pointerenter', function (event) {
      if (reduceMotion) return;
      photo.classList.add('is-revealing');
      setRevealPosition(photo, event.clientX, event.clientY);
    });

    photo.addEventListener('pointermove', function (event) {
      if (reduceMotion) return;
      setRevealPosition(photo, event.clientX, event.clientY);
    });

    photo.addEventListener('pointerleave', function () {
      photo.classList.remove('is-revealing');
      photo.style.setProperty('--reveal-size', '0px');
    });

    photo.addEventListener('focusin', function () {
      photo.classList.add('is-revealing');
      photo.style.setProperty('--reveal-x', '50%');
      photo.style.setProperty('--reveal-y', '38%');
      photo.style.setProperty('--reveal-size', '110px');
    });

    photo.addEventListener('focusout', function () {
      photo.classList.remove('is-revealing');
      photo.style.setProperty('--reveal-size', '0px');
    });
  });

})();
