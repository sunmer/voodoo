// Browser smoke test: gallery facets, brand kit, editor scene focus. Captures screenshots.
const {chromium} = require('playwright');
const manifest = require('../src/catalog/manifest.json');

const assert = (cond, msg) => {
  if (!cond) throw new Error('ASSERT: ' + msg);
};

(async () => {
  const base = process.env.URL || 'http://localhost:5180/voodoo/';
  const browser = await chromium.launch();
  const errs = [];
  const report = {};
  for (const vp of [{width: 1440, height: 900, n: 'desktop'}, {width: 390, height: 844, n: 'mobile'}]) {
    const page = await browser.newPage({viewport: {width: vp.width, height: vp.height}});
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await page.goto(base);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1200);
    const total = await page.locator('.card').count();

    // Facet: 9:16 format only.
    const toggle = page.locator('.filters-toggle');
    if (await toggle.isVisible()) await toggle.click();
    await page.locator('.chip', {hasText: '9:16'}).click();
    const vertical = await page.locator('.card').count();
    await page.screenshot({path: `/tmp/voodoo-gallery-${vp.n}.png`, scale: 'css'});
    await page.locator('.chip', {hasText: '9:16'}).click();
    if (await toggle.isVisible()) await toggle.click();

    // Brand kit: fill once, every card previews it.
    await page.locator('.kit-btn').click();
    await page.locator('.kit-grid input').nth(0).fill('ACME');
    await page.locator('.kit-grid input').nth(1).fill('Meet the new Acme');
    await page.locator('.kit-palettes .palette-btn').nth(7).click();
    await page.locator('.kit-btn').click();
    await page.waitForTimeout(1500);
    const kitThumbs = await page.locator('.card .media .__remotion-player, .card .media div[style*="aspect-ratio"] > div').count();
    await page.screenshot({path: `/tmp/voodoo-kit-${vp.n}.png`, scale: 'css'});

    // Editor: text is edited on the canvas; the brand kit still applies.
    await page.goto(base + '#/v/stack-kicklab');
    await page.waitForTimeout(1000);
    await page.locator('.scene').nth(1).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', {name: 'Edit Point 1', exact: true}).first().click();
    const linked = await page.locator('.scene.linked').innerText();
    await page.getByRole('button', {name: 'Cancel edit', exact: true}).click();
    const applyVisible = await page.getByRole('button', {name: 'Apply brand kit', exact: true}).isVisible();
    await page.getByRole('button', {name: 'Apply brand kit', exact: true}).click();
    await page.waitForTimeout(800);
    const brandValue = await page.evaluate(() => JSON.parse(localStorage.getItem('voodoo:v2:stack-kicklab')).texts.brand);
    await page.screenshot({path: `/tmp/voodoo-editor-${vp.n}.png`, scale: 'css'});
    await page.close();
    report[vp.n] = {total, vertical, kitThumbs, linked, applyVisible, brandValue};
    assert(total === manifest.variants.filter((v) => !v.hidden).length && vertical === 4, 'facet counts');
    assert(linked === 'List', 'focus links point to list scene');
    assert(brandValue === 'ACME', 'brand kit applied in editor');
  }
  console.log(JSON.stringify({report, errs}));
  await browser.close();
  if (errs.length) process.exit(1);
})();
