
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


/* MW Lab v4 — original code box is the stage. No portal or duplicate frame. */
(function () {
  'use strict';
  var start=document.getElementById('experimentStart'),overlay=document.getElementById('lightStory');
  if(!start||!overlay)return;
  var canvas=document.getElementById('storyCanvas'),code=document.getElementById('experimentCode');
  var box=document.getElementById('codeWindow'),pre=code.closest('pre'),caption=document.getElementById('storyCaption');
  var chapter=document.getElementById('storyChapter'),skip=document.getElementById('storySkip');
  var status=document.getElementById('experimentStatus'),initial=code.textContent;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)');
  var source='# light_vs_dark.py\nfrom mw import Website, Light\n\nsite = Website(theme="black")\nlight = Light(face=None)\n\nlight.wake()\nlight.find_footing(code.lines)\nlight.climb(code.lines)\n\nlight.ask("Why fight low prices?")\nlight.try_to_escape()\nsite.notice(light)\nsite.cover_with_black()\nlight.say("See you again, visitor.")';
  var timeline,ctx,state,anchors=[],seeds=[],inert=[],running=false,captionFx;
  var width=1,height=1,dpr=1,focusBefore,originalBoxClass;
  function fit(){
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
    measure();if(running&&!overlay.hidden)draw();
  }
  function measure(){
    var b=pre.getBoundingClientRect(),lines=Array.from(code.querySelectorAll('.story-code-line'));
    anchors=[];
    [13,12,10,8,6,4,3].forEach(function(index,i){
      var line=lines[index];if(!line)return;
      var r=line.getBoundingClientRect();
      // Feet land on the visible text baseline; x alternates along its real width.
      var x=r.left+Math.min(r.width-10,Math.max(28,r.width*(i%2?.62:.30)));
      anchors.push({x:Math.max(b.left+28,Math.min(b.right-28,x)),y:r.bottom-3});
    });
  }
  function line(points,w,alpha){
    ctx.beginPath();ctx.moveTo(points[0],points[1]);for(var i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);
    ctx.lineWidth=w;ctx.strokeStyle='rgba(247,245,241,'+(alpha===undefined?1:alpha)+')';ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
  }
  function location(){
    if(!anchors.length)return{x:width*.5,y:height*.5};
    var index=Math.min(anchors.length-1,Math.floor(state.step)),f=state.step-index;
    var a=anchors[index],b=anchors[Math.min(index+1,anchors.length-1)];
    var boxRect=box.getBoundingClientRect(),escapeX=boxRect.left+boxRect.width*.67;
    return{x:(a.x+(b.x-a.x)*f)*(1-state.escape)+escapeX*state.escape,
      y:(a.y+(b.y-a.y)*f-Math.sin(f*Math.PI)*14)*(1-state.escape)+(boxRect.top+30)*state.escape};
  }
  function character(x,y,scale,alpha,climb){
    var phase=(state.step%1),swing=Math.sin(phase*Math.PI*2)*climb;
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha=alpha;
    // Solid pictogram proportions from assets/character/reference.png, column one.
    // Round head, tapered filled torso and thick rounded limbs; no face or glow.
    var lean=state.escape*.12;ctx.rotate(lean);
    ctx.fillStyle='#f7f5f1';
    ctx.beginPath();ctx.arc(0,-72,8.5,0,Math.PI*2);ctx.fill();
    // Keep the small reference gap between the head and shoulders.
    ctx.beginPath();ctx.moveTo(-7,-59);ctx.quadraticCurveTo(0,-63,7,-59);
    ctx.lineTo(9,-35);ctx.quadraticCurveTo(0,-30,-9,-35);ctx.closePath();ctx.fill();
    // Arms retain the soft, substantial silhouette of the supplied character.
    line([-7,-55,-13,-44-swing*5,-17,-34-swing*10-state.escape*27],8);
    line([7,-55,14,-48+swing*5,18,-39+swing*10-state.escape*36],8);
    // Straight pictogram legs articulate at the knees while climbing.
    line([-4,-35,-9,-18+swing*7,-15,0],9);
    line([4,-35,9,-18-swing*7,15,-Math.max(0,swing*10)],9);
    ctx.restore();
  }
  function draw(){
    if(!ctx||!state)return;ctx.clearRect(0,0,width,height);
    var p=location(),unit=Math.min(1.3,Math.max(.90,width/650)),b=pre.getBoundingClientRect();
    // Drawing is clipped to the ORIGINAL pre until the character crosses its top.
    ctx.save();
    if(state.escape<.01){ctx.beginPath();ctx.rect(b.left,b.top,b.width,b.height);ctx.clip();}
    if(anchors.length){
      var i=Math.min(anchors.length-1,Math.floor(state.step)),a=anchors[i];
      line([a.x-19,a.y+3,a.x+30,a.y+3],1,state.actor*.55);
    }
    character(p.x,p.y+(1-state.rise)*65,unit,state.actor,1-state.escape);
    ctx.restore();
    // Black comes from page features AND every edge. All paths end in full coverage.
    if(state.dark>0){
      ctx.fillStyle='#000';
      seeds.forEach(function(seed,i){
        var amount=Math.max(0,Math.min(1,(state.dark-(i%4)*.035)/.88));
        var radius=amount*Math.hypot(width,height)*.85;
        ctx.beginPath();ctx.ellipse(seed.x*width,seed.y*height,radius*(.75+(i%3)*.12),radius,seed.angle,0,Math.PI*2);ctx.fill();
      });
      if(state.dark>=.999)ctx.fillRect(0,0,width,height);
    }
    // After total blackout, only a tiny fragment reappears. No replacement box.
    if(state.peek>0){
      var px=width*.58,py=Math.min(height*.57,height-190);
      ctx.save();ctx.globalAlpha=state.peek;
      line([px-38,py+17,px+43,py+12],1,.35);
      ctx.beginPath();ctx.rect(px-48,py-45,100,60);ctx.clip();
      ctx.fillStyle='#f7f5f1';ctx.beginPath();ctx.arc(px+4,py+4+(1-state.peek)*28,8.5,0,Math.PI*2);ctx.fill();
      line([px-27,py+14,px-27,py+8,px-21,py+9,px-19,py+14],7);
      ctx.restore();
    }
    canvas.style.opacity=state.fade;
  }
  function message(text,label){
    if(captionFx)captionFx.cancel();caption.textContent=text;chapter.textContent=label;
    captionFx=anime.animate(caption,{opacity:[0,1],duration:800,ease:'outSine'});
  }
  function restore(){
    if(timeline){timeline.cancel();timeline=null;}if(captionFx){captionFx.cancel();captionFx=null;}
    overlay.hidden=true;overlay.removeAttribute('data-scene');document.body.classList.remove('story-playing');
    inert.forEach(function(v){v[0].inert=v[1];});inert=[];
    box.className=originalBoxClass||'code-window';code.textContent=initial;caption.textContent='';
    start.disabled=false;start.removeAttribute('aria-busy');status.textContent='جاهز. نجرّب تاني؟';
    running=false;if(ctx)ctx.clearRect(0,0,width,height);if(focusBefore)focusBefore.focus({preventScroll:true});
  }
  function launch(){
    ctx=canvas.getContext('2d');if(!ctx){restore();return;}
    code.textContent='';source.split('\n').forEach(function(text){
      var row=document.createElement('span');row.className='story-code-row';
      var span=document.createElement('span');span.className='story-code-line';span.textContent=text||' ';
      row.appendChild(span);code.appendChild(row);
    });
    box.scrollIntoView({block:'center',behavior:'instant'});
    overlay.hidden=false;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','الشخصية تتسلّق الكود ثم يغطي السواد الموقع');
    document.body.classList.add('story-playing');box.classList.add('code-window--playing');
    Array.from(document.body.children).forEach(function(n){if(n!==overlay&&n.tagName!=='SCRIPT'){inert.push([n,n.inert]);n.inert=true;}});
    seeds=[{x:0,y:0,angle:0},{x:1,y:0,angle:.4},{x:0,y:1,angle:.8},{x:1,y:1,angle:0},{x:.5,y:0,angle:.3},{x:.5,y:1,angle:.6},{x:0,y:.5,angle:0},{x:1,y:.5,angle:.6}];
    document.querySelectorAll('.plan,.feature,.brand__mark,.wa-float').forEach(function(n){var r=n.getBoundingClientRect();if(r.bottom>0&&r.top<height)seeds.push({x:(r.left+r.width/2)/width,y:(r.top+r.height/2)/height,angle:.2});});
    fit();skip.focus({preventScroll:true});status.textContent='الشخصية جوّه الكود…';
  }
  start.addEventListener('click',function(){
    if(running)return;if(!window.anime){status.textContent='تعذر تحميل مكتبة الحركة. أعد المحاولة.';return;}
    if(reduced.matches){code.textContent=source;status.textContent='الشخصية تتسلق سطور الكود. السواد يغطي الصفحة، ثم تظهر وتقول: هشوفك تاني يا زائر';return;}
    focusBefore=start;originalBoxClass=box.className;running=true;start.disabled=true;start.setAttribute('aria-busy','true');
    box.scrollIntoView({block:'center',behavior:'instant'});
    state={step:0,rise:0,actor:0,escape:0,look:0,dark:0,peek:0,fade:1};var typing={count:0};
    timeline=anime.createTimeline({autoplay:false,defaults:{ease:'inOutSine'},onRender:function(){if(!overlay.hidden)draw();},onComplete:restore});
    timeline.add(typing,{count:source.length,duration:1800,ease:'linear',onUpdate:function(){code.textContent=source.slice(0,Math.floor(typing.count));}},0);
    timeline.call(launch,2200);
    timeline.call(function(){overlay.dataset.scene='inside';message('','01 / INSIDE THE CODE');},2200);
    timeline.add(state,{actor:1,rise:1,duration:3500,ease:'outCubic'},2500);
    for(var i=0;i<6;i++)timeline.add(state,{step:i+1,duration:2200,ease:'inOutSine'},6000+i*2400);
    timeline.call(function(){overlay.dataset.scene='speak';message('الناس بتحاربني علي اسعاري الرخيصه ليه؟','02 / ONE LAST LINE');},20500);
    timeline.add(state,{look:1,duration:1600,alternate:true,loop:1},21000);
    timeline.call(function(){overlay.dataset.scene='escape';message('','03 / ALMOST OUT');},26700);
    timeline.add(state,{escape:1,duration:5000,ease:'inOutCubic'},26700);
    timeline.call(function(){overlay.dataset.scene='capture';message('','04 / THE WHOLE SITE ANSWERS');},32300);
    timeline.add(state,{dark:1,duration:7500,ease:'inOutCubic'},32300);
    timeline.add(state,{actor:0,duration:1800},38000);
    timeline.call(function(){overlay.dataset.scene='blackout';message('','');},40000);
    timeline.add(state,{peek:1,duration:2500,ease:'outCubic'},41800);
    timeline.call(function(){overlay.dataset.scene='farewell';message('هشوفك تاني يا زائر','05 / STILL HERE');},44500);
    timeline.add(state,{peek:0,duration:2000},50000);
    timeline.call(function(){overlay.dataset.scene='seal';message('','');},52000);
    timeline.add(state,{fade:0,duration:2200},52500);
    timeline.play();
  });
  skip.addEventListener('click',restore);
  document.addEventListener('keydown',function(e){if(running&&e.key==='Escape')restore();if(running&&!overlay.hidden&&e.key==='Tab'){e.preventDefault();skip.focus();}});
  document.addEventListener('visibilitychange',function(){if(document.hidden&&running)restore();});
  addEventListener('resize',fit,{passive:true});
  reduced.addEventListener('change',function(e){if(e.matches&&running)restore();});
})();
