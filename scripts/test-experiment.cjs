// Run with NODE_PATH pointing at installed jsdom, html-validate and postcss.
const {JSDOM}=require('jsdom');
const fs=require('fs'),assert=require('node:assert/strict');
const {HtmlValidate}=require('html-validate');
const postcss=require('postcss');
(async()=>{
 const html=fs.readFileSync('index.html','utf8');
 const validation=await new HtmlValidate({'extends':['html-validate:recommended'],rules:{'no-inline-style':'off','long-title':'off','prefer-native-element':'off'}}).validateString(html);
 if(!validation.valid) console.log(validation.results.flatMap(r=>r.messages).map(m=>m.ruleId+': '+m.message).join('\n'));
 postcss.parse(fs.readFileSync('src/styles.css','utf8'));
 const dom=new JSDOM(html,{runScripts:'outside-only'}),w=dom.window;
 w.matchMedia=()=>({matches:false});
 let now=0,queue=[],id=0;
 w.setTimeout=(fn,delay=0)=>{queue.push({fn,time:now+delay,id:++id});return id};
 w.clearTimeout=n=>{queue=queue.filter(t=>t.id!==n)};
 function advance(ms){const end=now+ms;while(true){queue.sort((a,b)=>a.time-b.time);if(!queue.length||queue[0].time>end)break;const t=queue.shift();now=t.time;t.fn()}now=end}
 const js=fs.readFileSync('src/app.js','utf8').split('/* MW Lab:')[1];
 w.eval('/* MW Lab:'+js);
 const d=w.document,start=d.getElementById('experimentStart'),overlay=d.getElementById('lightStory');
 assert(overlay.hidden); assert.equal(queue.length,0,'nothing auto-starts');
 start.click();advance(4000);assert(!overlay.hidden);assert(start.disabled);
 advance(8000);assert.equal(overlay.dataset.scene,'speak');assert(d.getElementById('storyCaption').textContent.includes('اسعاري'));
 advance(12000);assert.equal(overlay.dataset.scene,'capture');
 advance(5000);assert.equal(overlay.dataset.scene,'farewell');
 advance(15000);assert(overlay.hidden);assert(!start.disabled);assert(!d.body.classList.contains('story-playing'));assert(!d.querySelector('main').inert);
 start.click();advance(4000);d.getElementById('storySkip').click();assert(overlay.hidden);advance(50000);assert(overlay.hidden);
 start.click();w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert(!start.disabled);
 w.matchMedia=()=>({matches:true});start.click();assert(overlay.hidden);assert(!start.disabled);assert.equal(queue.length,0);
 assert.deepEqual(Array.from(d.querySelectorAll('.plan__amount')).map(n=>n.textContent),['700','1000','1300']);
 console.log('PASS: CSS parses; idle, typing, slow scenes, dialogue, reset, replay, skip, Escape, reduced motion and price order. HTML valid:',validation.valid);
 if(!validation.valid)process.exitCode=1;
})();
