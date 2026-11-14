
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


/* MW Lab v2 — GSAP 3.14.2 timeline + resolution-aware Canvas theatre. */
(function () {
  'use strict';
  var start = document.getElementById('experimentStart');
  var overlay = document.getElementById('lightStory');
  var canvas = document.getElementById('storyCanvas');
  if (!start || !overlay || !canvas) return;
  var code = document.getElementById('experimentCode');
  var status = document.getElementById('experimentStatus');
  var caption = document.getElementById('storyCaption');
  var chapter = document.getElementById('storyChapter');
  var skip = document.getElementById('storySkip');
  var main = document.querySelector('main');
  var initial = code.textContent;
  var source = '# MW LAB / 001 — light_vs_dark.py\nfrom imagination import Light, Website\n\nsite = Website(theme="black")\nlight = Light(face=None, price=700)\n\nlight.wake()\nlight.cross_border()\nlight.ask("Why fight affordable prices?")\n\nsite.notice(light)\nsite.pull_back(light)\nlight.say("Until we meet again, visitor.")\nsite.seal()';
  var timeline, ctx, state, origin, running = false, frozen = [], savedFocus;
  var width = 1, height = 1, reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var particles = Array.from({length: 64}, function (_,i) {
    return {angle: i * 2.39996, radius: 0.25 + (i % 11)/14, speed: 0.3+(i%7)/9, size: .7+(i%3)*.65};
  });
  // Local joint coordinates, blended continuously by GSAP — not a rigid icon.
  var poses = {
    sleep: [0,-38, 0,-12, -14,1,-20,19, 14,1,20,19, -9,28,-20,43, 12,29,25,42],
    stand: [0,-72, 0,-34, -17,-18,-27,0, 19,-16,29,1, -12,28,-19,56, 14,28,23,56],
    look: [6,-74, 0,-34, -19,-19,-32,-4, 22,-43,36,-58, -12,28,-20,56, 14,28,23,56],
    climb: [8,-76, 0,-34, -28,-55,-40,-79, 24,-61,34,-91, -26,14,-39,31, 18,27,32,50],
    resist: [15,-64, 6,-28, -24,-35,-48,-47, 34,-47,56,-68, -19,22,-42,39, 24,32,44,52],
    wave: [-5,-72, 0,-34, -17,-18,-27,0, 21,-57,24,-88, -12,28,-19,56, 14,28,23,56]
  };
  function jointObject(pose) { var o={}; pose.forEach(function(v,i){o['j'+i]=v;}); return o; }
  function fit() {
    width = window.innerWidth; height = window.innerHeight;
    var ratio = Math.min(window.devicePixelRatio || 1,2);
    canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
    if (ctx) ctx.setTransform(ratio,0,0,ratio,0,0);
    if (running && state && !overlay.hidden) draw();
  }
  function portalRect() {
    var targetW=Math.min(width*.80,760), targetH=Math.min(height*.43,340);
    return {x:origin.x+(width/2-origin.x)*state.expand,
      y:origin.y+(height*.48-origin.y)*state.expand,
      w:origin.w+(targetW-origin.w)*state.expand,
      h:origin.h+(targetH-origin.h)*state.expand};
  }
  function line(points, color, lineWidth) {
    ctx.beginPath();ctx.moveTo(points[0],points[1]);
    for(var i=2;i<points.length;i+=2) ctx.lineTo(points[i],points[i+1]);
    ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
  }
  function draw() {
    if (!ctx || !state || !origin) return;
    ctx.clearRect(0,0,width,height);
    var p=portalRect(), time=timeline ? timeline.time():0;
    ctx.fillStyle='rgba(7,7,7,'+state.dim+')';ctx.fillRect(0,0,width,height);
    // Light leaks from the original code border before it fills the viewport.
    var halo=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,Math.max(width,height)*.7);
    halo.addColorStop(0,'rgba(247,245,241,'+(state.glow*.22)+')');halo.addColorStop(1,'rgba(247,245,241,0)');
    ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,Math.max(.001,state.seal));
    // Nested rounded portal, fine tracing line, and a spatial floor beneath it.
    ctx.shadowColor='#f7f5f1';ctx.shadowBlur=22*state.glow;
    ctx.fillStyle='rgba(13,13,13,.92)';ctx.strokeStyle='rgba(247,245,241,'+state.glow+')';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.roundRect(-p.w/2,-p.h/2,p.w,p.h,22);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.globalAlpha=state.glow*.25;
    ctx.beginPath();ctx.roundRect(-p.w/2+9,-p.h/2+9,p.w-18,p.h-18,16);ctx.stroke();ctx.globalAlpha=1;
    for(var g=1;g<6;g++) line([-p.w/2+15,p.h/2-g*11,p.w/2-15,p.h/2-g*11],'rgba(247,245,241,'+(state.glow*.04)+')',1);
    ctx.restore();
    // Border particles follow deterministic orbital paths; count stays small on phones.
    ctx.save();ctx.globalAlpha=state.glow*state.seal;
    particles.slice(0,width<600?36:64).forEach(function(d){
      var a=d.angle+time*.12*d.speed;
      var x=p.x+Math.cos(a)*p.w*.58*d.radius;
      var y=p.y+Math.sin(a)*p.h*.78*d.radius-time*d.speed%25;
      ctx.fillStyle='#f7f5f1';ctx.globalAlpha=state.glow*(.15+.5*Math.abs(Math.sin(a)));
      ctx.beginPath();ctx.arc(x,y,d.size,0,Math.PI*2);ctx.fill();
    });ctx.restore();
    // Figure: independently animated head/shoulder/elbow/wrist/hip/knee/ankle.
    var unit=Math.min(width/440,height/690,1.25);
    var x=width*state.x,y=height*state.y;
    ctx.save();ctx.translate(x,y);ctx.rotate(state.lean);ctx.scale(unit*state.scale,unit*state.scale);
    ctx.globalAlpha=state.actor;ctx.shadowColor='#fff';ctx.shadowBlur=12*state.glow;
    ctx.fillStyle='#f7f5f1';ctx.beginPath();ctx.ellipse(state.j0,state.j1,12,14,state.lean*.3,0,Math.PI*2);ctx.fill();
    var c='#f7f5f1',thick=6;
    line([state.j0,state.j1+17,state.j2,state.j3,0,5],c,thick);
    line([state.j2,state.j3,state.j4,state.j5,state.j6,state.j7],c,thick);
    line([state.j2,state.j3,state.j8,state.j9,state.j10,state.j11],c,thick);
    line([0,5,state.j12,state.j13,state.j14,state.j15],c,thick);
    line([0,5,state.j16,state.j17,state.j18,state.j19],c,thick);
    ctx.restore();
    // Black ink tendrils attach to the figure, then retract it into the border.
    if (state.ink>0) {
      ctx.save();ctx.strokeStyle='#080808';ctx.lineCap='round';
      [-1,1].forEach(function(side){
        var edge=side<0?-40:width+40;
        var endX=edge+(x-edge)*Math.min(1,state.ink);
        ctx.lineWidth=Math.max(12,width*.025)*state.ink;
        ctx.beginPath();ctx.moveTo(edge,height*.28);
        ctx.bezierCurveTo(width*.5,height*.12,endX-side*width*.15,y+height*.16,endX,y+8);ctx.stroke();
        ctx.lineWidth=2;ctx.strokeStyle='rgba(247,245,241,.18)';ctx.stroke();ctx.strokeStyle='#080808';
      });ctx.restore();
    }
    // Iris closes inward like ink over the luminous border, never flashing.
    if (state.close>0) {
      ctx.fillStyle='#0d0d0d';
      var slit=Math.max(0,1-state.close), slitW=p.w*slit,slitH=p.h*slit;
      ctx.beginPath();ctx.rect(0,0,width,height);ctx.roundRect(p.x-slitW/2,p.y-slitH/2,slitW,slitH,Math.min(22,slitH/2));ctx.fill('evenodd');
    }
  }
  function message(text,label) {
    caption.textContent=text; chapter.textContent=label;
    window.gsap.fromTo(caption,{opacity:0,y:12},{opacity:1,y:0,duration:.8,ease:'power2.out',overwrite:true});
  }
  function restore() {
    if (timeline) { timeline.kill();timeline=null; }
    if(window.gsap) { window.gsap.killTweensOf(caption);window.gsap.set(main,{clearProps:'transform,filter,transformOrigin'}); }
    overlay.hidden=true; overlay.removeAttribute('data-scene'); document.body.classList.remove('story-playing');
    frozen.forEach(function(v){v[0].inert=v[1];});frozen=[];
    code.textContent=initial;caption.textContent='';start.disabled=false;start.removeAttribute('aria-busy');
    status.textContent='جاهز. نجرّب تاني؟'; running=false;
    if(ctx)ctx.clearRect(0,0,width,height);
    if(savedFocus)savedFocus.focus({preventScroll:true});
  }
  function launch() {
    var bounds=document.getElementById('codeWindow').getBoundingClientRect();
    origin={x:bounds.left+bounds.width/2,y:bounds.top+bounds.height/2,w:bounds.width,h:bounds.height};
    ctx=canvas.getContext('2d');
    if(!ctx){restore();status.textContent='المتصفح لا يدعم الرسم. باقي الموقع متاح.';return;}
    overlay.hidden=false;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','حكاية النور وسواد الموقع');
    document.body.classList.add('story-playing');
    Array.from(document.body.children).forEach(function(n){if(n!==overlay&&n.tagName!=='SCRIPT'){frozen.push([n,n.inert]);n.inert=true;}});
    skip.focus({preventScroll:true});fit();
    timeline.eventCallback('onUpdate',draw);
  }
  start.addEventListener('click',function(){
    if(running)return;
    if(!window.gsap){status.textContent='تعذّر تحميل مكتبة الحركة. أعد تحميل الصفحة للمحاولة.';return;}
    savedFocus=start;
    if(reduced.matches){code.textContent=source;status.textContent='الناس بتحاربني علي اسعاري الرخيصه ليه؟ — النور يحاول الخروج، والموقع يعيده — شكلنا هنتقابل تاني يا زائر';return;}
    running=true;start.disabled=true;start.setAttribute('aria-busy','true');status.textContent='بيكتب…';
    state=Object.assign({dim:0,expand:0,glow:0,actor:0,x:.5,y:.60,scale:.3,lean:0,ink:0,seal:1,close:0},jointObject(poses.sleep));
    var typing={count:0};
    timeline=window.gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:restore});
    timeline.to(typing,{count:source.length,duration:1.8,ease:'none',onUpdate:function(){code.textContent=source.slice(0,Math.floor(typing.count));}},0);
    timeline.call(launch,[],2.2);
    timeline.call(function(){message('','01 / AWAKENING');},[],2.2);
    timeline.to(state,{dim:.75,expand:1,glow:1,duration:4.5},2.2);
    timeline.to(main,{scale:.975,filter:'brightness(.55)',duration:4,transformOrigin:'50% 90%'},2.2);
    timeline.to(state,Object.assign({actor:1,scale:1,y:.56,duration:5},jointObject(poses.stand)),5.5);
    timeline.to(state,Object.assign({lean:.05,duration:2.6},jointObject(poses.look)),10.5);
    timeline.call(function(){message('الناس بتحاربني علي اسعاري الرخيصه ليه؟','02 / A QUESTION OF PRICE');overlay.dataset.scene='speak';},[],12);
    timeline.to(state,{y:.552,duration:1.2,repeat:3,yoyo:true,ease:'sine.inOut'},12);
    timeline.call(function(){message('','03 / CROSSING THE LINE');overlay.dataset.scene='escape';},[],18);
    timeline.to(state,Object.assign({x:.66,y:.37,lean:.18,scale:1.12,duration:5.8},jointObject(poses.climb)),18);
    timeline.to(main,{x:-5,rotation:-.25,duration:2,yoyo:true,repeat:1},22);
    timeline.call(function(){message('','04 / THE DARK NOTICES');overlay.dataset.scene='capture';},[],24);
    timeline.to(state,{ink:1,dim:.9,duration:3.5},24);
    timeline.to(state,Object.assign({lean:-.24,x:.60,y:.44,duration:3},jointObject(poses.resist)),26);
    timeline.to(state,Object.assign({x:.5,y:.57,scale:.75,lean:0,duration:5},jointObject(poses.stand)),29);
    timeline.to(state,{ink:0,duration:3},32);
    timeline.call(function(){message('شكلنا هنتقابل تاني يا زائر','05 / UNTIL NEXT TIME');overlay.dataset.scene='farewell';},[],34);
    timeline.to(state,Object.assign({duration:1.8},jointObject(poses.wave)),34);
    timeline.to(state,{j10:35,duration:.8,yoyo:true,repeat:3,ease:'sine.inOut'},36);
    timeline.call(function(){message('','06 / SEALED, NOT FORGOTTEN');overlay.dataset.scene='seal';},[],40);
    timeline.to(state,{close:1,actor:0,glow:0,duration:4},40);
    timeline.to(canvas,{opacity:0,duration:2},44);
    timeline.to(main,{scale:1,x:0,rotation:0,filter:'brightness(1)',duration:2},44);
    window.gsap.set(canvas,{opacity:1});
  });
  skip.addEventListener('click',restore);
  document.addEventListener('keydown',function(e){if(running&&e.key==='Escape')restore();if(running&&!overlay.hidden&&e.key==='Tab'){e.preventDefault();skip.focus();}});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&running)restore();});
  window.addEventListener('resize',fit,{passive:true});
  if(reduced.addEventListener)reduced.addEventListener('change',function(e){if(e.matches&&running)restore();});
})();
