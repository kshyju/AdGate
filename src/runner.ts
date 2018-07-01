import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { AzureSqlFormatter } from "./resultformatter/AzureSqlFormatter";
import { MSSql } from "./resultformatter/MSSql";
import { ValidationResult } from "./types/ValidationResult";

const debug = new Debug();

let imageRule = new ImageRule();
const formatter = new AzureSqlFormatter();
const mssql = new MSSql();
export class Runner {
  public async runRules(url:string) {
    const puppeteer = require("puppeteer");
    console.log("URL:"+url);
   // let url = "http://brokenlinks.azurewebsites.net/Home/Ads/";

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor(1000);

    // to do : Get all registed rules here
    var validationResult = await imageRule.validate(page);
    await browser.close();
    var resultId = await mssql.publish(url, validationResult);
    return resultId;
  }
}
