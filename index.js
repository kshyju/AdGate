const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.nytimes.com/');

    console.log('Scrolling through page');

    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            
        });
    });

    console.log('Finished scrolling');
    await browser.close();
})();