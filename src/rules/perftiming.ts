import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class PerfTiming {




  async results(page: any, includeMeta: boolean): Promise<RuleResult> {
    let t = this;

    let ruleResult = new RuleResult("perf-timings");
    console.log(15);

    let timingData = await page.evaluate(() => {

      console.log(19);
      //return new Promise((resolve, reject) => {

        var timings: { [key: string]: any[] } = {};
        console.log(18);
        performance.getEntriesByType('paint').map((item: any) => {
          timings[item.name] = item.startTime;
        });
        console.log('21');

        var navTimings = performance.getEntriesByType('navigation')[0];
        console.log('navTimings',JSON.stringify(navTimings));
        return navTimings;

      //});

    });

    console.log(37);
    console.log(JSON.stringify(timingData));

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
    var ttfb = timingData.navTimings["responseStart"]-timingData.navTimings["fetchStart"];

    if (ttfb >= 200 && ttfb <= 600) {
      loadStatus = 2;
    }
    else if (ttfb > 600) {
      loadStatus = 3;
    }
    var responseTimeRecommendation = new Recommendation("response-time", loadStatus);

    ruleResult.recommendations.push(responseTimeRecommendation);


    return ruleResult;

  }
}
