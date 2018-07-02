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
    debug.log("URL:"+url);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitFor(1000);

    var requestId = await mssql.saveRequest(url);
    // to do : Get all registed rules here
    var validationResult = await imageRule.validate(page);
    await browser.close();
    await mssql.publish(requestId, validationResult);
    return requestId;
  }
}
