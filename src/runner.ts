import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { Result } from "./types/Result";
import { Cosmos } from "./resultformatter/Cosmos";
import { NewDocument } from "documentdb";
import { Requests } from "./rules/requests";
import { Console } from "./rules/Console";
import { Errors } from "./rules/errors";
import { RuleResult } from "./types/RuleResult";

const debug = new Debug();

const imageRule = new ImageRule();
const requestRule = new Requests();
const consoleRule = new Console();
const errorRule = new Errors();

var cosmos = new Cosmos();

export class Runner {
  public async runRules(
    url: string,
    delay: number,
    includeMeta: boolean
  ): Promise<Result> {
    debug.log(`Analyzing URL:${url}`);

    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    /*     page.on("console", function(msg: any) {
      console.log(msg.text());
    }); */

    //await page.setRequestInterception(true);

    //Register the rules
    consoleRule.listen(page);
    requestRule.listen(page);
    errorRule.listen(page);

    await page.goto(url);
    if (delay > 0) {
      await page.waitFor(delay * 1000);
    }

    let allRulesResults: RuleResult[] = [];

    //const errorEntries: RuleResult = await errorRule.results();
    //const consoleEntries: RuleResult = consoleRule.results();
    //const requestEntries: RuleResult = requestRule.results();

    //allRulesResults.push(requestEntries);
    // allRulesResults.push(consoleEntries);
    //allRulesResults.push(errorEntries);

    // to do
    // 1. Get DOMContentLoaded time
    // 2. MB transferred
    // 3. Load time ?
    // 4. Extra images being downloaded, but not being used(visible ?)

    var promiseArray = new Array<Promise<any>>();

    promiseArray.push(consoleRule.results(includeMeta));

    promiseArray.push(errorRule.results(includeMeta));
    promiseArray.push(imageRule.validate(page, includeMeta));
    promiseArray.push(requestRule.results(includeMeta));

    var result = Promise.all(promiseArray)
      .then(async (result: any) => {
        await browser.close();

        const d = {
          id: "",
          url: url,
          delay: delay,
          ruleResults: result
        };
        return cosmos.create(d).then(function(document: NewDocument) {
          return new Result(document.id, 0);
        });
      })
      .catch(() => {
        return new Result("", 0);
      });

    return result;
  }
}
