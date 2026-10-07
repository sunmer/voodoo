const assert = require('node:assert/strict');
const {chromium, webkit} = require('playwright');
const base = process.env.URL || 'http://127.0.0.1:5185/';

(async () => {
  for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch();
    try {
      for (const width of [1440, 390, 320]) {
        const page = await browser.newPage({viewport: {width, height: 900}});
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base);
        const card = page.locator('.card').first();
        await card.waitFor();
        assert.equal(await page.locator('.card .tags,.card .tag').count(), 0);
        assert.equal(await page.locator('a a').count(), 0);
        const media = await card.locator('.card-media').boundingBox();
        const button = await card.locator('.card-edit').boundingBox();
        assert.equal(button.height, 28);
        assert.ok(Math.abs(button.x - media.x - 8) < 1);
        assert.ok(Math.abs(media.y + media.height - button.y - button.height - 8) < 1);
        const badge = await card.locator('.badge').boundingBox();
        assert.ok(button.x + button.width < badge.x);
        for (const term of ['YouTube', 'Neon', 'Bold']) {
          await page.getByPlaceholder('Search videos, styles, keywords').fill(term);
          assert.ok(await page.locator('.card').count() > 0, `${term} stays searchable`);
        }
        await page.getByPlaceholder('Search videos, styles, keywords').fill('');
        await page.screenshot({path: `/tmp/cliphouse-gallery-controls-${name}-${width}.png`, scale: 'css'});
        await card.locator('.card-edit').click();
        await page.getByRole('heading', {name: 'Video details', exact: true}).waitFor();
        assert.ok(await page.locator('.video-details .tag').count() > 0);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.deepEqual(errors, []);
        await page.close();
      }
    } finally { await browser.close(); }
  }
  console.log('Compact bottom-left Edit overlay, no gallery tags, searchable metadata and video details passed on Chromium/WebKit at 1440/390/320px.');
})().catch((e) => {console.error(e); process.exitCode = 1;});
