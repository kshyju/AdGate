import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { AzureSqlFormatter } from "./resultformatter/AzureSqlFormatter";
import { MSSql } from "./resultformatter/MSSql";

const debug = new Debug();

let imageRule = new ImageRule();
const formatter = new AzureSqlFormatter();
const mssql = new MSSql();
export class Runner {
  public async runRules() {
    const puppeteer = require("puppeteer");

    let url="http://brokenlinks.azurewebsites.net/Home/Ads/";

    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      await page.goto(url);

      await page.waitFor(1000); // Hopefully images are loaded by now

      // to do : Get all registed rules here
      var validationResult = [{a:"a"}];//await imageRule.validate(page);
      console.log(25);
      //const r = await mssql.publish();
      console.log(27);
      //console.log(r);
      await browser.close();
      console.log(29);
    })();
  }
}
