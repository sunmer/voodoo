const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.URL || 'http://127.0.0.1:5181/voodoo/';

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: {width: 390, height: 844}});
    let scripts = 0;
    await page.route('https://www.googletagmanager.com/**', (route) => {
      scripts++;
      return route.fulfill({contentType: 'application/javascript', body: '// Stub for Analytics integration tests.'});
    });
    await page.goto(base);
    await page.waitForFunction(() => window.dataLayer?.some((event) => event[1] === 'page_view'));
    assert.equal(scripts, 1, 'tag loads automatically once');
    assert.equal(await page.locator('.consent-banner').count(), 0, 'no consent screen');
    const events = () => page.evaluate(() => window.dataLayer.filter((event) => event[0] === 'event').map((event) => Array.from(event)));
    assert.equal((await events()).filter((event) => event[1] === 'page_view').length, 1);
    await page.locator('.card-link').first().click();
    await page.locator('.immersive-editor').waitFor();
    assert.equal((await events()).filter((event) => event[1] === 'page_view').length, 2, 'editor route measured once');
    await page.locator('.site-footer a', {hasText: 'Privacy'}).click();
    await page.getByRole('heading', {name: 'Privacy', exact: true}).waitFor();
    assert.equal((await events()).filter((event) => event[1] === 'page_view').length, 3);
    assert.equal(scripts, 1, 'route changes do not reload tag');
    const config = await page.evaluate(() => Array.from(window.dataLayer.find((event) => event[0] === 'config')));
    assert.equal(config[2].allow_google_signals, false);
    assert.equal(config[2].allow_ad_personalization_signals, false);
    console.log('Automatic Analytics, single page views, hash routes, no banner, and advertising-disabled configuration passed.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
