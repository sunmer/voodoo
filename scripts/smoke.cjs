// Browser smoke test: loads gallery + editor, edits a field, captures screenshots.
const {chromium} = require('playwright');

(async () => {
  const base = process.env.URL || 'http://localhost:5180/';
  const browser = await chromium.launch();
  const errs = [];
  for (const vp of [{width: 1440, height: 900, n: 'desktop'}, {width: 390, height: 844, n: 'mobile'}]) {
    const page = await browser.newPage({viewport: {width: vp.width, height: vp.height}});
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await page.goto(base);
    await page.waitForTimeout(2500);
    await page.screenshot({path: `/tmp/voodoo-gallery-${vp.n}.png`});
    await page.goto(base + '#/v/showreel-nocturne');
    await page.waitForTimeout(800);
    const input = page.locator('.field input').nth(1);
    await input.fill('Hello Voodoo');
    await page.locator('.palette-btn').nth(3).click();
    await page.waitForTimeout(1500);
    await page.screenshot({path: `/tmp/voodoo-editor-${vp.n}.png`, fullPage: vp.n === 'mobile'});
    await page.close();
  }
  console.log(JSON.stringify(errs));
  await browser.close();
})();
