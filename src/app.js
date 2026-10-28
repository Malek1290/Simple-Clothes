/* ==========================================================================
   AUREL — Digital Atelier · interactions
   Vanilla JS, zero dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '201055247802';
  // 11:59 PM, 31 October 2026 — Cairo time (EET, UTC+2 after DST ends).
  var OFFER_END = Date.parse('2026-10-31T23:59:59+02:00');

  /* ---------------------------------------------------------------- year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------- sticky header */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --------------------------------------------------------- mobile menu */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setMenu(false);
  });

  /* ------------------------------------------------------ reveal on scroll */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
  // Safety net: never leave content hidden if an observer callback is missed.
  window.addEventListener('load', function () {
    setTimeout(function () {
      reveals.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
      });
    }, 60);
  });

  /* ---------------------------------------------------- active nav section */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* --------------------------------------------------------- offer countdown */
  var fields = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs')
  };
  var note = document.getElementById('offerNote');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var remaining = OFFER_END - Date.now();
    if (remaining <= 0) {
      Object.keys(fields).forEach(function (k) { if (fields[k]) fields[k].textContent = '00'; });
      if (note) note.textContent = 'This offer has ended — message us and we’ll share what is currently available.';
      clearInterval(timer);
      return;
    }
    var totalSeconds = Math.floor(remaining / 1000);
    var values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      mins: Math.floor((totalSeconds % 3600) / 60),
      secs: totalSeconds % 60
    };
    Object.keys(values).forEach(function (k) {
      if (fields[k]) fields[k].textContent = k === 'days' ? pad(values[k]) : pad(values[k]);
    });
  }
  var timer = setInterval(tick, 1000);
  tick();

  /* ------------------------------------------------- enquiry → WhatsApp */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var get = function (id) {
        var el = document.getElementById(id);
        return el && el.value ? el.value.trim() : '';
      };

      var lines = [
        'Hello AUREL — I would like to enquire about your services.',
        '',
        'Name: ' + get('name'),
        'Phone / WhatsApp: ' + get('phone'),
        'Email: ' + (get('email') || 'Not provided'),
        'Interested in: ' + get('service'),
        'About the brand: ' + (get('message') || 'Not provided yet'),
        '',
        'Sent from the AUREL website.'
      ];
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (status) {
        status.textContent = 'WhatsApp is opening with your enquiry ready to send.';
        setTimeout(function () { status.textContent = ''; }, 7000);
      }
    });
  }
})();
