const assert = require('node:assert/strict');
const {chromium, webkit} = require('playwright');
const base = process.env.URL || 'http://127.0.0.1:5183/';

async function check(engine, viewport, name) {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({viewport, reducedMotion: 'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}benchmark/`, {waitUntil: 'networkidle'});
    const baseline = await (await page.request.get(`${base}benchmark/results.json`)).json();
    const repairs = await (await page.request.get(`${base}benchmark/recovery.json`)).json();
    const protocol = await (await page.request.get(`${base}benchmark/protocol.json`)).json();
    const timings = await (await page.request.get(`${base}benchmark/timings.json`)).json();
    assert.equal(repairs.entries.length, baseline.entries.filter(entry => entry.status === 'failed').length);
    const rendered = repairs.entries.filter(entry => entry.status === 'rendered').length;
    assert.match(await page.locator('.benchmark-recovery-summary').innerText(), new RegExp(`${rendered} of ${repairs.entries.length}`));
    for (const brief of protocol.briefs) {
      await page.getByRole('button', {name: brief.name, exact: true}).click();
      for (const run of [1, 2]) {
        await page.getByRole('button', {name: `Run ${run}`, exact: true}).click();
        const originals = baseline.entries.filter(entry => entry.brief === brief.id && entry.run === run);
        const recoveries = repairs.entries.filter(entry => entry.brief === brief.id && entry.run === run);
        await page.getByRole('button', {name: 'With repairs', exact: true}).click();
        assert.equal(await page.locator('.benchmark-card-media video').count(),
          originals.filter(entry => entry.status === 'rendered').length + recoveries.filter(entry => entry.status === 'rendered').length);
        assert.equal(await page.locator('.benchmark-recovery-label').count(), recoveries.length);
        for (const original of originals) {
          const entry = recoveries.find(entry => entry.model === original.model) ?? original;
          const model = protocol.models.find(model => model.key === entry.model);
          const card = page.locator('.benchmark-card').filter({has: page.getByRole('heading', {name: model.name, exact: true})});
          const timing = timings.entries.find(timing => timing.video === entry.video);
          const expected = entry.status === 'failed' ? 'Not generated' : timing?.generationTimeMs == null ? 'Unavailable' : `${(timing.generationTimeMs / 1000).toFixed(1)}s`;
          assert.equal(await card.locator('.benchmark-metrics dd').nth(2).textContent(), expected, `${model.name}: timing belongs to displayed video`);
        }
        for (const recovery of recoveries) {
          const model = protocol.models.find(model => model.key === recovery.model);
          const card = page.locator('.benchmark-card').filter({has: page.getByRole('heading', {name: model.name, exact: true})});
          await card.locator('summary').click();
          assert.match(await card.innerText(), /Original outcome/);
          assert.match(await card.innerText(), /Additional repair cost/);
          const original = originals.find(entry => entry.model === recovery.model);
          assert.equal(await card.locator('.benchmark-metrics dd').nth(1).textContent(), `$${(original.costUsd + recovery.costUsd).toFixed(original.costUsd + recovery.costUsd < 0.01 ? 4 : 3)}`);
          if (recovery.video) assert.equal(await card.locator('video').getAttribute('data-video-src'), `/${recovery.video}`);
          await card.locator('summary').click();
        }
        await page.getByRole('button', {name: 'Original runs', exact: true}).click();
        assert.equal(await page.locator('.benchmark-card-media video').count(), originals.filter(entry => entry.status === 'rendered').length);
        assert.equal(await page.locator('.benchmark-recovery-label').count(), 0);
      }
    }
    await page.reload({waitUntil: 'networkidle'});
    assert.equal(await page.getByRole('button', {name: 'Original runs', exact: true}).getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', {name: 'With repairs', exact: true}).click();
    await page.getByRole('button', {name: 'Product launch', exact: true}).click();
    await page.getByRole('button', {name: 'Run 1', exact: true}).click();
    const recoveredCard = page.locator('.benchmark-card').filter({has: page.locator('.benchmark-recovery-label')}).first();
    await recoveredCard.scrollIntoViewIfNeeded();
    const play = recoveredCard.getByRole('button', {name: /^Play /});
    if (await play.count()) {
      await play.click();
      await page.waitForFunction(() => [...document.querySelectorAll('video')].some(video => video.currentTime > 0.3 && video.dataset.videoSrc.includes('recovery-r1')));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({path: `/tmp/cliphouse-recovery-${name}.png`});
    assert.deepEqual(errors, []);
    console.log(`${name}: all recovery/original selections, costs, source paths, URL state, and playback passed.`);
  } finally { await browser.close(); }
}
(async () => {
  await check(chromium, {width: 1440, height: 1000}, 'desktop');
  await check(webkit, {width: 390, height: 844}, 'mobile');
})().catch(error => {console.error(error); process.exitCode = 1;});
