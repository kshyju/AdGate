import { ImageRule } from "./rules/image";
import { Debug } from "./debug";

const debug = new Debug();

let imageRule = new ImageRule();

export class Runner {
  public async runRules() {
    const puppeteer = require("puppeteer");

    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      await page.goto("http://brokenlinks.azurewebsites.net/Home/Ads/");

      await page.waitFor(1000); // Hopefully images are loaded by now

      // to do : Get all registed rules here
      var validationResult = await imageRule.validate(page);
      console.log(validationResult);

      await browser.close();
    })();
  }
}
