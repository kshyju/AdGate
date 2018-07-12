import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class PerfTiming {
  



  async results(page: any, includeMeta: boolean): Promise<RuleResult> {
    let t = this;

    let ruleResult = new RuleResult("perf-timings");

    const timingData = await page.evaluate(() => {
      var timings: { [key: string]: any[] } = {};
      performance.getEntriesByType('paint').map((item: any) => {
        timings[item.name] = item.startTime;
      });
      return timings;
    });

    let status = 1;
    if (timingData["first-contentful-paint"] >= 1000 && timingData["first-contentful-paint"] <= 2000) {
      status = 2;
    }
    else if (timingData["first-contentful-paint"] > 2000) {
      status = 3;
    }
   

    var errorRecommendation = new Recommendation("paint-timings", status);
    if (includeMeta) {
      ruleResult.meta = timingData;
    }
    ruleResult.recommendations.push(errorRecommendation);
    return ruleResult;

  }
}
