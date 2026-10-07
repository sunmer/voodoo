// WebKit + iPhone emulation: scroll the gallery, open the editor, check for errors.
const {webkit, devices} = require('playwright');

(async () => {
  const base = process.env.URL || 'http://localhost:5180/voodoo/';
  const browser = await webkit.launch();
  const ctx = await browser.newContext({...devices['iPhone 15 Pro']});
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('crash', () => errs.push('PAGE CRASHED'));
  await page.goto(base);
  await page.waitForTimeout(1500);
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(150);
  }
  const imgs = await page.locator('.thumb img').evaluateAll((els) => els.filter((e) => e.complete && e.naturalWidth > 0).length);
  const players = await page.locator('.thumb .__remotion-player').count();
  await page.screenshot({path: '/tmp/voodoo-ios-gallery.png'});
  await page.goto(base + '#/v/neon-summit');
  await page.waitForTimeout(2500);
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(150);
  }
  await page.screenshot({path: '/tmp/voodoo-ios-editor.png'});
  console.log(JSON.stringify({imgsLoaded: imgs, livePlayersInGrid: players, errs}));
  await browser.close();
})();
