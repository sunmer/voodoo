const assert = require('node:assert/strict');
const {chromium, webkit, devices} = require('playwright');
const manifest = require('../src/catalog/manifest.json');

const base = process.env.URL || 'http://localhost:5180/voodoo/';

async function check(engine, options, name) {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage(options);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('crash', () => errors.push('PAGE CRASHED'));
    page.on('response', (response) => {
      if (response.status() >= 400 && response.url().includes('/previews/')) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    await page.goto(base);
    await page.locator('.card .media').first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.card video')].some((video) => !video.paused && video.currentTime > 0.1));
    const initial = await page.locator('.card video').count();
    assert(initial > 0 && initial < manifest.variants.filter((v) => !v.hidden).length, `${name}: only visible videos mounted`);
    assert(await page.locator('.card video').evaluateAll((videos) => videos.every((v) => v.muted && v.playsInline)), `${name}: inline muted autoplay`);
    await page.screenshot({path: `/tmp/voodoo-autoplay-${name}.png`, scale: 'css'});
    await page.locator('.card').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    assert.equal(await page.locator('.card').first().locator('video').count(), 0, `${name}: offscreen video released`);
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.waitForFunction(() => document.querySelectorAll('.card video').length === 0);
    assert(await page.locator('.card img').last().evaluate((img) => img.complete && img.naturalWidth > 0), `${name}: poster fallback`);
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await page.waitForFunction(() => [...document.querySelectorAll('.card video')].some((v) => !v.paused && v.currentTime > 0.1));
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {configurable: true, value: true});
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => document.querySelectorAll('.card video').length === 0);
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => [...document.querySelectorAll('.card video')].some((v) => !v.paused && v.currentTime > 0.1));

    const blocked = await browser.newPage(options);
    await blocked.addInitScript(() => {
      const setAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        if (this instanceof HTMLMediaElement && name.toLowerCase() === 'autoplay') return;
        return setAttribute.call(this, name, value);
      };
      Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', {configurable: true, get: () => false, set: () => {}});
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
    });
    await blocked.goto(base);
    await blocked.locator('.card .media').first().scrollIntoViewIfNeeded();
    await blocked.waitForFunction(() => document.querySelector('.card video'));
    assert.equal(await blocked.locator('.card video').first().evaluate((v) => getComputedStyle(v).opacity), '0', `${name}: blocked autoplay preserves poster`);
    assert(await blocked.locator('.card img').first().evaluate((img) => img.complete && img.naturalWidth > 0), `${name}: blocked autoplay poster loaded`);
    await blocked.close();

    const ids = ['drop-sale', ...manifest.variants.filter((v) => !v.hidden && ['bento', 'glass', 'flex', 'riso', 'collage', 'cursor', 'spotlight', 'slice', 'swiss', 'prism'].includes(v.template)).map((v) => v.id)];
    for (const id of ids) {
      await page.goto(`${base}#/v/${id}`);
      await page.locator('.editor-top h1').waitFor();
      // A complete loop exercises all scenes, including the originally failing editor.
      await page.waitForTimeout(id === 'drop-sale' ? 16500 : 8500);
      assert.equal(await page.locator('[aria-invalid="true"]').count(), 0, `${id}: valid preset`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${id}: no horizontal page overflow`);
      await page.locator('.scene').first().click();
      await page.locator('.editor-video').scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await page.screenshot({path: `/tmp/voodoo-${id}-${name}.png`, scale: 'css'});
      if (id.startsWith('flex-')) {
        for (const value of ['WWWWWWWWWWWWWWWWWWWWWWWW', 'Form follows motion']) {
          await page.getByRole('button', {name: 'Edit Headline', exact: true}).first().click();
          await page.getByRole('textbox', {name: 'Headline', exact: true}).fill(value);
          await page.getByRole('button', {name: 'Save text', exact: true}).click();
          await page.waitForTimeout(100);
          const fits = await page.locator('[data-fitted-type]').evaluateAll((els) => els.every((el) => {
            const outer = el.getBoundingClientRect();
            const inner = el.firstElementChild.getBoundingClientRect();
            return inner.right <= outer.right + 1 && inner.left >= outer.left - 1;
          }));
          assert(fits, `${id}: measured text fits (${value})`);
        }
      }
      console.log(`${name}: editor ${id} passed`);
    }
    assert.deepEqual(errors, [], `${name}: browser/media errors`);
    console.log(JSON.stringify({name, autoplayVideos: initial, editors: ids.length, errors}));
  } finally {
    await browser.close();
  }
}

(async () => {
  const ios = process.argv.includes('--ios');
  await check(ios ? webkit : chromium, ios ? {...devices['iPhone 15 Pro']} : {viewport: {width: 1440, height: 900}}, ios ? 'ios' : 'desktop');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
