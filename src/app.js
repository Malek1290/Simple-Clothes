
/* ==========================================================================
   MW — MALEK FOR WEBSITE
   Loader choreography · reveals · counters · WhatsApp deep links
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
      'السلام عليكم مالك ',
      'أنا مهتم بـ ' + p.name + ' بسعر ' + p.price + '.',
      '',
      'تفاصيل الباقة اللي شوفتها على الموقع:',
      p.items.map(function (t) { return '• ' + t; }).join('\n'),
      '',
      'ياريت تكلمني ونبدأ 🚀'
    ].join('\n');
  }

  function generalMessage() {
    return 'السلام عليكم مالك \nشفت موقع Malek for Website وحابب أتكلم معاك عن مشروع متجر إلكتروني.';
  }

  function adviceMessage() {
    return 'السلام عليكم مالك \nشفت الباقات على الموقع ومحتاج ترشيح — مشروعي عبارة عن:';
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
    if (!win) window.location.href = url;
  }

  /* render.py already bakes the encoded hrefs into the HTML, so links work
     without JS. This pass only re-asserts target/rel and keeps the copy above
     and the markup in agreement if one of them is edited. */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.setAttribute('href', waUrl(messageFor(el.getAttribute('data-wa'))));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* --------------------------------------------------------------- year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------- loader
     The mark assembles at 0.12–1.2s, the wordmark at 0.82–1.45s, so the
     counter is paced to finish just after the last letter lands.        */
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
    startCounters();
  }

  if (loader && !reduced) {
    document.body.classList.add('is-locked');
    var duration = 1750;          // matches the CSS choreography
    var started = Date.now();

    var step = function () {
      var t = Math.min(1, (Date.now() - started) / duration);
      // ease-out so the number decelerates into 100
      var eased = 1 - Math.pow(1 - t, 2.2);
      var value = Math.round(eased * 100);
      if (fill) fill.style.width = value + '%';
      if (pct) pct.textContent = value < 10 ? '0' + value : String(value);
      if (t >= 1) {
        clearInterval(timer);
        setTimeout(finishBoot, 260);
      }
    };
    var timer = setInterval(step, 40);
    step();

    // Never keep a visitor behind the curtain.
    setTimeout(function () { clearInterval(timer); finishBoot(); }, 4600);
  } else {
    finishBoot();
  }

  /* ----------------------------------------------------------- counters */
  function startCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      var to = parseInt(node.getAttribute('data-count'), 10);
      var suffix = node.getAttribute('data-suffix') || '';
      if (isNaN(to)) return;
      if (reduced) { node.textContent = to + suffix; return; }
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / 1200);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ------------------------------------------------------ sticky header */
  var header = document.querySelector('.site-header');
  var bar = document.getElementById('scrollBar');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* --------------------------------------------------------- mobile menu */
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
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });

  /* ----------------------------------------------------------- reveals */
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

  /* ------------------------------------------------------ active nav link */
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

  /* ---------------------------------------------------- enquiry → WhatsApp */
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
        'السلام عليكم مالك ',
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


/* MW Lab: fast visual typing, slow user-initiated DOM theatre. No Python eval. */
(function () {
  'use strict';
  var start = document.getElementById('experimentStart');
  var overlay = document.getElementById('lightStory');
  var code = document.getElementById('experimentCode');
  if (!start || !overlay || !code) return;
  var caption = document.getElementById('storyCaption');
  var status = document.getElementById('experimentStatus');
  var chapter = document.getElementById('storyChapter');
  var initial = code.textContent;
  var source = '# MW LAB — experiment.py\nfrom imagination import Light, Website\n\nsite = Website(theme="black")\nvisitor = Light(shape="stick_figure", face=None)\n\nvisitor.say("Why fight affordable prices?")\nvisitor.escape(border="white")\nsite.notice(visitor)\nsite.bring_back(visitor)\n\nvisitor.say("Until we meet again, visitor.")\nsite.seal()';
  var timers = [], running = false, previousFocus, inertNodes = [];
  function later(fn, delay) { timers.push(window.setTimeout(fn, delay)); }
  function reset() {
    timers.forEach(window.clearTimeout); timers = [];
    overlay.hidden = true; overlay.removeAttribute('data-scene');
    document.body.classList.remove('story-playing');
    inertNodes.forEach(function (entry) { entry[0].inert = entry[1]; }); inertNodes = [];
    caption.textContent = ''; code.textContent = initial;
    start.disabled = false; start.removeAttribute('aria-busy');
    status.textContent = 'جاهز. نجرّب تاني؟'; running = false;
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  }
  function scene(name, text, label) {
    overlay.dataset.scene = name; caption.textContent = text || ''; chapter.textContent = label;
  }
  function play() {
    overlay.hidden = false; overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-label','حكاية النور وسواد الموقع');
    document.body.classList.add('story-playing');
    Array.from(document.body.children).forEach(function (node) {
      if (node !== overlay && !node.contains(overlay) && node.tagName !== 'SCRIPT') { inertNodes.push([node,node.inert]); node.inert = true; }
    });
    // The overlay is a sibling inside main; isolate the rest without inerting its ancestor.
    Array.from(document.querySelector('main').children).forEach(function (node) {
      if (node !== overlay && !node.contains(overlay)) { inertNodes.push([node,node.inert]); node.inert = true; }
    });
    document.getElementById('storySkip').focus({ preventScroll: true });
    scene('glow','','01 / A LITTLE LIGHT');
    later(function () { scene('emerge','','02 / OUT OF THE BORDER'); }, 200);
    later(function () { scene('speak','الناس بتحاربني علي اسعاري الرخيصه ليه؟','03 / THE QUESTION'); }, 6500);
    later(function () { scene('escape','','04 / THE ESCAPE'); }, 12500);
    later(function () { scene('capture','الموقع لاحظ… مفيش خروج من الإطار.','05 / THE WEBSITE ANSWERS'); }, 19000);
    later(function () { scene('farewell','شكلنا هنتقابل تاني يا زائر','06 / UNTIL NEXT TIME'); }, 26000);
    later(function () { scene('seal','','07 / BACK TO THE CODE'); }, 32500);
    later(reset, 39000);
  }
  start.addEventListener('click', function () {
    if (running) return;
    running = true; previousFocus = start; start.disabled = true; start.setAttribute('aria-busy','true');
    status.textContent = 'بيكتب…'; code.textContent = '';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      code.textContent = source;
      status.textContent = 'الناس بتحاربني علي اسعاري الرخيصه ليه؟ — الموقع يرجّع الشخصية للإطار — شكلنا هنتقابل تاني يا زائر';
      start.disabled = false; start.removeAttribute('aria-busy'); running = false; return;
    }
    // ~2 seconds of typing; the theatre itself lasts 39 seconds.
    var index = 0;
    function type() {
      index = Math.min(index + 6, source.length); code.textContent = source.slice(0,index);
      if (index < source.length) later(type, 28);
      else { status.textContent = 'اكتمل الكود. النور بيصحى…'; later(play,500); }
    }
    type();
  });
  document.getElementById('storySkip').addEventListener('click',reset);
  document.addEventListener('keydown',function (event) { if (running && event.key === 'Escape') reset(); });
  document.addEventListener('visibilitychange',function () { if (document.hidden && running) reset(); });
})();
