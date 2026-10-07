const {chromium} = require('playwright');
const {readFileSync, writeFileSync, copyFileSync} = require('node:fs');
const path = require('node:path');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {Scissors} = require('lucide-react');
const scissors = renderToStaticMarkup(React.createElement(Scissors, {size: 64, color: '#4ade80', strokeWidth: 2}));

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
    const image = (name) => `data:image/jpeg;base64,${readFileSync(path.join(__dirname, '../public/previews', name + '.jpg')).toString('base64')}`;
    await page.setContent(`<!doctype html><html><head><style>
      * { box-sizing: border-box; } body { margin: 0; background: #0e0f12; color: #fff; font-family: Arial, sans-serif; padding: 48px; }
      header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
      h1 { display: flex; align-items: center; gap: 18px; font-size: 64px; margin: 0; letter-spacing: 0; } header span { color: #4ade80; font-size: 22px; }
      .previews { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: minmax(0, 1fr); height: 355px; gap: 18px; }
      img { min-width: 0; min-height: 0; width: 100%; height: 355px; object-fit: contain; background: #16181d; border-radius: 6px; }
      footer { margin-top: 24px; font-size: 24px; color: #bcc2cd; }
    </style></head><body><header><h1>${scissors}cliphou.se</h1><span>Find your next video.</span></header>
    <div class="previews">${['stack-kicklab', 'flex-drop', 'riso-gig'].map((name) => `<img src="${image(name)}">`).join('')}</div>
    <footer>Make it yours.</footer></body></html>`);
    await page.locator('img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    await page.screenshot({path: path.join(__dirname, '../public/social.png'), scale: 'css'});
    const icon = renderToStaticMarkup(React.createElement('svg', {xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 64 64', width: 64, height: 64},
      React.createElement('rect', {width: 64, height: 64, rx: 10, fill: '#0e0f12'}),
      React.createElement(Scissors, {x: 11, y: 11, width: 42, height: 42, color: '#4ade80', strokeWidth: 2})));
    writeFileSync(path.join(__dirname, '../public/favicon.svg'), icon);
    copyFileSync(path.join(path.dirname(require.resolve('lucide-react/package.json')), 'LICENSE'), path.join(__dirname, '../public/lucide-LICENSE.txt'));
    for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-512.png', 512]]) {
      await page.setViewportSize({width: size, height: size});
      await page.setContent(`<style>body{margin:0}svg{display:block;width:100vw;height:100vh}</style>${icon}`);
      await page.screenshot({path: path.join(__dirname, '../public', name), scale: 'css'});
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
