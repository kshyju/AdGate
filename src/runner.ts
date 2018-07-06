import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { Result } from "./types/Result";
import { PerfTiming } from "./types/PerfTiming";

import { Cosmos } from "./resultformatter/Cosmos";
import { NewDocument } from "documentdb";
const { PerformanceObserver, performance } = require("perf_hooks");
const debug = new Debug();

const imageRule = new ImageRule();
var cosmos = new Cosmos();

export class Runner {
  public async runRules(url: string, delay: number): Promise<Result> {
    debug.log(`Analyzing URL:${url}`);

    const puppeteer = require("puppeteer");      

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on("console", function(msg: any) {
      console.log('FROM PAGE : '+msg.text());
    });

    await page.goto(url);
    if (delay > 0) {
      await page.waitFor(delay*1000);
    }

    performance.mark("imageRuleStart");

    return imageRule
      .validate(page)
      .then(async function(validationResults) {
        performance.mark("imageRuleEnd");
        performance.measure(
          "imageValidation",
          "imageRuleStart",
          "imageRuleEnd"
        );
        const marks = performance.getEntriesByType("measure");
        performance.clearMarks();

        const d = {
          id: "",
          url: url,
          delay:delay,
          result: {
            image: validationResults
          },
          resultCount: validationResults.length,
          perfTimings: marks.map(function(measure: any) {
            var p = new PerfTiming();
            p[measure.name]= measure.duration ;
            return p;
          })
        };
        await browser.close();
        performance.clearMarks();
        performance.clearMeasures();
        
        return cosmos.create(d).then(function(document: NewDocument) {
          return new Result(document.id, d.resultCount);
        });
      })
      .catch(reason => {
        debug.log("onRejected function called: " + reason);
        return null;
      });
  }
}
