import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Console {
  consoleEntries: string[] = [];
  listen(page: any) {
    let t = this;
    t.consoleEntries = [];
    page.on("console", function(msg: any) {
      t.consoleEntries.push(msg.text());
    });
  }

  results(includeMeta: boolean): Promise<RuleResult> {
    let t = this;
    let ruleResult = new RuleResult("console");

    return new Promise(function(resolve: any, reject: any) {
      let status = t.consoleEntries.length == 0 ? 1 : 2;
      var consoleRecommendation = new Recommendation("console-logs", status);

      if (includeMeta) {
        ruleResult.meta = t.consoleEntries;
      }
      ruleResult.recommendations.push(consoleRecommendation);



      return resolve(ruleResult);
    });
  }
}
