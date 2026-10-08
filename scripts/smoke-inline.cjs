const assert = require('node:assert/strict');
const {chromium, webkit, devices} = require('playwright');
const manifest = require('../src/catalog/manifest.json');
const base = process.env.URL || 'http://localhost:5180/voodoo/';

async function clickText(page, label, optional = false) {
  const point = await page.locator('.text-hit').evaluateAll((els, label) => {
    for (const el of els.filter((el) => el.ariaLabel === label)) {
      const r = el.getBoundingClientRect();
      for (const x of [0.5, 0.25, 0.75]) for (const y of [0.5, 0.25, 0.75]) {
        const px = r.left + r.width * x, py = r.top + r.height * y;
        if (document.elementFromPoint(px, py)?.getAttribute('aria-label') === label) return {x: px, y: py};
      }
    }
  }, label);
  if (!point && optional) return false;
  assert(point, `No clickable text for ${label}`);
  await page.mouse.click(point.x, point.y);
  return true;
}

(async () => {
  const ios = process.argv.includes('--ios');
  const browser = await (ios ? webkit : chromium).launch();
  const ctx = await browser.newContext(ios ? {...devices['iPhone 15 Pro']} : {viewport: {width: 1440, height: 1000}});
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    const {templateMeta} = await import('../src/videos/meta.ts');
    const {ROLES} = await import('../src/videos/vocab.ts');
    for (const template of manifest.templates) {
      if (process.env.TEMPLATE && template.id !== process.env.TEMPLATE) continue;
      const v = manifest.variants.find((v) => v.template === template.id && !v.hidden);
      const meta = templateMeta[template.id];
      await page.goto(base + '#/v/' + v.id);
      await page.getByRole('heading', {name: v.title, exact: true}).waitFor();
      await page.getByRole('button', {name: 'Pause', exact: true}).click();
      assert.equal(await page.locator('.desc, .prompt, .related, .panel, .field').count(), 0);
      const seen = new Set();
      for (let i = 0; i < meta.scenes.filter((s) => s.type !== 'transition').length; i++) {
        await page.locator('.scene').nth(i).click();
        await page.waitForTimeout(250);
        const labels = await page.locator('.text-hit').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('aria-label')))]);
        for (const label of labels) {
          if (seen.has(label) || !await clickText(page, label, true)) continue;
          const role = Object.keys(v.props.texts).find((role) => `Edit ${ROLES[role].label}` === label);
          assert(role, `Unknown role ${label}`);
          const field = page.getByRole('textbox', {name: ROLES[role].label, exact: true});
          assert.equal(await field.inputValue(), v.props.texts[role]);
          await field.fill(`Edit ${role}`);
          await page.getByRole('button', {name: 'Save text', exact: true}).click();
          assert.equal(await page.evaluate(({id, role}) => JSON.parse(localStorage.getItem(`voodoo:v2:${id}`)).texts[role], {id: v.id, role}), `Edit ${role}`);
          await page.getByRole('button', {name: 'Undo', exact: true}).click();
          await page.waitForTimeout(60);
          seen.add(label);
        }
      }
      for (const role of Object.keys(v.props.texts)) assert(seen.has(`Edit ${ROLES[role].label}`), `${v.id}: missing inline target ${role}`);
      const sceneIndex = meta.scenes.filter((s) => s.type !== 'transition').findIndex((s) => s.roles.includes('headline'));
      await page.locator('.scene').nth(sceneIndex).click();
      await page.waitForTimeout(200);
      await clickText(page, 'Edit Headline');
      const input = page.getByRole('textbox', {name: 'Headline', exact: true});
      assert.equal(await input.inputValue(), v.props.texts.headline);
      assert(await input.evaluate((el) => document.activeElement === el));
      await input.fill('Made for motion');
      await page.screenshot({path: `/tmp/voodoo-inline-${template.id}-${ios ? 'ios' : 'desktop'}.png`, scale: 'css'});
      await page.getByRole('button', {name: 'Save text', exact: true}).click();
      assert.equal(await page.evaluate((id) => JSON.parse(localStorage.getItem(`voodoo:v2:${id}`)).texts.headline, v.id), 'Made for motion');
      await page.getByRole('button', {name: 'Undo', exact: true}).click();
      assert.equal(await page.evaluate((id) => JSON.parse(localStorage.getItem(`voodoo:v2:${id}`)).texts.headline, v.id), v.props.texts.headline);
      await page.getByRole('button', {name: 'Redo', exact: true}).click();
      await page.reload();
      await page.getByRole('button', {name: 'Pause', exact: true}).click();
      assert.equal(await page.evaluate((id) => JSON.parse(localStorage.getItem(`voodoo:v2:${id}`)).texts.headline, v.id), 'Made for motion');
      const width = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
      assert(width, `${v.id}: horizontal overflow`);
      if (!ios) {
        assert.equal(await page.getByRole('button', {name: 'Fullscreen', exact: true}).isVisible(), false);
        const box = await page.locator('.immersive-editor').boundingBox();
        assert(box.width <= 1200 && box.height < 900, 'desktop remains contained');
      }
      console.log(`${ios ? 'ios' : 'desktop'}: ${v.id}, ${Object.keys(v.props.texts).length} roles, edit/undo/redo/persist passed`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
