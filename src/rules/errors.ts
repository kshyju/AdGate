import { Debug } from "../debug";
import { Result } from "../types/Result";
import { RuleResult } from "../types/RuleResult";
import { Recommendation } from "../types/Recommendation";
import { resolve } from "url";

export class Errors {
  ruleResult = new RuleResult([]);

  errorEntries: string[]=[];
  listen(page: any) {
    let t = this;
    page.on("error", function(msg: any) {
      t.errorEntries.push(msg.text());
    });
  }

  results(includeMeta: boolean): Promise<RuleResult> {

    let t= this;
    return new Promise(function(resolve:any,reject:any) {

      let status= t.errorEntries.length==0?1:2;
      var errorRecommendation = new Recommendation(
        "console-errors",
        status
      );
      if(includeMeta)
      {
        t.ruleResult.meta = t.errorEntries;
      }
       t.ruleResult.recommendations.push(errorRecommendation);
       return resolve(t.ruleResult);

    });
  }
}
