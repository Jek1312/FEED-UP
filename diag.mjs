import { chromium } from 'playwright';
import path from 'path';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
});
page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));

const filePath = 'file:///C:/Users/Evgeniy/feed-up/index.html';
await page.goto(filePath, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(3000);

const canvas = await page.$('#three-canvas');
const canvasVisible = canvas ? await canvas.isVisible() : false;
const rvTotal = await page.evaluate(() => document.querySelectorAll('.rv').length);
const rvVis   = await page.evaluate(() => document.querySelectorAll('.rv.vis').length);

console.log('=== RESULTS ===');
console.log('Canvas visible:', canvasVisible);
console.log('rv total:', rvTotal, '/ visible:', rvVis);
errors.forEach(e => console.log(e));
if (errors.length === 0) console.log('No JS errors detected');

await browser.close();
