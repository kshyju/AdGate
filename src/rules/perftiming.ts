import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class PerfTiming {




  async results(page: any, includeMeta: boolean): Promise<RuleResult> {
    let t = this;

    let ruleResult = new RuleResult("perf-timings");

    let timingData = await page.evaluate(() => {

      var paintTimings: { [key: string]: any[] } = {};
      performance.getEntriesByType('paint').map((item: any) => {
        paintTimings[item.name] = item.startTime;
      });

      var navigationTimings = performance.getEntriesByType('navigation')[0];

      var navTimings: { [key: string]: any[] } = {};

      for (var key in navigationTimings) {
        navTimings[key] = navigationTimings[key];
      }

      return { paintTimings: paintTimings, navTimings: navTimings };

    });


    let status = 1;
     if (timingData.paintTimings["first-contentful-paint"] >= 1000 && timingData.paintTimings["first-contentful-paint"] <= 2000) {
       status = 2;
     }
     else if (timingData.paintTimings["first-contentful-paint"] > 2000) {
       status = 3;
     }
    var errorRecommendation = new Recommendation("paint-timings", status);
    if (includeMeta) {
      ruleResult.meta = timingData;
    }
    ruleResult.recommendations.push(errorRecommendation);

    // Nav timing metrics

    let loadStatus = 1;
    var timeToFirstByte = timingData.navTimings["responseStart"] - timingData.navTimings["fetchStart"];

    if (timeToFirstByte >= 200 && timeToFirstByte <= 600) {
      loadStatus = 2;
    }
    else if (timeToFirstByte > 600) {
      loadStatus = 3;
    }
    var responseTimeRecommendation = new Recommendation("response-time", loadStatus);

    ruleResult.recommendations.push(responseTimeRecommendation);


    return ruleResult;

  }
}
