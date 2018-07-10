import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Console {
  ruleResult = new RuleResult("console");
  consoleEntries: string[] = [];
  listen(page: any) {
    let t = this;
    page.on("console", function(msg: any) {
      t.consoleEntries.push(msg.text());
    });
  }

  results(includeMeta: boolean): Promise<RuleResult> {
    let t = this;
    return new Promise(function(resolve: any, reject: any) {
      let status = t.consoleEntries.length == 0 ? 1 : 2;
      var consoleRecommendation = new Recommendation("console-logs", status);

      if (includeMeta) {
        t.ruleResult.meta = t.consoleEntries;
      }
      t.ruleResult.recommendations.push(consoleRecommendation);
      return resolve(t.ruleResult);
    });
  }
}
