import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { MSSql } from "./resultformatter/MSSql";
import { ValidationResult } from "./types/ValidationResult";

const debug = new Debug();

const imageRule = new ImageRule();
const mssql = new MSSql();
export class Runner {
  public async runRules(url: string, delay: number):Promise<number> {
    const puppeteer = require("puppeteer");
    debug.log("URL:" + url);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', function (msg: any) { console.log(msg.text()) });

    await page.goto(url);
    if (delay > 0) {
      await page.waitFor(1000);
    }

    var requestId = await mssql.saveRequest(url);
    console.log('requestId:',requestId);
    return imageRule.validate(page).then(async function (validationResult) {

      await browser.close();
      await mssql.publish(requestId, validationResult);
      return requestId;
    })
    .catch( reason => {
      console.error( 'onRejected function called: ' + reason );
      return 0;
    });
  }
}
