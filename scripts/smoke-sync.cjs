const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.URL || 'http://127.0.0.1:5182/voodoo/';
const alice = `alice-${Date.now()}@example.test`;
const bob = `bob-${Date.now()}@example.test`;

async function login(page, email) {
  const event = page.waitForEvent('popup');
  await page.getByRole('button', {name: 'Sign in with Google', exact: true}).click();
  const popup = await event;
  await popup.getByText('Sign-in with Google.com', {exact: true}).waitFor();
  const existing = popup.getByText(email, {exact: true});
  if (await existing.count()) {
    await existing.click();
  } else {
    await popup.getByText('Add new account', {exact: true}).click();
    await popup.locator('#email-input').fill(email);
    await popup.locator('#display-name-input').fill('Test account');
    await popup.getByRole('button', {name: 'Sign in with Google.com', exact: true}).click();
  }
  await page.getByRole('dialog').waitFor({state: 'hidden'});
  await page.getByRole('button', {name: 'Your account', exact: true}).waitFor();
}
async function logout(page) {
  await page.getByRole('button', {name: 'Your account', exact: true}).click();
  await page.getByRole('button', {name: 'Sign out', exact: true}).click();
  await page.getByRole('dialog').waitFor({state: 'hidden'});
}

(async () => {
  const browser = await chromium.launch();
  let page;
  try {
    const context = await browser.newContext({viewport: {width: 390, height: 844}});
    page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base);
    const star = page.locator('.card-star').first();
    await star.click();
    await login(page, alice);
    await page.waitForFunction(() => document.querySelector('.card-star')?.getAttribute('aria-pressed') === 'true' && document.querySelector('.card-star')?.getAttribute('aria-busy') === 'false');
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.card-star')?.getAttribute('aria-pressed') === 'true');
    await page.getByRole('button', {name: /^Saved/}).click();
    await page.waitForFunction(() => document.querySelectorAll('.card').length === 1);
    await logout(page);
    assert.equal(await page.locator('.card').count(), 0, 'signout clears private results');
    await page.locator('.empty').getByRole('button', {name: 'Sign in', exact: true}).click();
    await login(page, bob);
    await page.locator('.empty', {hasText: 'No starred videos yet.'}).waitFor();
    assert.equal(await page.locator('.card').count(), 0, 'another account cannot see Alice stars');
    await logout(page);
    await page.locator('.empty').getByRole('button', {name: 'Sign in', exact: true}).click();
    await login(page, alice);
    await page.waitForFunction(() => document.querySelectorAll('.card').length === 1);
    await page.locator('.card-star').click();
    await page.locator('.empty', {hasText: 'No starred videos yet.'}).waitFor();
    await page.reload();
    await page.getByRole('button', {name: /^Saved/}).click();
    await page.locator('.empty', {hasText: 'No starred videos yet.'}).waitFor();
    assert.deepEqual(errors, []);
    console.log('Google emulator popup, first-click save, reload, Saved, sign-out, account isolation, and unstar persistence passed.');
    await context.close();
  } catch (error) {
    console.error(await page?.locator('body').innerText());
    await page?.screenshot({path: '/tmp/cliphouse-sync-failure.png', scale: 'css'});
    throw error;
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
