import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Coverage {
  dialogPresent: boolean = false;;
  async listen(page: any) {

    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage()
    ]);

  }

  async results(page: any, includeMeta: boolean): Promise<RuleResult> {

    let ruleResult = new RuleResult("coverage");

    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);


    //JS coverage
    let jsTotalBytes = 0;
    let jsUsedBytes = 0;

    for (const entry of jsCoverage) {
      jsTotalBytes += entry.text.length;
      for (const range of entry.ranges)
        jsUsedBytes += range.end - range.start - 1;
    }
    let jsTotalBytesUsed = jsUsedBytes / jsTotalBytes * 100;

    let jsStatus = 1;
    if (jsTotalBytesUsed <= 60 && jsTotalBytesUsed > 25) {
      jsStatus = 2;
    }
    else if (jsTotalBytesUsed <= 25) {
      jsStatus = 3;
    }
    var recommendation = new Recommendation("js-coverage", jsStatus);
    ruleResult.recommendations.push(recommendation);

    //CSS coverage

    let cssTotalBytes = 0;
    let cssUsedBytes = 0;
    for (const entry of cssCoverage) {
      cssTotalBytes += entry.text.length;
      for (const range of entry.ranges)
        cssUsedBytes += range.end - range.start - 1;
    }
    let cssTotalBytesUsed = cssUsedBytes / cssTotalBytes * 100;

    let cssStatus = 1;
    if (cssTotalBytesUsed <= 60 && cssTotalBytesUsed > 25) {
      cssStatus = 2;
    }
    else if (cssTotalBytesUsed <= 25) {
      cssStatus = 3;
    }

    var cssRecommendation = new Recommendation("css-coverage", cssStatus);
    ruleResult.recommendations.push(cssRecommendation);

    if (includeMeta) {
      ruleResult.meta = { cssTotalBytesUsed: cssTotalBytesUsed, jsTotalBytesUsed: jsTotalBytesUsed };
    }

    return ruleResult;
  }
}
