const { test, expect, chromium } = require('@playwright/test');

test('hero canvas + JS errors', async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  await page.goto('file:///C:/Users/Evgeniy/feed-up/index.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(4000);

  const rvTotal = await page.evaluate(() => document.querySelectorAll('.rv').length);
  const rvVis   = await page.evaluate(() => document.querySelectorAll('.rv.vis').length);
  const orbitDefined = await page.evaluate(() => typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined');
  const canvasEl = await page.$('#three-canvas');

  console.log('rv:', rvTotal, 'vis:', rvVis, 'OrbitControls:', orbitDefined);
  errors.forEach(e => console.log(e));
  if (!errors.length) console.log('No JS errors');

  await browser.close();
  expect(errors.length).toBe(0);
  expect(rvVis).toBe(rvTotal);
});
