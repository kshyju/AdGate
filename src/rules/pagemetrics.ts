import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class PageMetrics {
 

  async results(page:any, includeMeta: boolean): Promise<RuleResult> {
    let t = this;
    let ruleResult = new RuleResult("pageMetrics");
    var pageMetrics = await page.metrics();

    let nodeCountStatus = 1;
    var nodeCountRecommendation = new Recommendation("node-count", nodeCountStatus);
    if (includeMeta) {
      ruleResult.meta = pageMetrics;
    }
    ruleResult.recommendations.push(nodeCountRecommendation);

    return ruleResult;
  }
}
