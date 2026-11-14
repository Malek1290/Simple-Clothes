/* ==========================================================================
   MALEK FOR WEBSITE — interactions
   Boot animation · scroll reveals · counters · WhatsApp deep links
   ========================================================================== */
(function () {
  'use strict';

  var PHONE = '201055247802';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ messages */
  var PLANS = {
    'plan-1': { name: 'الباقة الأولى — البداية', price: '700 جنيه مصري',
      items: ['40 منتج', '5 تعديلات في الموقع', 'خدمة عملاء وحل أي مشكلة في 48 ساعة', 'قاعدة بيانات + دومين'] },
    'plan-2': { name: 'الباقة الموصى بها — النمو', price: '1000 جنيه مصري',
      items: ['80 منتج (Limit)', '12 تعديل في الموقع', 'خدمة عملاء وحل المشكلات خلال 24 ساعة', 'قاعدة بيانات + دومين'] },
    'plan-3': { name: 'الباقة الثالثة — الاحتراف', price: '1300 جنيه مصري',
      items: ['120 منتج', '20 تعديل في الموقع', 'خدمة عملاء وحل المشكلات الفنية خلال 12 ساعة', 'قاعدة بيانات + دومين'] }
  };

  function planMessage(key) {
    var p = PLANS[key];
    if (!p) return '';
    return [
      'السلام عليكم مالك 👋',
      'أنا مهتم بـ ' + p.name + ' بسعر ' + p.price + '.',
      '',
      'تفاصيل الباقة اللي شوفتها على الموقع:',
      p.items.map(function (t) { return '• ' + t; }).join('\n'),
      '',
      'ياريت تكلمني ونبدأ 🚀'
    ].join('\n');
  }

  function generalMessage() {
    return 'السلام عليكم مالك 👋\nشفت موقع Malek for Website وحابب أتكلم معاك عن مشروع متجر إلكتروني.';
  }

  function adviceMessage() {
    return 'السلام عليكم مالك 👋\nشفت الباقات على الموقع ومحتاج ترشيح — مشروعي عبارة عن:';
  }

  function waUrl(text) {
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
  }

  function messageFor(key) {
    if (/^plan-[123]$/.test(key || '')) return planMessage(key);
    if (key === 'advice') return adviceMessage();
    return generalMessage();
  }

  function openWa(url) {
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url; // popup blocked → go directly
  }

  /* Every [data-wa] anchor ships a pre-encoded href (works without JS);
     here we keep it in sync and add a popup-blocked safety net. */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.setAttribute('href', waUrl(messageFor(el.getAttribute('data-wa'))));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* --------------------------------------------------------------- year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------- loader */
  var loader = document.getElementById('loader');
  var fill = document.getElementById('loaderFill');
  var pct = document.getElementById('loaderPct');
  var booted = false;

  function finishBoot() {
    if (booted) return;
    booted = true;
    if (loader) {
      loader.classList.add('is-done');
      loader.setAttribute('aria-hidden', 'true');
      setTimeout(function () {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 1000);
    }
    document.body.classList.remove('is-locked');
    document.documentElement.classList.add('is-ready');
    startHeroCounters();
  }

  if (loader && !reduced) {
    document.body.classList.add('is-locked');
    var progress = 0;
    var holdUntil = Date.now() + 1500; // let the monogram draw itself

    var step = function () {
      var target = Math.min(100, progress + Math.random() * 16 + 6);
      progress = Math.min(target, 96);
      if (fill) fill.style.width = progress + '%';
      if (pct) pct.textContent = String(Math.floor(progress));
      if (progress >= 96 && Date.now() >= holdUntil) {
        progress = 100;
        if (fill) fill.style.width = '100%';
        if (pct) pct.textContent = '100';
        clearInterval(timer);
        setTimeout(finishBoot, 320);
      }
    };
    var timer = setInterval(step, 130);

    window.addEventListener('load', function () {
      holdUntil = Math.min(holdUntil, Date.now() + 450);
    });

    // Hard safety net: never keep a visitor behind the curtain.
    setTimeout(function () { clearInterval(timer); finishBoot(); }, 5200);
  } else {
    finishBoot();
  }

  /* --------------------------------------------------------- hero counters */
  function startHeroCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      var to = parseInt(node.getAttribute('data-count'), 10);
      var suffix = node.getAttribute('data-suffix') || '';
      if (isNaN(to)) return;
      if (reduced) { node.textContent = to + suffix; return; }
      var start = performance.now();
      var dur = 1300;
      var tick = function (now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------------------------------------------------------- sticky header */
  var header = document.querySelector('.site-header');
  var bar = document.getElementById('scrollBar');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------ mobile menu */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    if (open) menu.removeAttribute('inert');
    else menu.setAttribute('inert', '');
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) setMenu(false);
  });

  /* -------------------------------------------------------- reveal on scroll */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
  window.addEventListener('load', function () {
    setTimeout(function () {
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
      });
    }, 80);
  });

  /* ------------------------------------------------------- active nav link */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* --------------------------------------------------- card tilt (pointer) */
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('[data-plan]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'translateY(-8px) rotateX(' + (-y * 3.2).toFixed(2) + 'deg) rotateY(' + (x * 3.6).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------- enquiry -> WhatsApp */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var name = (document.getElementById('f-name').value || '').trim();
      var plan = document.getElementById('f-plan').value || '';
      var note = (document.getElementById('f-note').value || '').trim();

      var lines = [
        'السلام عليكم مالك 👋',
        'اسمي: ' + (name || '—'),
        'الباقة المهتم بها: ' + plan
      ];
      if (note) lines.push('عن المشروع: ' + note);
      lines.push('', 'وصلتلك من موقع Malek for Website.');

      openWa(waUrl(lines.join('\n')));
      if (status) {
        status.textContent = 'فاتح واتساب برسالتك جاهزة — ابعت وبس ✨';
        setTimeout(function () { status.textContent = ''; }, 7000);
      }
    });
  }
})();
