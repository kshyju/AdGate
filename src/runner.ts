import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { Result } from "./types/Result";
import { Cosmos } from "./resultformatter/Cosmos";
import { NewDocument } from "documentdb";
import { Requests } from './rules/requests';
import { Console } from './rules/Console';
import { Errors  } from './rules/errors';

const debug = new Debug();

const imageRule = new ImageRule();
const requestRule = new Requests();
const consoleRule = new Console();
const errorRule = new Errors();

var cosmos = new Cosmos();

export class Runner {
  public async runRules(url: string, delay: number): Promise<Result> {
    debug.log(`Analyzing URL:${url}`);

    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    //await page.setRequestInterception(true);


    //Register the rules
    consoleRule.listen(page);
    requestRule.listen(page);
    errorRule.listen(page);

    await page.goto(url);
    if (delay > 0) {
      await page.waitFor(delay * 1000);
    }

    const errorEntries = errorRule.results();
    const consoleEntries = consoleRule.results();
    const requestEntries = requestRule.results();

    // to do
    // 1. Get DOMContentLoaded time
    // 2. MB transferred
    // 3. Load time ?
    // 4. Extra images being downloaded, but not being used(visible ?)

    return imageRule
      .validate(page)
      .then(async function (validationResults) {

        const d = {
          id: "",
          url: url,
          delay: delay,
          result: {
            image: validationResults,
            consoleEntries : consoleEntries,
            requestEntries:requestEntries,
            errorEntries:errorEntries
          },
          issueCount: (validationResults.length+consoleEntries.length + requestEntries.length + errorEntries.length)

        };
        await browser.close();


        return cosmos.create(d).then(function (document: NewDocument) {
          return new Result(document.id, d.issueCount);
        });
      })
      .catch(reason => {
        console.log("onRejected function called: " + reason);
        return null;
      });
  }
}
