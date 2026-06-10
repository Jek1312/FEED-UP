const { chromium } = require('C:/Users/Evgeniy/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message + '\nSTACK: ' + err.stack));

  await page.goto('file:///C:/Users/Evgeniy/feed-up/index.html', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  const info = await page.evaluate(() => ({
    gsap: typeof gsap !== 'undefined',
    ScrollTrigger: typeof ScrollTrigger !== 'undefined',
    Motion: typeof Motion !== 'undefined',
    THREE: typeof THREE !== 'undefined',
  }));

  console.log('Globals:', JSON.stringify(info));
  errors.forEach(e => console.log(e));
  if (!errors.length) console.log('No JS errors');

  await browser.close();
})();
