// npm install --prefix /tmp/mw-tests playwright-core @sparticuz/chromium html-validate@9 postcss@8
// Start preview on :8080; NODE_PATH=/tmp/mw-tests/node_modules node scripts/test-experiment.cjs
const {chromium:pw}=require('playwright-core');
const chromium=require('@sparticuz/chromium').default;
const fs=require('fs'),assert=require('node:assert/strict');
const {HtmlValidate}=require('html-validate');
const postcss=require('postcss');
(async()=>{
 const validation=await new HtmlValidate({extends:['html-validate:recommended'],rules:{'no-inline-style':'off','long-title':'off','prefer-native-element':'off'}}).validateString(fs.readFileSync('index.html','utf8'));
 assert(!fs.readFileSync('index.html','utf8').includes('window.gsap'), 'old engine removed');
 assert(validation.valid,JSON.stringify(validation.results.flatMap(r=>r.messages)));
 postcss.parse(fs.readFileSync('src/styles.css','utf8'));
 let browser;
 const evidence=[];
 try {
 for(const size of [{width:320,height:740},{width:390,height:844},{width:768,height:1024},{width:1440,height:900},{width:844,height:390}]){
  browser=await pw.launch({executablePath:await chromium.executablePath(),args:chromium.args,headless:true});
  const page=await browser.newPage({viewport:size,deviceScaleFactor:1});const errors=[];console.log('viewport',size);page.setDefaultTimeout(30000);
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await page.waitForTimeout(2400);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'horizontal overflow '+size.width);
  assert(await page.locator('#lightStory').isHidden());
  await page.locator('#experimentStart').scrollIntoViewIfNeeded();
  await page.screenshot({path:`/tmp/mw-${size.width}-idle.png`});
  await page.evaluate(()=>{ const create=anime.createTimeline; anime.createTimeline=(...args)=>{const tl=create(...args);window.testTimeline=tl;return tl;}; });
  await page.locator('#experimentStart').click();
  await page.waitForTimeout(2700);
  assert(await page.locator('#lightStory').isVisible());
  await page.evaluate(()=>{window.testTimeline.pause();window.testTimeline.seek(14000);});
  await page.waitForTimeout(150);
  assert((await page.locator('#storyCaption').innerText()).includes('اسعاري'));
  await page.screenshot({path:`/tmp/mw-${size.width}-story.png`});
  console.log('seek capture'); await page.evaluate(()=>{window.testTimeline.seek(28000);}); console.log('capture ready');
  await page.screenshot({path:`/tmp/mw-${size.width}-capture.png`,timeout:30000});console.log('captured');
  await page.evaluate(()=>{window.testTimeline.seek(36500);});
  assert((await page.locator('#storyCaption').innerText()).includes('هنتقابل'));
  await page.evaluate(()=>{window.testTimeline.seek(47300);});
  assert(await page.locator('#lightStory').isHidden());
  assert.equal(await page.locator('#experimentStart').isDisabled(),false);
  assert.equal(await page.evaluate(()=>document.querySelector('main').inert),false);
  await page.locator('#experimentStart').click();await page.waitForTimeout(2400);
  await page.keyboard.press('Escape');assert(await page.locator('#lightStory').isHidden());
  await page.locator('#experimentStart').click();await page.waitForTimeout(2400);
  await page.locator('#storySkip').click();assert(await page.locator('#lightStory').isHidden());
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#experimentStart').click();
  assert(await page.locator('#lightStory').isHidden());assert((await page.locator('#experimentStatus').innerText()).includes('هنتقابل'));
  assert.deepEqual(await page.locator('.plan__amount').allTextContents(),['700','1000','1300']);
  assert.deepEqual(errors,[]);
  evidence.push({...size,result:'PASS',checks:'no overflow, opt-in, anime.js playback/dialogue/reset, Escape, Skip, replay, reduced motion, price order, no JS errors'});
  await browser.close();
 }
 }finally{if(browser)await browser.close()}
 fs.writeFileSync('scripts/responsive-results.json',JSON.stringify(evidence,null,2)+'\n');
 console.log('HTML valid; CSS parses; browser acceptance:',evidence);
})().catch(e=>{console.error(e);process.exit(1)});
