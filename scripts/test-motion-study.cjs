// Requires playwright-core, @sparticuz/chromium and html-validate. Serve repository on :8080.
const {chromium}=require('playwright-core'), bin=require('@sparticuz/chromium').default;
const {HtmlValidate}=require('html-validate'),fs=require('fs'),assert=require('assert/strict');
(async()=>{
const valid=await new HtmlValidate({extends:['html-validate:recommended'],rules:{'no-inline-style':'off','prefer-native-element':'off','svg-focusable':'off'}}).validateString(fs.readFileSync('motion-study.html','utf8'));
if(!valid.valid)console.log(valid.results.flatMap(r=>r.messages));
assert(valid.valid);
for (const width of [390,1440]){
const browser=await chromium.launch({executablePath:await bin.executablePath(),args:bin.args,headless:true});
const page=await browser.newPage({viewport:{width,height:950}});let errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8080/motion-study.html');
assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.screenshot({path:`/tmp/mw-study-${width}.png`,fullPage:true});
await page.locator('#playStudy').click();await page.waitForTimeout(8200);
assert(!(await page.locator('#playStudy').isDisabled()));
assert((await page.locator('#motionStatus').innerText()).includes('انتهى'));
await page.locator('#motionStage').screenshot({path:`/tmp/mw-study-finish-${width}.png`});
await page.locator('#playStudy').click();await page.keyboard.press('Escape');assert(!(await page.locator('#playStudy').isDisabled()));
await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#playStudy').click();assert((await page.locator('#motionStatus').innerText()).includes('ثابتة'));
assert.deepEqual(errors,[]);await browser.close();console.log('PASS',width,'layout, 8s playback, replay, Escape, reduced motion');
}
})();
