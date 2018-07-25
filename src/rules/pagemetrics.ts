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


    let eventListenerCountStatus = 1;
    var eventListenerCount = pageMetrics.JSEventListeners;

    if (eventListenerCount<=100 && eventListenerCount>10) {
      eventListenerCountStatus = 2;
    }
    else if (eventListenerCount > 100) {
      eventListenerCountStatus = 3;
    }
    var jsListenerCountRecommendation = new Recommendation("js-listener-count", eventListenerCountStatus);

    ruleResult.recommendations.push(jsListenerCountRecommendation);


    //Script duration

    let scriptDurationStatus = 1;
    var scriptDuration = pageMetrics.ScriptDuration;

    if (scriptDuration>=1 && scriptDuration<2) {
      scriptDurationStatus = 2;
    }
    else if (scriptDuration > 2) {
      scriptDurationStatus = 3;
    }
    var scriptDurationRecommendation = new Recommendation("script-duration", scriptDurationStatus);

    ruleResult.recommendations.push(scriptDurationRecommendation);


    return ruleResult;
  }
}
