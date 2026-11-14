"""Generate a self-contained-in-repo direction study; not a Rive export."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent

def figure(name, x=0, y=0, scale=1):
    # Shared silhouette proportions, deliberate weight-bearing poses.
    poses = {
      'peek': {'head':(205,202,-12),'body':'M214 237 Q227 264 238 302','arms':['M215 247 Q180 240 156 281 L155 293','M220 250 Q254 234 278 279 L279 293'],'legs':['M238 302 Q217 332 205 365','M238 302 Q265 330 278 365']},
      'climb': {'head':(246,156,14),'body':'M237 189 Q227 227 226 264','arms':['M235 204 Q205 219 179 280 L173 292','M238 205 Q281 222 298 280 L301 292'],'legs':['M226 264 Q287 249 307 283 L324 293','M226 264 Q209 312 225 350 L242 369']},
      'bye': {'head':(218,215,-9),'body':'M221 249 Q227 280 229 313','arms':['M220 260 Q185 264 173 282 L173 294','M224 261 Q262 252 268 217 L267 198'],'legs':['M229 313 Q210 335 199 365','M229 313 Q255 339 266 365']},
    }
    p=poses[name]; hx,hy,angle=p['head']
    limbs=''.join(f'<path d="{d}"/>' for d in p['legs']+p['arms'])
    return f'''<g transform="translate({x} {y}) scale({scale})" class="figure figure--{name}">
      <g class="rig-body" fill="none" stroke="#f7f5f1" stroke-width="13" stroke-linecap="round" stroke-linejoin="round">{limbs}<path stroke-width="17" d="{p['body']}"/></g>
      <ellipse cx="{hx}" cy="{hy}" rx="19" ry="23" fill="#f7f5f1" transform="rotate({angle} {hx} {hy})"/>
    </g>'''

def still(name):
    return f'''<svg viewBox="0 0 480 410" role="img" aria-label="{name}">
      <defs><linearGradient id="shade-{name}" x2="0" y2="1"><stop stop-color="#171717"/><stop offset="1" stop-color="#0d0d0d"/></linearGradient></defs>
      <rect x="35" y="81" width="410" height="296" rx="19" fill="url(#shade-{name})" stroke="#ffffff15"/>
      <path d="M59 113H170M59 130H128M59 147H151" stroke="#ffffff0d" stroke-width="3"/>
      {figure(name)}
      <path d="M35 294H445V378H35Z" fill="#0d0d0d"/>
      <path d="M35 294H445" stroke="#f7f5f1" stroke-width="1.5"/>
      <ellipse cx="234" cy="298" rx="79" ry="4" fill="#ffffff0b"/>
      <path d="M65 327H145M65 344H185" stroke="#ffffff12" stroke-width="3"/>
    </svg>'''

page='''<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MW — اختبار إخراج خارج الإطار</title>
<style>
:root{color-scheme:dark;--paper:#f7f5f1;--ink:#0d0d0d;--muted:#aaa7a1}*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--paper);font-family:Tahoma,Arial,sans-serif;line-height:1.9}button{font:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid white;outline-offset:5px}button:disabled{cursor:wait;opacity:.5}.wrap{width:min(1240px,calc(100% - 40px));margin:auto}.top{padding:25px 0;border-bottom:1px solid #ffffff20;display:flex;align-items:center;justify-content:space-between}.top img{width:46px;height:46px}.small{font:11px monospace;letter-spacing:.1em;color:var(--muted)}header{padding:64px 0 38px;max-width:820px}h1{font-size:clamp(34px,6vw,70px);line-height:1.3;margin:18px 0 24px;letter-spacing:-.04em}header p{font-size:16px;max-width:660px;color:var(--muted)}.tag{display:inline-flex;border:1px solid #ffffff30;border-radius:30px;padding:7px 13px;font-size:11px}.shots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.shot{border:1px solid #ffffff22;border-radius:22px;overflow:hidden;background:#111}.shot svg{display:block;width:100%;height:auto}.shot__copy{padding:0 23px 25px}.shot h2{font-size:20px;margin:0 0 9px}.shot p{font-size:13px;color:var(--muted);margin:0}.lab{margin-top:68px;padding-top:32px;border-top:1px solid #ffffff25}.lab h2{font-size:28px;margin:8px 0}.lab p{color:var(--muted);font-size:14px;max-width:740px}.stage{margin-top:24px;border:1px solid #ffffff35;border-radius:26px;overflow:hidden;background:#101010}.bar,.controls{padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.bar{border-bottom:1px solid #ffffff20;direction:ltr;font:11px monospace;color:var(--muted)}.stage svg{display:block;width:100%;height:auto;max-height:60vh;min-height:240px}.controls{border-top:1px solid #ffffff20}.controls p{margin:0;font-size:12px}.buttons{display:flex;gap:10px;flex-shrink:0}.buttons button{border:1px solid #ffffff45;background:transparent;color:var(--paper);min-height:44px;padding:9px 19px;border-radius:12px}.buttons .primary{background:var(--paper);color:var(--ink)}.notes{display:grid;grid-template-columns:1fr 1fr;gap:36px;padding:46px 0 64px}.notes h3{font-size:18px}.notes p,.notes li{font-size:13px;color:var(--muted)}footer{padding:24px 0;border-top:1px solid #ffffff20;font-size:12px;color:var(--muted)}a{color:var(--paper)}.study-head,.study-arm,.study-body{transform-box:fill-box}.contact-shadow{opacity:0}
@media(max-width:760px){.shots{grid-template-columns:1fr}.shot{display:grid;grid-template-columns:1fr 1fr;align-items:center}.shot__copy{padding:18px}.shot h2{font-size:18px}.shot p{font-size:12px}.notes{grid-template-columns:1fr;gap:12px}.controls{align-items:flex-start;flex-direction:column}.buttons{width:100%}.buttons button{flex:1}.wrap{width:calc(100% - 28px)}header{padding-top:40px}.lab{margin-top:40px}.stage svg{min-height:220px}.bar{padding:14px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body><div class="wrap">
<nav class="top" aria-label="المعاينة"><img src="assets/brand/mw-mark-light.svg" alt="MW"><span class="small" dir="ltr">DIRECTION STUDY / 001</span><a href="index.html">الموقع الحالي ↗</a></nav>
<header><span class="tag">اختبار إخراج — قبل الإنتاج النهائي</span><h1>شخصية لها وزن.<br>مش ضوء بيتحرّك.</h1><p>«خارج الإطار» — نختبر شكل الشخصية، أماكن ارتكاز اليدين، وتوقيت ظهور الرأس. دي مرحلة اعتماد الرسم والحركة، وليست النسخة النهائية أو ملف Rive.</p></header>
<section class="shots" aria-label="ثلاث لقطات لاتجاه الشخصية">__SHOTS__</section>
<section class="lab" aria-labelledby="testTitle"><span class="small" dir="ltr">MOTION PROOF / HAND → HEAD → WEIGHT</span><h2 id="testTitle">أول ثماني ثواني.</h2><p>يد تمسك الحافة. الرأس يظهر بحذر. اليد الثانية تثبّت الجسم، ثم الذراعان يسحبانه. راقب إن نقطتي الارتكاز ما بيتزحلقوش على الحافة.</p>
<div class="stage"><div class="bar"><span>experiment.py</span><span>PREVIEW · NOT A RIVE EXPORT</span></div>
<svg id="motionStage" viewBox="0 0 960 480" role="img" aria-label="اختبار خروج اليد والرأس فوق حافة محرر الكود">
<defs><clipPath id="upperClip"><rect width="960" height="322"/></clipPath><linearGradient id="panel" x2="0" y2="1"><stop stop-color="#1a1a1a"/><stop offset="1" stop-color="#111"/></linearGradient></defs>
<rect x="90" y="62" width="780" height="342" rx="20" fill="url(#panel)" stroke="#ffffff18"/>
<g fill="none" stroke="#ffffff12" stroke-width="3"><path d="M126 104H290M126 128H244M126 152H276"/></g>
<g clip-path="url(#upperClip)">
<g fill="none" stroke="#f7f5f1" stroke-linecap="round" stroke-linejoin="round">
<path id="testTorso" stroke-width="20"/>
<path id="leftArm" stroke-width="14"/>
<path id="rightArm" stroke-width="14"/>
</g>
<g id="testHead"><ellipse rx="22" ry="27" fill="#f7f5f1"/></g>
</g>
<path d="M90 322H870V404H90Z" fill="#111"/>
<path id="edge" d="M90 322H870" stroke="#a7a49e" stroke-width="1.2"/>
<ellipse id="contactLeft" cx="392" cy="326" rx="19" ry="3" fill="#000"/>
<ellipse id="contactRight" cx="560" cy="326" rx="19" ry="3" fill="#000"/>
<path id="leftHand" d="M382 320Q391 312 400 320L400 329M390 319V329" fill="none" stroke="#f7f5f1" stroke-width="7" stroke-linecap="round"/>
<path id="rightHand" d="M550 320Q559 312 568 320L568 329M558 319V329" fill="none" stroke="#f7f5f1" stroke-width="7" stroke-linecap="round"/>
<g stroke="#ffffff10" stroke-width="3"><path d="M126 354H264M126 378H222"/></g>
</svg>
<div class="controls"><p id="motionStatus" role="status">ساكن. اضغط تشغيل الاختبار.</p><div class="buttons"><button type="button" id="playStudy" class="primary">تشغيل الاختبار ▶</button><button type="button" id="stopStudy" disabled>إيقاف وإعادة</button></div></div></div></section>
<section class="notes"><div><h3>المطلوب اعتماده هنا</h3><ul><li>شخصية مصمتة من غير وش أو فم.</li><li>حركة مفاصل ووزن عند الشد، مش تمدد للجسم كله.</li><li>أسود وأبيض من هوية MW، بدون وهج يخفي الرسم.</li><li>وقفة قصيرة قبل ظهور الرأس وبعد الاستقرار.</li></ul></div><div><h3>الخطوة التالية: أصل الحركة</h3><p>بعد اعتماد الاتجاه، يتبني Rig ومشاهد القصة داخل Rive Editor، ثم يربط ملف ‎.riv بالموقع. المعاينة الحالية تستخدم anime.js لاختبار التوقيت والهندسة فقط؛ لم يتم إنتاج ملف Rive بعد.</p><a href="docs/light-vs-dark-storyboard.ar.md">السيناريو الكامل للمشاهد ↗</a></div></section>
<footer>الاتجاه المقترح 001 — الموقع الأساسي لم يتغير. لا يبدأ أي أنيميشن تلقائيًا.</footer></div>
<script src="assets/vendor/anime.umd.min.js"></script>
<script>
(function(){
'use strict';
const $=id=>document.getElementById(id),play=$('playStudy'),stop=$('stopStudy'),status=$('motionStatus');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let tl=null,s;
function render(){
 $('leftHand').style.opacity=s.left;$('rightHand').style.opacity=s.right;
 $('contactLeft').style.opacity=s.left*.7;$('contactRight').style.opacity=s.right*.7;
 $('testHead').setAttribute('transform',`translate(${480+s.look} ${s.head}) rotate(${s.tilt})`);
 // Wrists stay anchored at the ledge while shoulders rise and elbows bend.
 $('leftArm').setAttribute('d',`M${462+s.shift} ${s.shoulder} Q${406+s.elbow} ${s.shoulder+8} 392 321`);
 $('rightArm').setAttribute('d',`M${493+s.shift} ${s.shoulder} Q${548-s.elbow} ${s.shoulder+8} 560 321`);
 $('leftArm').style.opacity=s.left;$('rightArm').style.opacity=s.right;
 $('testTorso').setAttribute('d',`M${480+s.shift} ${s.shoulder-10}Q${485+s.shift} ${s.shoulder+33} ${489+s.shift} ${s.shoulder+75}`);
}
function idle(){s={left:0,right:0,head:382,shoulder:424,look:0,tilt:0,shift:0,elbow:0};render();}
function reset(){if(tl){tl.cancel();tl=null;}idle();play.disabled=false;stop.disabled=true;status.textContent='جاهز لإعادة الاختبار.';}
play.addEventListener('click',()=>{
 if(!window.anime){status.textContent='تعذر تحميل مكتبة المعاينة.';return;}
 if(reduced.matches){s={left:1,right:1,head:238,shoulder:285,look:4,tilt:6,shift:0,elbow:15};render();status.textContent='لقطة ثابتة احترامًا لإعداد تقليل الحركة.';return;}
 idle();play.disabled=true;stop.disabled=false;status.textContent='١ / اليد تثبّت مكانها';
 tl=anime.createTimeline({autoplay:false,defaults:{ease:'inOutSine'},onRender:render,onComplete:()=>{play.disabled=false;stop.disabled=true;status.textContent='انتهى الاختبار. راجع إحساس الوزن وثبات اليدين.';}});
 tl.add(s,{left:1,duration:600},100);
 tl.add(s,{head:303,shoulder:350,duration:1600,ease:'outCubic'},1000);
 tl.call(()=>{status.textContent='٢ / الرأس يظهر ويتلفّت';},2200);
 tl.add(s,{look:-10,tilt:-13,duration:1000},2400);
 tl.add(s,{look:11,tilt:11,duration:1200},3500);
 tl.add(s,{right:1,duration:600},4300);
 tl.call(()=>{status.textContent='٣ / اليدان يحملان الجسم';},4900);
 tl.add(s,{head:236,shoulder:283,look:4,tilt:2,shift:-3,elbow:18,duration:1800,ease:'inOutCubic'},4900);
 tl.add(s,{head:241,shoulder:288,tilt:6,elbow:15,duration:650,ease:'outSine'},6700);
 tl.add(s,{head:238,shoulder:285,duration:650},7350);
 tl.play();
});
stop.addEventListener('click',reset);document.addEventListener('keydown',e=>{if(e.key==='Escape')reset();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&tl)reset();});
reduced.addEventListener('change',()=>{if(tl)reset();});idle();
})();
</script></body></html>'''
cards=[]
for name,no,title,desc in [('peek','01','مين برّه؟','الرأس يقود النظرة. الكتفان تحت الحافة واليدان شايلتان الوزن.'),('climb','02','خطوة مش مضمونة.','ركبة فوق الإطار، رجل معلّقة، وميل الجسم يعكس فقدان التوازن.'),('bye','03','مش آخر مرة.','يد ماسكة الحافة، ويد بتلوّح. التمثيل بوضع الجسم، مش بملامح الوجه.')]:
    cards.append(f'<article class="shot">{still(name)}<div class="shot__copy"><span class="small">{no} / KEY POSE</span><h2>{title}</h2><p>{desc}</p></div></article>')
(ROOT/'motion-study.html').write_text(page.replace('__SHOTS__',''.join(cards)))
print('Built motion-study.html')
