const {chromium, webkit} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.URL || 'http://127.0.0.1:5182/';

async function check(browser, viewport, prefix) {
  const context = await browser.newContext({viewport, reducedMotion: 'reduce'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}benchmark/`, {waitUntil: 'networkidle'});
  const results = await (await context.request.get(`${base}benchmark/results.json`)).json();
  const protocol = await (await context.request.get(`${base}benchmark/protocol.json`)).json();
  await page.locator('.benchmark-card').first().waitFor();
  assert.equal(await page.locator('.benchmark-card').count(), 10);
  assert.equal(await page.locator('.filters').count(), 0);
  assert.equal(await page.getByRole('heading', {level: 1}).count(), 1);
  assert.match(await page.locator('.benchmark-progress').innerText(), results.entries.length ? /rendered videos/ : /Results pending/);
  assert.equal(await page.locator('.benchmark-card-media video').count(), results.entries.filter((entry) => entry.brief === 'product-launch' && entry.run === 1 && entry.status === 'rendered').length);
  const columns = await page.locator('.benchmark-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  assert.equal(columns, viewport.width > 1000 ? 3 : viewport.width > 600 ? 2 : 1);
  for (const {id: brief, name} of protocol.briefs) {
    await page.getByRole('button', {name, exact: true}).click();
    assert.equal(await page.locator('.benchmark-prompt summary').innerText(), `${name} - full brief`);
    assert.equal(await page.locator('.benchmark-prompt pre').textContent(), protocol.briefs.find(item => item.id === brief).prompt);
    assert.ok(await page.locator('#briefs').evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.benchmark-grid')) & Node.DOCUMENT_POSITION_FOLLOWING)));
    for (const run of [1, 2]) {
      await page.getByRole('button', {name: `Run ${run}`, exact: true}).click();
      const entries = results.entries.filter((entry) => entry.brief === brief && entry.run === run);
      const rendered = entries.filter((entry) => entry.status === 'rendered');
      assert.equal(await page.locator('.benchmark-card').count(), 10);
      assert.equal(await page.locator('.benchmark-card-media video').count(), rendered.length);
      assert.equal(await page.locator('.benchmark-pending.is-failed').count(), entries.length - rendered.length);
      assert.equal(await page.locator('.benchmark-pending:not(.is-failed)').count(), 10 - entries.length);
      const actualVideos = await page.locator('.benchmark-card-media video').evaluateAll((videos) =>
        videos.map((video) => new URL(video.dataset.videoSrc, location.href).pathname).sort());
      assert.deepEqual(actualVideos, rendered.map((entry) => new URL(entry.video, base).pathname).sort(), 'each selection shows its recorded videos');
    }
  }
  await page.getByRole('button', {name: 'Data story', exact: true}).click();
  await page.getByRole('button', {name: 'Run 2', exact: true}).click();
  const selected = results.entries.find((entry) => entry.model === 'opus-5-5' && entry.brief === 'data-story' && entry.run === 2);
  if (!selected) assert.equal(await page.locator('.benchmark-card-media').first().innerText(), 'Not run\nData story / Run 2');
  else if (selected.status === 'rendered') assert.equal(await page.locator('.benchmark-card-media').first().locator('video').count(), 1);
  else assert.match(await page.locator('.benchmark-card-media').first().innerText(), /Render failed|Token limit reached|Invalid response format/);
  assert.equal(new URL(page.url()).searchParams.get('brief'), 'data-story');
  assert.equal(new URL(page.url()).searchParams.get('run'), '2');
  assert.equal(await page.locator('.benchmark-prompt[open]').count(), 0);
  await page.getByText('Data story - full brief', {exact: true}).click();
  assert.equal(await page.locator('.benchmark-prompt[open]').count(), 1);
  assert.match(await page.locator('.benchmark-prompt[open]').innerText(), /Monday.*2/);
  await page.reload({waitUntil: 'networkidle'});
  assert.equal(await page.getByRole('button', {name: 'Data story', exact: true}).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.getByRole('button', {name: 'Run 2', exact: true}).getAttribute('aria-pressed'), 'true');
  await page.getByLabel('Sort models').selectOption('name');
  assert.equal(await page.locator('.benchmark-card h3').first().innerText(), 'Claude Haiku 5.5');
  await page.locator('.benchmark-entry-details summary').first().click();
  assert.match(await page.locator('.benchmark-entry-details[open]').first().innerText(), /anthropic\/claude-haiku-5.5/);
  assert.equal(await page.locator('.benchmark-entry-details[open] a').last().getAttribute('href'), 'https://openrouter.ai/anthropic/claude-haiku-5.5');
  await page.locator('.benchmark-entry-details summary').first().click();
  await page.getByLabel('Sort models').selectOption('listed');
  await page.getByRole('button', {name: 'Product launch', exact: true}).click();
  await page.getByRole('button', {name: 'Run 1', exact: true}).click();
  await page.evaluate(() => scrollTo(0, 0));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'page fits viewport');
  const badText = await page.locator('button, h1, h2, h3, .benchmark-card-labels').evaluateAll((els) =>
    els.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent));
  assert.deepEqual(badText, [], 'headings and controls do not overflow');
  await page.screenshot({path: `/tmp/cliphouse-benchmark-${prefix}-${viewport.width}.png`, fullPage: false});
  await page.locator('#comparison').scrollIntoViewIfNeeded();
  await page.screenshot({path: `/tmp/cliphouse-benchmark-grid-${prefix}-${viewport.width}.png`, fullPage: false});
  const submission = page.locator('.benchmark-card-media video').first();
  if (await submission.count()) {
    await submission.scrollIntoViewIfNeeded();
    await page.getByRole('button', {name: new RegExp(`^Play ${await submission.getAttribute('aria-label')}$`)}).click();
    await page.waitForFunction(() => [...document.querySelectorAll('.benchmark-card-media video')].some((el) => el.currentTime > 0.2));
    assert.ok(await submission.evaluate((el) => el.videoWidth > 0 && el.videoHeight > 0), 'real benchmark video decodes');
    await submission.evaluate((el) => el.pause());
  }
  await page.locator('#methodology').scrollIntoViewIfNeeded();
  const video = page.locator('.benchmark-reference video');
  await page.getByRole('button', {name: 'Play Existing Cliphouse motion graphics example', exact: true}).click();
  await page.waitForFunction(() => document.querySelector('.benchmark-reference video').currentTime > 0.2);
  const frame = await video.evaluate((el) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 36;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(el, 0, 0, 64, 36);
    const pixels = ctx.getImageData(0, 0, 64, 36).data;
    return {width: el.videoWidth, height: el.videoHeight, colors: new Set(Array.from({length: pixels.length / 4}, (_, i) => `${pixels[i * 4]},${pixels[i * 4 + 1]},${pixels[i * 4 + 2]}`)).size};
  });
  assert.ok(frame.width > 0 && frame.height > 0 && frame.colors > 10, 'example video decodes a nonblank frame');
  await video.evaluate((el) => el.pause());
  const response = await context.request.get(`${base}benchmark/protocol.json`);
  assert.equal(response.status(), 200);
  assert.equal((await response.json()).models.length, 10);
  assert.match(await (await context.request.get(`${base}benchmark/contract.txt`)).text(), /BenchmarkVideo/);
  await page.goto(`${base}benchmark/2026-10/`, {waitUntil: 'networkidle'});
  assert.match(await page.title(), /October 2026/);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://cliphou.se/benchmark/2026-10/');
  assert.equal(await page.locator('.benchmark-card').count(), 10);
  await page.getByRole('link', {name: 'Templates', exact: true}).click();
  await page.locator('.card').first().waitFor();
  await page.getByRole('link', {name: 'Motion Graphics Benchmark', exact: true}).click();
  await page.locator('.benchmark-card').first().waitFor();
  assert.deepEqual(errors, [], 'no runtime or hydration errors');
  await context.close();
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [{width: 1440, height: 1000}, {width: 768, height: 1024}, {width: 390, height: 844}, {width: 320, height: 740}]) await check(browser, viewport, 'chromium');
    const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 1280, height: 900}});
    const page = await context.newPage();
    await page.goto(`${base}benchmark/`);
    assert.equal(await page.locator('.benchmark-card').count(), 10, 'all models are server rendered');
    assert.equal(await page.locator('script[type="application/ld+json"]').count(), 1);
    await page.locator('.benchmark-prompt summary').click();
    assert.equal(await page.locator('.benchmark-prompt').getAttribute('open'), '');
    await context.close();
  } finally { await browser.close(); }
  const safari = await webkit.launch();
  try { await check(safari, {width: 390, height: 844}, 'webkit'); } finally { await safari.close(); }
  console.log('Benchmark layouts (3/2/1 columns), all six brief/run selections, recorded video paths and failures, URLs, downloads, SSR, video pixels, navigation, and WebKit passed.');
})().catch((error) => {console.error(error); process.exitCode = 1;});
