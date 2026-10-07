const {chromium} = require('playwright');
const base = process.env.URL || 'https://cliphou.se/';

(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({viewport: {width, height: 900}});
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
      const own = new Set();
      let bytes = 0;
      cdp.on('Network.responseReceived', ({requestId, response}) => {
        if (new URL(response.url).origin === new URL(base).origin) own.add(requestId);
      });
      cdp.on('Network.loadingFinished', ({requestId, encodedDataLength}) => {
        if (own.has(requestId)) bytes += encodedDataLength;
      });
      await page.goto(base);
      await page.locator('.card').first().waitFor();
      await page.waitForTimeout(3000);
      const initialBytes = bytes;
      for (let step = 0; step < 30; step++) {
        const end = await page.evaluate(() => {
          window.scrollBy(0, innerHeight * 0.75);
          return scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
        });
        await page.waitForTimeout(750);
        if (end) break;
      }
      await page.waitForTimeout(1500);
      console.log(JSON.stringify({width,initialBytes,fullScrollBytes:bytes,initialMB:initialBytes/1e6,fullScrollMB:bytes/1e6}));
      await context.close();
    }
  } finally { await browser.close(); }
})().catch((e) => {console.error(e);process.exitCode=1;});
