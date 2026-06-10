// Use playwright CLI module directly
const { chromium } = require('C:/Users/Evgeniy/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  await page.goto('file:///C:/Users/Evgeniy/feed-up/index.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(5000);

  const rvTotal = await page.evaluate(() => document.querySelectorAll('.rv').length);
  const rvVis   = await page.evaluate(() => document.querySelectorAll('.rv.vis').length);
  const checks  = await page.evaluate(() => ({
    THREE: typeof THREE !== 'undefined',
    OrbitControls: typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined',
    canvas: !!document.getElementById('three-canvas'),
  }));

  console.log('rv:', rvTotal, '/ vis:', rvVis);
  console.log('Checks:', JSON.stringify(checks));
  console.log('JS Errors:', errors.length ? errors : ['none']);

  await browser.close();
})();
