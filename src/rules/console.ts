import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";

export class Console {
  ruleResult = new RuleResult([]);
  private consoleEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("console", function(msg: any) {
      t.consoleEntries.push(msg.text());
    });
  }

  results(): RuleResult {
    let status= this.consoleEntries.length==0?1:2;
    var consoleLogRecommendation = new Recommendation(
      "console-logs",
      status
    );

     this.ruleResult.recommendations.push(consoleLogRecommendation);
     return this.ruleResult;
  }
}
