import { ImageRule } from "./rules/image";
import { Debug } from "./debug";
import { MSSql } from "./resultformatter/MSSql";
import { Result } from "./types/Result";
import { PerfTiming } from "./types/PerfTiming";

import { Cosmos } from "./resultformatter/Cosmos";
import { NewDocument } from "documentdb";
const { PerformanceObserver, performance } = require("perf_hooks");

const debug = new Debug();

const imageRule = new ImageRule();
const mssql = new MSSql();
var cosmos = new Cosmos();

export class Runner {
  public async runRules(url: string, delay: number): Promise<Result> {
    const puppeteer = require("puppeteer");
    debug.log("URL:" + url);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on("console", function(msg: any) {
      console.log(msg.text());
    });

    await page.goto(url);
    if (delay > 0) {
      await page.waitFor(1000);
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

        return cosmos.create(d).then(function(document: NewDocument) {
          return new Result(document.id, d.resultCount);
        });
        //await mssql.publish(requestId, validationResult);
      })
      .catch(reason => {
        console.error("onRejected function called: " + reason);
        return null;
      });
  }
}
