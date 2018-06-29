console.log("This is TS inside");
console.log('index');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://example.com');

  await browser.close();
})();